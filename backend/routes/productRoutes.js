const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getFeaturedProducts, 
  getFlashSaleProducts,
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getBrands,
  getRelatedProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/flash-sales', getFlashSaleProducts);
router.get('/brands', getBrands);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);
router.get('/', getProducts);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;