const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  searchProducts,
  getProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { productRules, validate } = require('../middleware/validator');

// Public Product Endpoints
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/categories', getProductCategories);
router.get('/:id', getProductById);

// Admin-accessible directly on /api/products
router.post('/', protect, authorize('admin'), productRules, validate, createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
