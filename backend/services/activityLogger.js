const ActivityLog = require('../models/ActivityLog');

/**
 * Log an administrative action to the database
 * @param {Object} params
 * @param {string} params.adminId - Admin User ObjectId
 * @param {string} params.adminName - Admin name
 * @param {string} params.action - Action identifier (e.g. 'CREATE_PRODUCT')
 * @param {string} params.targetType - Target collection / entity
 * @param {any} params.targetId - ID of target entity
 * @param {Object} [params.details] - Extra details
 * @param {string} [params.ipAddress] - Request IP
 */
const logActivity = async ({ adminId, adminName, action, targetType, targetId, details = {}, ipAddress = '' }) => {
  try {
    if (!adminId) return null;
    return await ActivityLog.create({
      adminId,
      adminName: adminName || 'Admin',
      action,
      targetType,
      targetId: targetId ? targetId.toString() : null,
      details,
      ipAddress,
    });
  } catch (err) {
    console.error(`[ActivityLog Error] Failed to log admin action: ${err.message}`);
    return null;
  }
};

module.exports = {
  logActivity,
};
