const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auction_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auctions', require('./routes/auctions'));
app.use('/api/users', require('./routes/users'));

// Socket.io for real-time bidding
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);

  socket.on('join-auction', (auctionId) => {
    socket.join(`auction-${auctionId}`);
    console.log(`User ${socket.userId} joined auction ${auctionId}`);
  });

  socket.on('place-bid', async (data) => {
    const { auctionId, bidAmount } = data;
    const Auction = require('./models/Auction');
    const Bid = require('./models/Bid');
    
    try {
      const auction = await Auction.findById(auctionId);
      if (!auction) {
        socket.emit('bid-error', { message: 'Auction not found' });
        return;
      }

      if (auction.status !== 'active') {
        socket.emit('bid-error', { message: 'Auction is not active' });
        return;
      }

      if (new Date() > auction.endTime) {
        socket.emit('bid-error', { message: 'Auction has ended' });
        return;
      }

      if (bidAmount <= auction.currentPrice) {
        socket.emit('bid-error', { message: 'Bid must be higher than current price' });
        return;
      }

      const bid = new Bid({
        auction: auctionId,
        bidder: socket.userId,
        amount: bidAmount
      });

      await bid.save();

      auction.currentPrice = bidAmount;
      auction.highestBidder = socket.userId;
      await auction.save();

      const bidWithUser = await Bid.findById(bid._id).populate('bidder', 'name email');
      
      io.to(`auction-${auctionId}`).emit('new-bid', {
        bid: bidWithUser,
        currentPrice: bidAmount
      });
    } catch (error) {
      socket.emit('bid-error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

