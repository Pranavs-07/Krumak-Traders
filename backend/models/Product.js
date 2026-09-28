const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed product description'],
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      trim: true,
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    subCategory: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please specify the product price'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    originalPrice: {
      type: Number,
      default: null,
      min: [0, 'Original price must be greater than or equal to 0'],
    },
    stock: {
      type: Number,
      required: [true, 'Please specify available stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    stockQuantity: {
      type: Number,
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
    },
    images: {
      type: [String],
      default: ['/products/placeholder.jpg'],
    },
    image: {
      type: String,
      default: '/products/placeholder.jpg',
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    brand: {
      type: String,
      trim: true,
      default: 'KRUMAK',
    },
    SKU: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        ret.featured = ret.isFeatured;
        // Ensure image is populated from images array if not set
        if (!ret.image && ret.images && ret.images.length > 0) {
          ret.image = ret.images[0];
        }
        // Ensure stock and stockQuantity are aligned
        if (ret.stockQuantity !== undefined && ret.stock === undefined) {
          ret.stock = ret.stockQuantity;
        } else if (ret.stock !== undefined && ret.stockQuantity === undefined) {
          ret.stockQuantity = ret.stock;
        }
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        ret.featured = ret.isFeatured;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual for featured alias
productSchema.virtual('featured').get(function () {
  return this.isFeatured;
});

// Auto-sync stock and stockQuantity, generate SKU and slug
productSchema.pre('validate', function (next) {
  if (this.stockQuantity !== undefined && this.stock === undefined) {
    this.stock = this.stockQuantity;
  } else if (this.stock !== undefined) {
    this.stockQuantity = this.stock;
  }

  // Ensure image matches first images entry
  if (this.images && this.images.length > 0 && (!this.image || this.image === '/products/placeholder.jpg')) {
    this.image = this.images[0];
  } else if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }

  // Auto-generate slug
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // Auto-generate SKU if not present
  if (!this.SKU) {
    const prefix = this.brand ? this.brand.substring(0, 3).toUpperCase() : 'KRM';
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.SKU = `${prefix}-${rand}`;
  }

  next();
});

// Text index for search functionality
productSchema.index({ name: 'text', description: 'text', shortDescription: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1, isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);
