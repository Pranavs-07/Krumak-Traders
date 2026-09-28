
const Category = require('../models/Category');
const { logActivity } = require('../services/activityLogger');
const { sendResponse } = require('../utils/helpers');

/**
 * @desc    Get all categories with parentCategory populated
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentCategory', 'name slug')
      .sort({ name: 1 });

    return sendResponse(res, 200, {
      success: true,
      message: 'Categories retrieved successfully.',
      data: { categories },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single category by ID or slug
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let category;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id).populate('parentCategory', 'name slug');
    }

    if (!category) {
      category = await Category.findOne({ slug: id.toLowerCase() }).populate('parentCategory', 'name slug');
    }

    if (!category) {
      return sendResponse(res, 404, {
        success: false,
        message: `Category not found with identifier '${id}'.`,
        error: 'CATEGORY_NOT_FOUND',
      });
    }

    return sendResponse(res, 200, {
      success: true,
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new category
 * @route   POST /api/admin/categories, POST /api/categories
 * @access  Admin Only
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, parentCategory, description, icon, image } = req.body;

    const category = await Category.create({
      name,
      slug,
      parentCategory: parentCategory || null,
      description,
      icon,
      image,
    });

    if (req.user) {
      await logActivity({
        adminId: req.user._id,
        adminName: req.user.name,
        action: 'CREATE_CATEGORY',
        targetType: 'Category',
        targetId: category._id,
        details: { name: category.name, slug: category.slug },
        ipAddress: req.ip,
      });
    }

    return sendResponse(res, 201, {
      success: true,
      message: 'Category created successfully.',
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/admin/categories/:id, PUT /api/categories/:id
 * @access  Admin Only
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category = await Category.findById(id);

    if (!category) {
      category = await Category.findOne({ slug: id.toLowerCase() });
    }

    if (!category) {
      return sendResponse(res, 404, {
        success: false,
        message: `Category not found with identifier '${id}'.`,
        error: 'CATEGORY_NOT_FOUND',
      });
    }

    Object.assign(category, req.body);
    await category.save();

    if (req.user) {
      await logActivity({
        adminId: req.user._id,
        adminName: req.user.name,
        action: 'UPDATE_CATEGORY',
        targetType: 'Category',
        targetId: category._id,
        details: { name: category.name },
        ipAddress: req.ip,
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Category updated successfully.',
      data: { category },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/admin/categories/:id, DELETE /api/categories/:id
 * @access  Admin Only
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category = await Category.findById(id);

    if (!category) {
      category = await Category.findOne({ slug: id.toLowerCase() });
    }

    if (!category) {
      return sendResponse(res, 404, {
        success: false,
        message: `Category not found with identifier '${id}'.`,
        error: 'CATEGORY_NOT_FOUND',
      });
    }

    await Category.deleteOne({ _id: category._id });

    if (req.user) {
      await logActivity({
        adminId: req.user._id,
        adminName: req.user.name,
        action: 'DELETE_CATEGORY',
        targetType: 'Category',
        targetId: category._id,
        details: { name: category.name, slug: category.slug },
        ipAddress: req.ip,
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: `Category '${category.name}' deleted successfully.`,
      data: { id: category._id },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
