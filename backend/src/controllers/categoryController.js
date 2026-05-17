import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Create Custom Category
 * POST /api/categories
 */
export const createCategory = asyncHandler(async(req, res) => {
    const { name, icon, color, type, description } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({
        userId: req.user._id,
        name: name.toLowerCase(),
    });

    if (existingCategory) {
        throw new AppError('Category with this name already exists', 400);
    }

    const category = await Category.create({
        userId: req.user._id,
        name,
        icon: icon || '📁',
        color: color || '#3498db',
        type: type || 'both',
        description,
    });

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
    });
});

/**
 * Get All Categories
 * GET /api/categories
 */
export const getCategories = asyncHandler(async(req, res) => {
    const { type } = req.query;

    const filter = { userId: req.user._id };
    if (type) filter.type = { $in: [type, 'both'] };

    const categories = await Category.find(filter).sort({ isDefault: -1, name: 1 });

    res.status(200).json({
        success: true,
        data: categories,
    });
});

/**
 * Get Single Category
 * GET /api/categories/:id
 */
export const getCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const category = await Category.findOne({
        _id: id,
        userId: req.user._id,
    });

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    res.status(200).json({
        success: true,
        data: category,
    });
});

/**
 * Update Category
 * PATCH /api/categories/:id
 */
export const updateCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { name, icon, color, type, description } = req.body;

    const category = await Category.findOne({
        _id: id,
        userId: req.user._id,
    });

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    // Check if updating to default category (not allowed)
    if (category.isDefault) {
        throw new AppError('Default categories cannot be modified', 400);
    }

    // Check for duplicate name
    if (name) {
        const existingCategory = await Category.findOne({
            userId: req.user._id,
            name: name.toLowerCase(),
            _id: { $ne: id },
        });

        if (existingCategory) {
            throw new AppError('Category with this name already exists', 400);
        }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        id, {
            ...(name && { name }),
            ...(icon && { icon }),
            ...(color && { color }),
            ...(type && { type }),
            ...(description && { description }),
        }, { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory,
    });
});

/**
 * Delete Category
 * DELETE /api/categories/:id
 */
export const deleteCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const category = await Category.findOne({
        _id: id,
        userId: req.user._id,
    });

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    // Check if category is default
    if (category.isDefault) {
        throw new AppError('Default categories cannot be deleted', 400);
    }

    // Check if category is in use
    const transactionCount = await Transaction.countDocuments({
        category: id,
        userId: req.user._id,
    });

    if (transactionCount > 0) {
        throw new AppError(
            'Cannot delete category that is in use. Please reassign transactions first.',
            400
        );
    }

    // Delete category
    await Category.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
    });
});

/**
 * Get Category Statistics
 * GET /api/categories/:id/statistics
 */
export const getCategoryStatistics = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const category = await Category.findOne({
        _id: id,
        userId: req.user._id,
    });

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    const filter = {
        userId: req.user._id,
        category: id,
    };

    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter);

    const stats = {
        category: category.name,
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        transactionCount: transactions.length,
        averageAmount: transactions.length > 0 ?
            transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length :
            0,
        byType: {
            income: transactions
                .filter((t) => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0),
            expense: transactions
                .filter((t) => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0),
        },
    };

    res.status(200).json({
        success: true,
        data: stats,
    });
});