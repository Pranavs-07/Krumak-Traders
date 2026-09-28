const mongoose = require('mongoose');
const { INQUIRY_STATUS } = require('../config/constants');

const inquirySchema = new mongoose.Schema(
  {
    inquiryId: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide your contact phone number'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    productInterest: {
      type: String,
      trim: true,
      default: '',
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    quantity: {
      type: mongoose.Schema.Types.Mixed,
      default: '1',
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    timeline: {
      type: String,
      trim: true,
      default: '',
    },
    deliveryCity: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(INQUIRY_STATUS),
      default: INQUIRY_STATUS.NEW,
    },
    response: {
      type: String,
      trim: true,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.inquiryId || ret._id;
        if (!ret.company && ret.companyName) ret.company = ret.companyName;
        if (!ret.companyName && ret.company) ret.companyName = ret.company;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.inquiryId || ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

inquirySchema.pre('validate', function (next) {
  if (!this.inquiryId) {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.inquiryId = `INQ-${Date.now().toString(36).toUpperCase()}-${randomHex}`;
  }
  if (!this.company && this.companyName) {
    this.company = this.companyName;
  } else if (!this.companyName && this.company) {
    this.companyName = this.company;
  }
  next();
});

module.exports = mongoose.model('Inquiry', inquirySchema);
