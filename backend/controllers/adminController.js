const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const ActivityLog = require('../models/ActivityLog');
const { sendResponse, getPagination } = require('../utils/helpers');

/**
 * @desc    Get all registered users with their order statistics
 * @route   GET /api/admin/users
 * @access  Admin Only
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select('-refreshToken'),
      User.countDocuments(),
    ]);

    // Aggregate order counts per user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const orderCount = await Order.countDocuments({
          $or: [{ userId: u._id }, { 'customer.email': u.email }],
        });

        return {
          id: u._id,
          _id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          company: u.company,
          role: u.role,
          orders: orderCount,
          ordersCount: orderCount,
          joined: u.createdAt ? u.createdAt.toISOString().slice(0, 10) : '2024-01-01',
          createdAt: u.createdAt,
        };
      })
    );

    const totalPages = Math.ceil(total / limit) || 1;

    return sendResponse(res, 200, {
      success: true,
      message: 'Users list retrieved successfully.',
      data: {
        users: usersWithStats,
        total,
        page,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get administrative dashboard statistics
 * @route   GET /api/admin/dashboard-stats, GET /api/admin/dashboard
 * @access  Admin Only
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      totalInquiries,
      revenueResult,
      lowStockProducts,
      recentOrdersList,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      Inquiry.countDocuments(),
      // Calculate total revenue from paid / confirmed / delivered orders
      Order.aggregate([
        {
          $match: {
            $or: [
              { paymentStatus: 'paid' },
              { orderStatus: { $in: ['confirmed', 'shipped', 'delivered'] } },
            ],
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
          },
        },
      ]),
      // Low stock products (< 10 units)
      Product.find({ stock: { $lt: 10 }, isActive: true })
        .limit(10)
        .select('name stock category price SKU'),
      // Recent 5 orders for dashboard feed
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderId customer totalAmount orderStatus createdAt items'),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const lowStockCount = await Product.countDocuments({ stock: { $lt: 10 }, isActive: true });

    // Format recent orders for frontend display
    const formattedRecentOrders = recentOrdersList.map((ord) => ({
      id: ord.orderId,
      customer: ord.customer?.company || ord.customer?.name || 'Institutional Client',
      total: ord.totalAmount,
      status: ord.orderStatus,
      date: ord.createdAt ? ord.createdAt.toISOString().slice(0, 10) : 'Today',
      itemsCount: ord.items ? ord.items.length : 1,
    }));

    const formattedLowStock = lowStockProducts.map((p) => ({
      id: p._id,
      name: p.name,
      stock: p.stock,
      category: p.category,
      price: p.price,
    }));

    return sendResponse(res, 200, {
      success: true,
      message: 'Dashboard statistics calculated successfully.',
      data: {
        totalOrders,
        totalRevenue,
        totalUsers,
        totalProducts,
        totalInquiries,
        lowStockProductsCount: lowStockCount,
        lowStockCount,
        recentOrders: formattedRecentOrders,
        lowStockProducts: formattedLowStock,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get admin audit / activity logs
 * @route   GET /api/admin/activity-logs
 * @access  Admin Only
 */
const getActivityLogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [logs, total] = await Promise.all([
      ActivityLog.find().sort({ timestamp: -1 }).skip(skip).limit(limit),
      ActivityLog.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return sendResponse(res, 200, {
      success: true,
      data: {
        logs,
        total,
        page,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getDashboardStats,
  getActivityLogs,
};
