const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');
const { orderRules, validate } = require('../middleware/validator');

// Order placement & customer tracking
router.post('/', optionalAuth, orderRules, validate, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', optionalAuth, getOrderById);

module.exports = router;
