const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const paymentService = require('../services/paymentService');
const { logActivity } = require('../services/activityLogger');
const { sendResponse, getPagination } = require('../utils/helpers');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../config/constants');

/**
 * @desc    Create a new order with dummy payment gateway simulation
 * @route   POST /api/orders
 * @access  Public / Optional Auth / Protected
 */
const createOrder = async (req, res, next) => {
  try {
    const {
      orderId: clientOrderId,
      items,
      customer,
      shippingAddress,
      billingAddress,
      paymentMethod = 'card',
      simulatePaymentFailure = false,
      total,
      totalAmount,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Order must contain at least one item.',
        error: 'EMPTY_ORDER',
      });
    }

    // Determine user ID if logged in
    const userId = req.user ? req.user._id : null;

    // Customer details resolution
    const customerInfo = {
      name: customer?.name || (req.user ? req.user.name : 'Institutional Buyer'),
      email: customer?.email || (req.user ? req.user.email : 'procurement@lab.org'),
      phone: customer?.phone || (req.user ? req.user.phone : ''),
      company: customer?.company || (req.user ? req.user.company : ''),
    };

    // Calculate subtotal, tax, and total
    let calculatedSubtotal = 0;
    const formattedItems = [];

    for (const item of items) {
      const pId = item.productId || item.id || item._id;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const price = Number(item.price) || 0;

      calculatedSubtotal += price * quantity;

      formattedItems.push({
        productId: mongoose.Types.ObjectId.isValid(pId) ? pId : undefined,
        name: item.name || 'Laboratory Equipment',
        quantity,
        price,
        image: item.image || '/products/placeholder.jpg',
        slug: item.slug || '',
      });

      // Deduct stock if valid product in database
      if (mongoose.Types.ObjectId.isValid(pId)) {
        await Product.updateOne(
          { _id: pId, stock: { $gte: quantity } },
          { $inc: { stock: -quantity, stockQuantity: -quantity } }
        );
      }
    }

    const calculatedTax = calculatedSubtotal * 0.18; // 18% GST
    const shippingCost = calculatedSubtotal >= 50000 || calculatedSubtotal === 0 ? 0 : 500;
    const finalTotal = totalAmount || total || (calculatedSubtotal + calculatedTax + shippingCost);

    // Generate unique internal Order ID
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderRef = clientOrderId || `KRM-${Date.now().toString(36).toUpperCase()}-${randomHex}`;

    // Execute Dummy Payment Simulation via paymentService
    const paymentResult = await paymentService.processPayment({
      amount: finalTotal,
      orderId: orderRef,
      paymentMethod,
      customer: customerInfo,
      simulateFailure: Boolean(simulatePaymentFailure),
    });

    const isPaid = paymentResult.status === 'paid';

    // Create Order Document
    const order = await Order.create({
      orderId: orderRef,
      userId,
      customer: customerInfo,
      items: formattedItems,
      shippingAddress: shippingAddress || {},
      billingAddress: billingAddress || shippingAddress || {},
      orderStatus: isPaid ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.PENDING,
      paymentStatus: isPaid
        ? PAYMENT_STATUS.PAID
        : paymentResult.status === 'failed'
        ? PAYMENT_STATUS.FAILED
        : PAYMENT_STATUS.PENDING,
      paymentMethod,
      paymentDetails: {
        gateway: paymentResult.gateway,
        transactionId: paymentResult.transactionId,
        status: paymentResult.status,
        amountPaid: paymentResult.amountPaid,
        paymentDate: paymentResult.paymentDate,
        rawResponse: paymentResult.rawResponse,
      },
      subtotal: calculatedSubtotal,
      tax: calculatedTax,
      shippingCost,
      totalAmount: finalTotal,
    });

    // Clear user's cart if authenticated
    if (userId) {
      await Cart.updateOne({ userId }, { $set: { items: [] } });
    }

    return sendResponse(res, 201, {
      success: true,
      message: isPaid
        ? 'Order placed and payment authorized successfully.'
        : 'Order recorded. Payment is pending or failed.',
      data: {
        order,
        orderId: order.orderId,
        paymentResult,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders
 * @access  Protected
 */
const getMyOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendResponse(res, 200, {
        success: true,
        data: { orders: [] },
      });
    }

    const orders = await Order.find({
      $or: [{ userId: req.user._id }, { 'customer.email': req.user.email }],
    }).sort({ createdAt: -1 });

    return sendResponse(res, 200, {
      success: true,
      message: 'Orders retrieved successfully.',
      data: { orders },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single order details by ID or orderId
 * @route   GET /api/orders/:id
 * @access  Public / Protected (authenticated user or admin)
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id).populate('userId', 'name email');
    }

    if (!order) {
      order = await Order.findOne({ orderId: id }).populate('userId', 'name email');
    }

    if (!order) {
      return sendResponse(res, 404, {
        success: false,
        message: `Order not found with identifier '${id}'.`,
        error: 'ORDER_NOT_FOUND',
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Order details retrieved successfully.',
      data: { order },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all orders (admin only)
 * @route   GET /api/admin/orders
 * @access  Admin Only
 */
const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderId: searchRegex },
        { 'customer.name': searchRegex },
        { 'customer.email': searchRegex },
        { 'customer.company': searchRegex },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return sendResponse(res, 200, {
      success: true,
      message: 'Admin orders list retrieved successfully.',
      data: {
        orders,
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
 * @desc    Update order status
 * @route   PUT /api/admin/orders/:id/status, PUT /api/admin/orders/:id
 * @access  Admin Only
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, orderStatus } = req.body;
    const newStatus = status || orderStatus;

    if (!newStatus) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Order status is required.',
        error: 'STATUS_REQUIRED',
      });
    }

    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return sendResponse(res, 404, {
        success: false,
        message: `Order not found with identifier '${id}'.`,
        error: 'ORDER_NOT_FOUND',
      });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = newStatus;
    await order.save();

    // Log admin activity
    if (req.user) {
      await logActivity({
        adminId: req.user._id,
        adminName: req.user.name,
        action: 'UPDATE_ORDER_STATUS',
        targetType: 'Order',
        targetId: order.orderId,
        details: { oldStatus, newStatus },
        ipAddress: req.ip,
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: `Order status updated to '${newStatus}'.`,
      data: { order },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
};
