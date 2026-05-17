import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get Current User Profile
 * GET /api/user/profile
 */
export const getProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json({
        success: true,
        data: user.toJSON(),
    });
});

/**
 * Update User Profile
 * PATCH /api/user/profile
 */
export const updateProfile = asyncHandler(async(req, res) => {
    const { firstName, lastName, phone, currency } = req.body;

    // Fields that can be updated
    const allowedUpdates = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(currency && { currency }),
    };

    // Update user
    const user = await User.findByIdAndUpdate(
        req.user._id,
        allowedUpdates, { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user.toJSON(),
    });
});

/**
 * Change Password
 * POST /api/user/change-password
 */
export const changePassword = asyncHandler(async(req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
    });
});

/**
 * Delete User Account
 * DELETE /api/user/account
 */
export const deleteAccount = asyncHandler(async(req, res) => {
    const { password } = req.body;

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new AppError('Incorrect password. Cannot delete account.', 401);
    }

    // Delete user and all associated data
    await User.findByIdAndDelete(req.user._id);

    // TODO: Delete all associated transactions, categories, budgets, reminders

    res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
    });
});

/**
 * Get User Statistics
 * GET /api/user/statistics
 */
export const getUserStatistics = asyncHandler(async(req, res) => {
    // This will be implemented after transaction controller is done
    // For now, return placeholder

    res.status(200).json({
        success: true,
        message: 'User statistics will be populated after transactions are added',
    });
});