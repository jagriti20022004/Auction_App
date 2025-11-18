const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const { protect, authorize } = require('../middleware/auth');
const { apiLimiter, bidLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// @route   GET /api/auctions
// @desc    Get all auctions with advanced search
// @access  Public
router.get('/',
  apiLimiter,
  [
    query('search').optional().trim(),
    query('category').optional().trim(),
    query('status').optional().isIn(['active', 'ended', 'cancelled']),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('sortBy').optional().isIn(['price', 'endTime', 'createdAt', 'bidCount']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        search,
        category,
        status,
        minPrice,
        maxPrice,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = req.query;

      // Build query
      const query = {};

      // Text search
      if (search) {
        query.$text = { $search: search };
      }

      // Category filter
      if (category) {
        query.category = category;
      }

      // Status filter
      if (status) {
        query.status = status;
      } else {
        // Default to active auctions
        query.status = 'active';
      }

      // Price range filter
      if (minPrice || maxPrice) {
        query.currentPrice = {};
        if (minPrice) query.currentPrice.$gte = parseFloat(minPrice);
        if (maxPrice) query.currentPrice.$lte = parseFloat(maxPrice);
      }

      // Sort options
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query
      const auctions = await Auction.find(query)
        .populate('seller', 'name email')
        .populate('highestBidder', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Auction.countDocuments(query);

      res.json({
        success: true,
        count: auctions.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        data: auctions
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   GET /api/auctions/:id
// @desc    Get single auction
// @access  Public
router.get('/:id', apiLimiter, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'name email')
      .populate('highestBidder', 'name email');

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Get bids for this auction
    const bids = await Bid.find({ auction: req.params.id })
      .populate('bidder', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: {
        auction,
        bids
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auctions
// @desc    Create new auction
// @access  Private
router.post('/',
  apiLimiter,
  protect,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('startingPrice').isFloat({ min: 0 }).withMessage('Starting price must be a positive number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('endTime').isISO8601().withMessage('End time must be a valid date')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, startingPrice, category, image, endTime } = req.body;

      // Check if end time is in the future
      if (new Date(endTime) <= new Date()) {
        return res.status(400).json({ message: 'End time must be in the future' });
      }

      const auction = await Auction.create({
        title,
        description,
        startingPrice,
        currentPrice: startingPrice,
        category,
        image: image || '',
        endTime,
        seller: req.user._id
      });

      const populatedAuction = await Auction.findById(auction._id)
        .populate('seller', 'name email');

      res.status(201).json({
        success: true,
        data: populatedAuction
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   PUT /api/auctions/:id
// @desc    Update auction
// @access  Private (Seller or Admin)
router.put('/:id',
  apiLimiter,
  protect,
  async (req, res) => {
    try {
      const auction = await Auction.findById(req.params.id);

      if (!auction) {
        return res.status(404).json({ message: 'Auction not found' });
      }

      // Check if user is seller or admin
      if (auction.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this auction' });
      }

      const { title, description, category, image } = req.body;

      if (title) auction.title = title;
      if (description) auction.description = description;
      if (category) auction.category = category;
      if (image !== undefined) auction.image = image;

      await auction.save();

      const updatedAuction = await Auction.findById(auction._id)
        .populate('seller', 'name email')
        .populate('highestBidder', 'name email');

      res.json({
        success: true,
        data: updatedAuction
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   DELETE /api/auctions/:id
// @desc    Delete auction
// @access  Private (Seller or Admin)
router.delete('/:id',
  apiLimiter,
  protect,
  async (req, res) => {
    try {
      const auction = await Auction.findById(req.params.id);

      if (!auction) {
        return res.status(404).json({ message: 'Auction not found' });
      }

      // Check if user is seller or admin
      if (auction.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this auction' });
      }

      await Bid.deleteMany({ auction: req.params.id });
      await auction.deleteOne();

      res.json({
        success: true,
        message: 'Auction deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   GET /api/auctions/categories/list
// @desc    Get list of categories
// @access  Public
router.get('/categories/list', apiLimiter, async (req, res) => {
  try {
    const categories = await Auction.distinct('category');
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

