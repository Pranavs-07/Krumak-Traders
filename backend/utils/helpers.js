/**
 * Utility Helpers for KRUMAK TRADERS API
 */

/**
 * Standardized API response sender
 * Ensures consistent JSON response structure { success, message, data, error }
 * while maintaining backward compatibility with root property accessors.
 */
const sendResponse = (res, statusCode = 200, { success = true, message = '', data = null, error = null }) => {
  const responseBody = {
    success,
    message,
    data,
    error,
  };

  // If data is an object and not an array, spread top-level keys for maximum frontend compatibility
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    Object.keys(data).forEach((key) => {
      if (!(key in responseBody)) {
        responseBody[key] = data[key];
      }
    });
  }

  return res.status(statusCode).json(responseBody);
};

/**
 * Extract pagination parameters from Express request query
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 12));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

module.exports = {
  sendResponse,
  getPagination,
};
