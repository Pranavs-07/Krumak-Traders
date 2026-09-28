/**
 * System Constants for KRUMAK TRADERS E-Commerce Backend
 */

module.exports = {
  ROLES: {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
  },
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  },
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
  },
  PAYMENT_METHODS: {
    CARD: 'card',
    UPI: 'upi',
    NETBANKING: 'netbanking',
    PO: 'po',
    COD: 'cod',
    DUMMY: 'dummy',
  },
  INQUIRY_STATUS: {
    NEW: 'new',
    IN_PROGRESS: 'in-progress',
    OPEN: 'open',
    RESOLVED: 'resolved',
  },
};
