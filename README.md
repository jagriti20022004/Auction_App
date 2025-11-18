# MERN Auction Application

A full-stack real-time auction platform built with MongoDB, Express, React, and Node.js. Features include real-time bidding, JWT authentication, role-based access control, rate limiting, and advanced search capabilities.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- ⚡ **Real-time Bidding** - Live updates using WebSocket (Socket.io)
- 🔍 **Advanced Search** - Filter by category, price range, status, and more
- 👥 **Role-Based Access Control** - Admin and user roles with different permissions
- 🛡️ **Rate Limiting** - Protection against abuse with configurable limits
- 📱 **Responsive UI** - Modern design with Tailwind CSS
- 🎯 **Auction Management** - Create, view, and manage auctions
- 📊 **User Dashboard** - Track your auctions, bids, and wins

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Express Rate Limit for API protection
- Bcrypt for password hashing

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Socket.io Client for real-time updates
- Tailwind CSS for styling
- Vite as build tool
- React Toastify for notifications

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Installation & Setup

### Step 1: Clone or Navigate to Project Directory

```bash
cd auction_app
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Set Up Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
# On Windows (PowerShell)
New-Item -ItemType File -Path .env

# On Mac/Linux
touch .env
```

Add the following content to `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auction_app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Note:** 
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- Change `JWT_SECRET` to a strong random string in production

### Step 4: Start MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running on your system
# On Windows, MongoDB usually runs as a service
# On Mac/Linux, you might need to start it manually:
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `.env` file

### Step 5: Start the Backend Server

```bash
# Make sure you're in the backend directory
cd backend

# Start the server (development mode with auto-reload)
npm run dev

# OR start in production mode
npm start
```

You should see:
```
MongoDB Connected
Server running on port 5000
```

### Step 6: Install Frontend Dependencies

Open a **new terminal window** (keep backend running):

```bash
cd frontend
npm install
```

### Step 7: Start the Frontend Development Server

```bash
# Make sure you're in the frontend directory
cd frontend

# Start the development server
npm run dev
```

You should see:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Step 8: Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Quick Start Summary

Here's the complete sequence of commands:

```bash
# Terminal 1 - Backend
cd backend
npm install
# Create .env file with the environment variables above
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev

# Then open http://localhost:3000 in your browser
```

## Project Structure

```
auction_app/
├── backend/
│   ├── models/          # MongoDB models (User, Auction, Bid)
│   ├── routes/          # API routes (auth, auctions, users)
│   ├── middleware/      # Auth & rate limiting middleware
│   ├── server.js        # Express server setup
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable React components
    │   ├── pages/       # Page components
    │   ├── context/     # React context (AuthContext)
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Auctions
- `GET /api/auctions` - Get all auctions (with search/filter)
- `GET /api/auctions/:id` - Get single auction
- `POST /api/auctions` - Create auction (protected)
- `PUT /api/auctions/:id` - Update auction (protected)
- `DELETE /api/auctions/:id` - Delete auction (protected)
- `GET /api/auctions/categories/list` - Get all categories

### Users
- `GET /api/users/profile` - Get user profile with stats (protected)
- `GET /api/users/my-auctions` - Get user's auctions (protected)
- `GET /api/users/my-bids` - Get user's bids (protected)

## Usage Guide

### Creating an Account
1. Click "Register" in the navigation
2. Fill in your name, email, and password
3. You'll be automatically logged in

### Creating an Auction
1. Login to your account
2. Click "Create Auction" in the navigation
3. Fill in the auction details:
   - Title and description
   - Starting price
   - Category
   - End date and time
   - Optional image URL
4. Click "Create Auction"

### Bidding on Auctions
1. Browse auctions on the home page
2. Click on an auction to view details
3. Enter your bid amount (must be higher than current price)
4. Click "Place Bid"
5. Watch real-time updates as others bid!

### Advanced Search
1. Use the search bar to find auctions by title/description
2. Click "Show Filters" to access:
   - Category filter
   - Price range (min/max)
   - Status filter (active/ended)
   - Sort options

## Rate Limiting

The application implements rate limiting to prevent abuse:
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Bidding**: 10 bids per minute

## Role-Based Access Control

- **User Role**: Can create auctions, place bids, view own data
- **Admin Role**: Can do everything users can, plus manage all auctions

To create an admin user, you can manually update the user document in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally, or
- Check your MongoDB Atlas connection string in `.env`
- Verify network connectivity

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Vite will automatically use the next available port

### CORS Errors
- Ensure backend is running on port 5000
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL

### Socket.io Connection Issues
- Ensure backend server is running
- Check that token is being sent correctly
- Verify `FRONTEND_URL` in backend `.env`

## Production Deployment

Before deploying to production:

1. **Environment Variables**: Use secure values for `JWT_SECRET`
2. **MongoDB**: Use MongoDB Atlas or a managed database service
3. **CORS**: Update `FRONTEND_URL` to your production domain
4. **Build Frontend**: Run `npm run build` in frontend directory
5. **HTTPS**: Use HTTPS for secure WebSocket connections
6. **Rate Limiting**: Adjust rate limits based on your needs

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

