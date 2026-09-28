const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const { productRules, validate } = require('../middleware/validator');

const {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} = require('../controllers/productController');

const {
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const {
  getAllOrdersAdmin,
  updateOrderStatus,
} = require('../controllers/orderController');

const {
  getAllInquiries,
  updateInquiryStatus,
} = require('../controllers/inquiryController');

const {
  getAllUsers,
  getDashboardStats,
  getActivityLogs,
} = require('../controllers/adminController');

// All admin routes require authentication and 'admin' role
router.use(protect, authorize('admin'));

// Admin Dashboard & Metrics
router.get('/dashboard-stats', getDashboardStats);
router.get('/dashboard', getDashboardStats);
router.get('/activity-logs', getActivityLogs);

// Admin User Management
router.get('/users', getAllUsers);

// Admin Product Management
router.post('/products', productRules, validate, createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/:id/upload-image', upload.single('image'), uploadProductImage);

// Admin Category Management
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Admin Order Management
router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id', updateOrderStatus);

// Admin Inquiry Management
router.get('/inquiries', getAllInquiries);
router.put('/inquiries/:id/status', updateInquiryStatus);
router.put('/inquiries/:id', updateInquiryStatus);

module.exports = router;
