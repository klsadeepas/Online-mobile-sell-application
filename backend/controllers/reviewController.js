const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      product: productId,
      user: req.user._id,
      name: req.user.name,
      rating,
      comment
    });

    const createdReview = await review.save();

    // Update product rating
    const reviews = await Review.find({ product: productId, isApproved: true });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    
    product.rating = Math.round(avgRating * 10) / 10;
    product.numReviews = reviews.length;
    await product.save();

    res.status(201).json(createdReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId,
      isApproved: true 
    }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const count = await Review.countDocuments();
    const reviews = await Review.find()
      .populate('product', 'name brand')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.json({
      reviews,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review approval
// @route   PUT /api/reviews/:id
// @access  Private/Admin
const updateReview = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findById(req.params.id);

    if (review) {
      review.isApproved = isApproved;
      const updatedReview = await review.save();

      // Update product rating
      const reviews = await Review.find({ 
        product: review.product, 
        isApproved: true 
      });
      const avgRating = reviews.length > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
        : 0;
      
      const product = await Product.findById(review.product);
      if (product) {
        product.rating = Math.round(avgRating * 10) / 10;
        product.numReviews = reviews.length;
        await product.save();
      }

      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      const productId = review.product;
      await review.deleteOne();

      // Update product rating
      const reviews = await Review.find({ product: productId, isApproved: true });
      const avgRating = reviews.length > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
        : 0;
      
      const product = await Product.findById(productId);
      if (product) {
        product.rating = Math.round(avgRating * 10) / 10;
        product.numReviews = reviews.length;
        await product.save();
      }

      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getAllReviews,
  updateReview,
  deleteReview
};