const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendResponse } = require('../utils/helpers');

/**
 * @desc    Get user's shopping cart
 * @route   GET /api/cart
 * @access  Protected / Optional
 */
const getCart = async (req, res, next) => {
  try {
    if (!req.user) {
      return sendResponse(res, 200, {
        success: true,
        data: { items: [], total: 0, subtotal: 0 },
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Cart retrieved successfully.',
      data: {
        cart,
        items: cart.items,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/add, POST /api/cart
 * @access  Protected
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Product ID is required.',
        error: 'PRODUCT_ID_REQUIRED',
      });
    }

    // Verify product exists and has stock
    let product = await Product.findById(productId);
    if (!product) {
      product = await Product.findOne({ slug: productId });
    }

    if (!product) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Product not found.',
        error: 'PRODUCT_NOT_FOUND',
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === product._id.toString()
    );

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({
        productId: product._id,
        quantity: qty,
        priceAtAdd: product.price,
        name: product.name,
        image: product.image || (product.images && product.images[0]) || '',
        slug: product.slug,
      });
    }

    await cart.save();
    await cart.populate('items.productId');

    return sendResponse(res, 200, {
      success: true,
      message: 'Item added to cart.',
      data: {
        cart,
        items: cart.items,
        total: cart.total,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/update, PUT /api/cart/:itemId
 * @access  Protected
 */
const updateCartItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId || req.body.itemId || req.body.productId;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Quantity is required.',
        error: 'QUANTITY_REQUIRED',
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Cart not found.',
        error: 'CART_NOT_FOUND',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId || item.productId.toString() === itemId
    );

    if (itemIndex === -1) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Item not found in cart.',
        error: 'ITEM_NOT_FOUND',
      });
    }

    const newQty = parseInt(quantity, 10);
    if (newQty <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQty;
    }

    await cart.save();
    await cart.populate('items.productId');

    return sendResponse(res, 200, {
      success: true,
      message: 'Cart updated successfully.',
      data: {
        cart,
        items: cart.items,
        total: cart.total,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:productId, DELETE /api/cart/:itemId
 * @access  Protected
 */
const removeFromCart = async (req, res, next) => {
  try {
    const targetId = req.params.productId || req.params.itemId;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return sendResponse(res, 404, {
        success: false,
        message: 'Cart not found.',
        error: 'CART_NOT_FOUND',
      });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== targetId && item.productId.toString() !== targetId
    );

    await cart.save();
    await cart.populate('items.productId');

    return sendResponse(res, 200, {
      success: true,
      message: 'Item removed from cart.',
      data: {
        cart,
        items: cart.items,
        total: cart.total,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Protected
 */
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Cart cleared successfully.',
      data: { items: [], total: 0 },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
