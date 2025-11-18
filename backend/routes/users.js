const express = require('express');
const Bid = require('../models/Bid');
const Auction = require('../models/Auction');
const { protect, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile with stats
// @access  Private
router.get('/profile', apiLimiter, protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const [auctions, bids, wonAuctions] = await Promise.all([
      Auction.countDocuments({ seller: userId }),
      Bid.countDocuments({ bidder: userId }),
      Auction.countDocuments({ highestBidder: userId, status: 'ended' })
    ]);

    res.json({
      success: true,
      data: {
        user: req.user,
        stats: {
          auctionsCreated: auctions,
          bidsPlaced: bids,
          auctionsWon: wonAuctions
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/my-auctions
// @desc    Get user's auctions
// @access  Private
router.get('/my-auctions', apiLimiter, protect, async (req, res) => {
  try {
    const auctions = await Auction.find({ seller: req.user._id })
      .populate('highestBidder', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: auctions.length,
      data: auctions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/my-bids
// @desc    Get user's bids
// @access  Private
router.get('/my-bids', apiLimiter, protect, async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .populate('auction')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', apiLimiter, protect, authorize('admin'), async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

