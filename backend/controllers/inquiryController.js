const Inquiry = require('../models/Inquiry');
const { logActivity } = require('../services/activityLogger');
const { sendResponse, getPagination } = require('../utils/helpers');

/**
 * @desc    Submit a quote request or general B2B laboratory inquiry
 * @route   POST /api/inquiries
 * @access  Public
 */
const submitInquiry = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      companyName,
      company,
      department,
      productInterest,
      productIds,
      quantity,
      category,
      timeline,
      deliveryCity,
      message,
    } = req.body;

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      companyName: companyName || company || '',
      company: company || companyName || '',
      department: department || '',
      productInterest: productInterest || '',
      productIds: Array.isArray(productIds) ? productIds : [],
      quantity: quantity || '1',
      category: category || '',
      timeline: timeline || '',
      deliveryCity: deliveryCity || '',
      message: message || '',
    });

    return sendResponse(res, 201, {
      success: true,
      message: 'Your inquiry has been submitted successfully. Our sales engineering desk will reach out shortly.',
      data: {
        inquiry,
        inquiryId: inquiry.inquiryId,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all inquiries (admin view)
 * @route   GET /api/admin/inquiries, GET /api/inquiries
 * @access  Admin Only
 */
const getAllInquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { companyName: regex },
        { productInterest: regex },
        { inquiryId: regex },
      ];
    }

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Inquiry.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return sendResponse(res, 200, {
      success: true,
      message: 'Inquiries list retrieved successfully.',
      data: {
        inquiries,
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
 * @desc    Update inquiry status or reply
 * @route   PUT /api/admin/inquiries/:id/status, PUT /api/admin/inquiries/:id
 * @access  Admin Only
 */
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    let inquiry = null;
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(id)) {
      inquiry = await Inquiry.findById(id);
    }
    if (!inquiry) {
      inquiry = await Inquiry.findOne({ inquiryId: id });
    }

    if (!inquiry) {
      return sendResponse(res, 404, {
        success: false,
        message: `Inquiry not found with identifier '${id}'.`,
        error: 'INQUIRY_NOT_FOUND',
      });
    }

    if (status) {
      inquiry.status = status;
      if (status === 'resolved') {
        inquiry.resolvedAt = new Date();
      }
    }

    if (response !== undefined) {
      inquiry.response = response;
    }

    await inquiry.save();

    if (req.user) {
      await logActivity({
        adminId: req.user._id,
        adminName: req.user.name,
        action: 'UPDATE_INQUIRY',
        targetType: 'Inquiry',
        targetId: inquiry.inquiryId,
        details: { status: inquiry.status, responsePreview: response?.substring(0, 50) },
        ipAddress: req.ip,
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Inquiry status updated successfully.',
      data: { inquiry },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
};
