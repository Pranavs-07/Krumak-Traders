const rateLimit = require('express-rate-limit');
const { sendResponse } = require('../utils/helpers');

/**
 * Rate limiter for authentication routes (login, register, forgot-password)
 * Prevents brute-force credential stuffing and password guessing attacks.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    return sendResponse(res, 429, {
      success: false,
      message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
      error: 'TOO_MANY_REQUESTS',
    });
  },
});

/**
 * General API Rate Limiter
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendResponse(res, 429, {
      success: false,
      message: 'API rate limit reached. Please slow down your requests.',
      error: 'RATE_LIMIT_EXCEEDED',
    });
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};
