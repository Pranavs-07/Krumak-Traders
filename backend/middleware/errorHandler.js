const { sendResponse } = require('../utils/helpers');

/**
 * Centralized Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error stack in development
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error Handler] ${req.method} ${req.originalUrl}:`, err);
  }

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of '${err.value}'`;
    return sendResponse(res, 404, {
      success: false,
      message,
      error: 'RESOURCE_NOT_FOUND',
    });
  }

  // 2. Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const val = err.keyValue ? err.keyValue[field] : '';
    const message = `A record with ${field} '${val}' already exists.`;
    return sendResponse(res, 409, {
      success: false,
      message,
      error: 'DUPLICATE_KEY_ERROR',
      data: { field, value: val },
    });
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendResponse(res, 400, {
      success: false,
      message: messages[0] || 'Database validation error',
      error: 'VALIDATION_ERROR',
      data: { errors: messages },
    });
  }

  // 4. JWT Authentication Errors
  if (err.name === 'JsonWebTokenError') {
    return sendResponse(res, 401, {
      success: false,
      message: 'Invalid authorization token. Please login again.',
      error: 'INVALID_TOKEN',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return sendResponse(res, 401, {
      success: false,
      message: 'Authorization token has expired. Please login again.',
      error: 'TOKEN_EXPIRED',
    });
  }

  // 5. Multer File Upload Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendResponse(res, 400, {
        success: false,
        message: 'File size limit exceeded. Max 5MB allowed.',
        error: 'FILE_TOO_LARGE',
      });
    }
    return sendResponse(res, 400, {
      success: false,
      message: `File upload error: ${err.message}`,
      error: 'UPLOAD_ERROR',
    });
  }

  // 6. Generic Default Server Error
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  return sendResponse(res, statusCode, {
    success: false,
    message: error.message || 'Internal server error',
    error: err.name || 'SERVER_ERROR',
    data: process.env.NODE_ENV === 'development' ? { stack: err.stack } : null,
  });
};

module.exports = errorHandler;
