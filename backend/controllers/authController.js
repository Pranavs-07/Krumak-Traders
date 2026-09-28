const crypto = require('crypto');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/generateTokens');
const { sendResponse } = require('../utils/helpers');

/**
 * @desc    Register a new customer or admin user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, company, institution, address, city, state, pincode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendResponse(res, 409, {
        success: false,
        message: 'An account with this email address already exists.',
        error: 'EMAIL_ALREADY_EXISTS',
      });
    }

    // Default address if provided
    const addresses = [];
    if (address || city || state || pincode) {
      addresses.push({
        address: address || '',
        street: address || '',
        city: city || '',
        state: state || '',
        pincode: pincode || '',
        country: 'India',
        isDefault: true,
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      company: company || institution || '',
      institution: institution || company || '',
      role: role === 'admin' ? 'admin' : 'customer', // allow seeding admin or customer
      addresses,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token on user document
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userObj = user.toJSON();

    return sendResponse(res, 201, {
      success: true,
      message: 'Registration successful. Welcome to KRUMAK TRADERS!',
      data: {
        user: userObj,
        token: accessToken,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Authenticate user and get tokens
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly select password and refreshToken
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
    if (!user) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Invalid email or password credentials.',
        error: 'INVALID_CREDENTIALS',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Invalid email or password credentials.',
        error: 'INVALID_CREDENTIALS',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Update refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userObj = user.toJSON();

    return sendResponse(res, 200, {
      success: true,
      message: 'Login successful.',
      data: {
        user: userObj,
        token: accessToken,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Logout user / invalidate refresh token
 * @route   POST /api/auth/logout
 * @access  Public / Protected
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (req.user) {
      req.user.refreshToken = undefined;
      await req.user.save({ validateBeforeSave: false });
    } else if (refreshToken) {
      await User.updateOne({ refreshToken }, { $unset: { refreshToken: 1 } });
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Successfully logged out.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Refresh access token with refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Refresh token is required in request body.',
        error: 'REFRESH_TOKEN_REQUIRED',
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Refresh token is expired or invalid.',
        error: 'INVALID_REFRESH_TOKEN',
      });
    }

    // Find user by id and stored refresh token
    const user = await User.findOne({ _id: decoded.id, refreshToken: token });
    if (!user) {
      return sendResponse(res, 401, {
        success: false,
        message: 'Invalid refresh token or session has been revoked.',
        error: 'SESSION_REVOKED',
      });
    }

    // Issue new access token
    const newAccessToken = generateAccessToken(user._id, user.role);

    return sendResponse(res, 200, {
      success: true,
      message: 'Access token refreshed successfully.',
      data: {
        token: newAccessToken,
        accessToken: newAccessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Generate password reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Do not reveal whether user exists for security
      return sendResponse(res, 200, {
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent.',
      });
    }

    // Generate reset token
    const rawResetToken = crypto.randomBytes(20).toString('hex');

    // Hash token before storing in database
    user.resetPasswordToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour validity

    await user.save({ validateBeforeSave: false });

    // In a production setup with email service, send an email here.
    // For local dev/demo, we return the resetToken so it can be verified easily.
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/reset-password?token=${rawResetToken}`;

    return sendResponse(res, 200, {
      success: true,
      message: 'Password reset link sent to your email.',
      data: {
        resetToken: rawResetToken,
        resetUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Reset password using reset token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Password reset token is invalid or has expired.',
        error: 'INVALID_OR_EXPIRED_TOKEN',
      });
    }

    // Set new password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.refreshToken = undefined; // Force re-login
    await user.save();

    return sendResponse(res, 200, {
      success: true,
      message: 'Password reset successful. You can now log in with your new credentials.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/me, GET /api/auth/profile
 * @access  Protected
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendResponse(res, 404, {
        success: false,
        message: 'User profile not found.',
        error: 'NOT_FOUND',
      });
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Profile retrieved successfully.',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update current logged in user profile
 * @route   PUT /api/auth/profile
 * @access  Protected
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, company, addresses, department } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendResponse(res, 404, {
        success: false,
        message: 'User not found.',
        error: 'NOT_FOUND',
      });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (company !== undefined) user.company = company;
    if (department !== undefined) user.department = department;
    if (addresses && Array.isArray(addresses)) user.addresses = addresses;

    await user.save();

    return sendResponse(res, 200, {
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
};
