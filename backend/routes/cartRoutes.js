const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:userId', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:userId/:itemId', protect, updateCartItem);
router.delete('/:userId/:itemId', protect, removeFromCart);
router.delete('/:userId', protect, clearCart);

module.exports = router;