import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/sendEmail.js';

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

/**
 * Register User
 * POST /api/auth/register
 */
export const register = asyncHandler(async(req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('Email already registered. Please login.', 400);
    }

    // Create new user
    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
    });

    // Create default categories for the user
    await Category.createDefaultCategories(user._id);

    // Send welcome email
    try {
        await sendWelcomeEmail(user.email, user.firstName);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't fail registration if email fails
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: user.toJSON(),
            token,
        },
    });
});

/**
 * Login User
 * POST /api/auth/login
 */
export const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    // Check for user (select password explicitly)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // Check if password matches
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
            user: user.toJSON(),
            token,
        },
    });
});

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async(req, res) => {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError('User with this email does not exist', 404);
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
        await sendPasswordResetEmail(user.email, user.firstName, resetUrl);

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email',
        });
    } catch (error) {
        // Clear reset token on email failure
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        throw new AppError(
            'Error sending reset email. Please try again later.',
            500
        );
    }
});

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(async(req, res) => {
    const { token, password } = req.body;

    // Find user with matching reset token and check expiry
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate new token
    const newToken = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: 'Password reset successfully',
        data: {
            user: user.toJSON(),
            token: newToken,
        },
    });
});

/**
 * Logout User
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async(req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});