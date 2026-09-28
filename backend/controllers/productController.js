const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { logActivity } = require('../services/activityLogger');
const { sendResponse, getPagination } = require('../utils/helpers');

/**
 * @desc    Get all products with filtering, search, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured, inStock } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    // Build query filter
    const query = { isActive: true };

    // Filter by Category
    if (category && category !== 'all') {
      // Find category by slug or name
      const catDoc = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { name: new RegExp(category, 'i') }],
      });

      if (catDoc) {
        query.$or = [
          { category: catDoc.slug },
          { category: catDoc.name },
          { categoryRef: catDoc._id },
        ];
      } else {
        query.category = new RegExp(category, 'i');
      }
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by Featured
    if (featured === 'true' || featured === true) {
      query.isFeatured = true;
    }

    // Filter by Stock status
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Search query across name, description, brand, SKU
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      const searchConditions = [
        { name: searchRegex },
        { shortDescription: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { SKU: searchRegex },
      ];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    // Sort order
    let sortOption = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case 'price-low':
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price-high':
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'name':
        case 'name_asc':
          sortOption = { name: 1 };
          break;
        case 'rating':
        case 'rating_desc':
          sortOption = { rating: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    // Execute query with total count
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return sendResponse(res, 200, {
      success: true,
      message: 'Products retrieved successfully.',
      data: {
        products,
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single product by ID or slug
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({
        $or: [{ slug: id.toLowerCase() }, { SKU: id.toUpperCase() }],
      });
    }

    if (!product) {
      return sendResponse(res, 404, {
        success: false,
        message: `Product not found with identifier '${id}'.`,
        error: 'PRODUCT_NOT_FOUND',
      });
    }

    // Fetch related products from the same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select('name slug price originalPrice image rating stock category');

    return sendResponse(res, 200, {
      success: true,
      message: 'Product details retrieved successfully.',
      data: {
        product,
        related,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Quick search autocomplete suggestions
 * @route   GET /api/products/search
 * @access  Public
 */
const searchProducts = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    if (!q.trim()) {
      return sendResponse(res, 200, {
        success: true,
        data: { suggestions: [] },
      });
    }

    const regex = new RegExp(q.trim(), 'i');
    const suggestions = await Product.find({
      isActive: true,
      $or: [{ name: regex }, { category: regex }, { brand: regex }],
    })
      .select('name slug price image category stock')
      .limit(6);

    return sendResponse(res, 200, {
      success: true,
      data: { suggestions },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get distinct product categories list
 * @route   GET /api/products/categories
 * @access  Public
 */
const getProductCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return sendResponse(res, 200, {
      success: true,
      data: { categories },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/admin/products, POST /api/products
 * @access  Admin Only
 */
const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };

    // Format specifications if sent as an array of {key, value}
    if (Array.isArray(productData.specifications)) {
      const specMap = {};
      productData.specifications.forEach((s) => {
        if (s && s.key) specMap[s.key] = s.value;
      });
      productData.specifications = specMap;
    }

    // Set default image if none provided
    if (productData.image && (!productData.images || productData.images.length === 0)) {
      productData.images = [productData.image];
    } else if (productData.images && productData.images.length > 0 && !productData.image) {
      productData.image = productData.images[0];
    }

    const product = await Product.create(productData);

    // Log admin activity
    if (req.user) {
      await logActivity({
        adminId: req.user._id,
        adminName: req.user.name,
        action: 'CREATE_PRODUCT',
        targetType: 'Product',
        targetId: product._id,
        details: { name: product.name, price: product.price, SKU: product.SKU },
        ipAddress: req.ip,
      });
    }

    return sendResponse(res, 201, {
      success: true,
      message: 'Product created successfully.',
      data: { product },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/admin/products/:id, PUT /api/products/:id
 * @access  Admin Only
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = await Product.findById(id);
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return sendResponse(res, 404, {
        success: false,
        message: `Product not found with id '${id}'.`,
        error: 'PRODUCT_NOT_FOUND',
      });
    }

    const updateData = { ...req.body };

    // Handle specifications format
    if (Array.isArray(updateData.specifications)) {
      const specMap = {};
      updateData.specifications.forEach((s) => {
        if (s && s.key) specMap[s.key] = s.value;
      });
      updateData.specifications = specMap;
    }

    Object.assign(product, updateData);
    await product.save();

    // Log admin activity
    if (req.user) {
      await logActivity({
        adminId: req.user._id,
        adminName: req.user.name,
        action: 'UPDATE_PRODUCT',
        targetType: 'Product',
        targetId: product._id,
        details: { updatedFields: Object.keys(updateData) },
        ipAddress: req.ip,
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Product updated successfully.',
      data: { product },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a product (or soft delete)
 * @route   DELETE /api/admin/products/:id, DELETE /api/products/:id
 * @access  Admin Only
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = await Product.findById(id);
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return sendResponse(res, 404, {
        success: false,
        message: `Product not found with id '${id}'.`,
        error: 'PRODUCT_NOT_FOUND',
      });
    }

    await Product.deleteOne({ _id: product._id });

    // Log admin activity
    if (req.user) {
      await logActivity({
        adminId: req.user._id,
        adminName: req.user.name,
        action: 'DELETE_PRODUCT',
        targetType: 'Product',
        targetId: product._id,
        details: { name: product.name, SKU: product.SKU },
        ipAddress: req.ip,
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: `Product '${product.name}' deleted successfully.`,
      data: { id: product._id },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Upload product image
 * @route   POST /api/admin/products/:id/upload-image
 * @access  Admin Only
 */
const uploadProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return sendResponse(res, 400, {
        success: false,
        message: 'No image file uploaded.',
        error: 'FILE_REQUIRED',
      });
    }

    let product = await Product.findById(id);
    if (!product) {
      product = await Product.findOne({ slug: id.toLowerCase() });
    }

    if (!product) {
      return sendResponse(res, 404, {
        success: false,
        message: `Product not found with id '${id}'.`,
        error: 'PRODUCT_NOT_FOUND',
      });
    }

    // Construct image URL (served statically via express.static)
    const imageUrl = `/uploads/${req.file.filename}`;

    // Add to images array if not present, and update primary image
    if (!product.images.includes(imageUrl)) {
      product.images.push(imageUrl);
    }
    if (product.image === '/products/placeholder.jpg' || !product.image) {
      product.image = imageUrl;
    }

    await product.save();

    // Log admin activity
    if (req.user) {
      await logActivity({
        adminId: req.user._id,
        adminName: req.user.name,
        action: 'UPLOAD_PRODUCT_IMAGE',
        targetType: 'Product',
        targetId: product._id,
        details: { imageUrl, filename: req.file.filename },
        ipAddress: req.ip,
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Product image uploaded successfully.',
      data: {
        imageUrl,
        images: product.images,
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  searchProducts,
  getProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
