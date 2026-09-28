const jwt = require('jsonwebtoken');

/**
 * Generate short-lived JWT Access Token
 * @param {string} userId - User ID
 * @param {string} role - User Role (customer/admin)
 * @returns {string} Signed JWT Access Token
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'krumak_super_secret_jwt_access_key_2026_production_ready',
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

/**
 * Generate long-lived JWT Refresh Token
 * @param {string} userId - User ID
 * @returns {string} Signed JWT Refresh Token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'krumak_super_secret_jwt_refresh_key_2026_long_lived',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

/**
 * Verify a JWT Token
 * @param {string} token 
 * @param {string} secret 
 * @returns {object} Decoded payload
 */
const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret || 'krumak_super_secret_jwt_access_key_2026_production_ready');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
