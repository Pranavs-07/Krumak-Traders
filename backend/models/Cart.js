const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1'],
      default: 1,
    },
    priceAtAdd: {
      type: Number,
      required: true,
      min: 0,
    },
    // Optional snapshot fields for fast display
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    slug: { type: String, default: '' },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Cart must belong to a user'],
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual for subtotal
cartSchema.virtual('subtotal').get(function () {
  if (!this.items || this.items.length === 0) return 0;
  return this.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
});

// Virtual for total with 18% GST standard
cartSchema.virtual('tax').get(function () {
  return this.subtotal * 0.18;
});

cartSchema.virtual('total').get(function () {
  return this.subtotal + this.tax;
});

module.exports = mongoose.model('Cart', cartSchema);
