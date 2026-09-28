const express = require('express');
const router = express.Router();
const {
  submitInquiry,
  getAllInquiries,
} = require('../controllers/inquiryController');
const { inquiryRules, validate } = require('../middleware/validator');

// Public inquiry submission & fallback
router.post('/', inquiryRules, validate, submitInquiry);
router.get('/', getAllInquiries);

module.exports = router;
