const mongoose = require('mongoose');
const { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } = require('../config/constants');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false, // optional if product was deleted or mock
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: '/products/placeholder.jpg',
    },
    slug: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const addressSchema = new mongoose.Schema(
  {
    address: { type: String, trim: true, default: '' },
    street: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: 'India' },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customer: customerSchema,
    items: [orderItemSchema],
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: [...Object.values(PAYMENT_METHODS), 'card', 'upi', 'netbanking', 'po', 'cod'],
      default: PAYMENT_METHODS.CARD,
    },
    paymentDetails: {
      gateway: { type: String, default: 'DUMMY_GATEWAY' },
      transactionId: { type: String, default: '' },
      status: { type: String, default: 'pending' },
      paymentDate: { type: Date, default: null },
      amountPaid: { type: Number, default: 0 },
      rawResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.orderId || ret._id;
        ret.status = ret.orderStatus;
        ret.total = ret.totalAmount;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.orderId || ret._id;
        ret.status = ret.orderStatus;
        ret.total = ret.totalAmount;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual getters for status and total
orderSchema.virtual('status').get(function () {
  return this.orderStatus;
});

orderSchema.virtual('total').get(function () {
  return this.totalAmount;
});

// Auto-populate customer from userId if missing before save
orderSchema.pre('validate', function (next) {
  if (!this.orderId) {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.orderId = `KRM-${Date.now().toString(36).toUpperCase()}-${randomHex}`;
  }
  next();
});

orderSchema.index({ orderId: 1, userId: 1, orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
