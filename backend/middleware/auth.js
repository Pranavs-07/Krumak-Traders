const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResponse } = require('../utils/helpers');

/**
 * Protect routes - Verifies JWT Bearer token
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendResponse(res, 401, {
      success: false,
      message: 'Not authorized to access this resource. No authentication token provided.',
      error: 'UNAUTHORIZED_NO_TOKEN',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'krumak_super_secret_jwt_access_key_2026_production_ready'
    );

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendResponse(res, 401, {
        success: false,
        message: 'The user belonging to this token no longer exists.',
        error: 'USER_NOT_FOUND',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendResponse(res, 401, {
        success: false,
        message: 'Your token has expired. Please log in again or refresh your session.',
        error: 'TOKEN_EXPIRED',
      });
    }
    return sendResponse(res, 401, {
      success: false,
      message: 'Invalid authorization token. Access denied.',
      error: 'INVALID_TOKEN',
    });
  }
};

/**
 * Optional authentication - If token is present and valid, attaches req.user.
 * If no token or invalid, proceeds as guest without throwing an error.
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'krumak_super_secret_jwt_access_key_2026_production_ready'
    );
    const user = await User.findById(decoded.id).select('-password');
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }

  next();
};

/**
 * Authorize specified roles (e.g. 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Authentication required before checking permissions.',
        error: 'UNAUTHENTICATED',
      });
    }

    if (!roles.includes(req.user.role)) {
      return sendResponse(res, 403, {
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource.`,
        error: 'FORBIDDEN',
      });
    }

    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  authorize,
};
