const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// Cart Endpoints (Protected by user JWT)
router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.post('/', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.put('/:itemId', protect, updateCartItem);
router.delete('/remove/:productId', protect, removeFromCart);
router.delete('/:itemId', protect, removeFromCart);
router.delete('/', protect, clearCart);

module.exports = router;
