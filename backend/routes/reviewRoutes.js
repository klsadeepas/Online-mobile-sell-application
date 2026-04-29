const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getProductReviews, 
  getAllReviews, 
  updateReview, 
  deleteReview 
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/', protect, admin, getAllReviews);
router.put('/:id', protect, admin, updateReview);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;