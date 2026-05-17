import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Create Budget
 * POST /api/budgets
 */
export const createBudget = asyncHandler(async(req, res) => {
    const { limit, category, month, alertThreshold, notes } = req.body;

    // Check if budget already exists for this month and category
    const existingBudget = await Budget.findOne({
        userId: req.user._id,
        category,
        month,
    });

    if (existingBudget) {
        throw new AppError(
            'Budget already exists for this category and month',
            400
        );
    }

    // Verify category belongs to user
    const categoryExists = await Category.findOne({
        _id: category,
        userId: req.user._id,
    });

    if (!categoryExists) {
        throw new AppError('Category not found', 404);
    }

    // Calculate already spent amount in this month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const spent = await Transaction.aggregate([{
            $match: {
                userId: req.user._id,
                category,
                type: 'expense',
                date: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },
        {
            $group: {
                _id: null,
                totalSpent: { $sum: '$amount' },
            },
        },
    ]);

    const budget = await Budget.create({
        userId: req.user._id,
        category,
        month,
        limit,
        spent: spent.length > 0 ? spent[0].totalSpent : 0,
        alertThreshold: alertThreshold || 80,
        notes,
    });

    await budget.populate({
        path: 'category',
        select: 'name icon color',
    });

    res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        data: budget,
    });
});

/**
 * Get All Budgets
 * GET /api/budgets
 */
export const getBudgets = asyncHandler(async(req, res) => {
    const { month } = req.query;

    const filter = { userId: req.user._id };
    if (month) filter.month = month;

    const budgets = await Budget.find(filter).sort({ month: -1 });

    res.status(200).json({
        success: true,
        data: budgets,
    });
});

/**
 * Get Single Budget
 * GET /api/budgets/:id
 */
export const getBudget = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const budget = await Budget.findOne({
        _id: id,
        userId: req.user._id,
    });

    if (!budget) {
        throw new AppError('Budget not found', 404);
    }

    res.status(200).json({
        success: true,
        data: budget,
    });
});

/**
 * Update Budget
 * PATCH /api/budgets/:id
 */
export const updateBudget = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { limit, alertThreshold, notes } = req.body;

    const budget = await Budget.findOne({
        _id: id,
        userId: req.user._id,
    });

    if (!budget) {
        throw new AppError('Budget not found', 404);
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
        id, {
            ...(limit && { limit }),
            ...(alertThreshold && { alertThreshold }),
            ...(notes && { notes }),
        }, { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: 'Budget updated successfully',
        data: updatedBudget,
    });
});

/**
 * Delete Budget
 * DELETE /api/budgets/:id
 */
export const deleteBudget = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const budget = await Budget.findOne({
        _id: id,
        userId: req.user._id,
    });

    if (!budget) {
        throw new AppError('Budget not found', 404);
    }

    await Budget.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Budget deleted successfully',
    });
});

/**
 * Get Budget Status for a Month
 * GET /api/budgets/status/:month
 */
export const getBudgetStatus = asyncHandler(async(req, res) => {
    const { month } = req.params;

    const budgets = await Budget.find({
        userId: req.user._id,
        month,
    });

    const status = {
        month,
        totalLimit: 0,
        totalSpent: 0,
        budgetSummary: [],
        alerts: [],
    };

    for (const budget of budgets) {
        status.totalLimit += budget.limit;
        status.totalSpent += budget.spent;

        const percentageSpent = (budget.spent / budget.limit) * 100;

        status.budgetSummary.push({
            category: budget.category.name,
            limit: budget.limit,
            spent: budget.spent,
            remaining: budget.remaining,
            percentageSpent: percentageSpent.toFixed(2),
            status: percentageSpent >= 100 ?
                'exceeded' :
                percentageSpent >= budget.alertThreshold ?
                'warning' :
                'ok',
        });

        if (percentageSpent >= budget.alertThreshold) {
            status.alerts.push({
                category: budget.category.name,
                message: `You've spent ${percentageSpent.toFixed(2)}% of your ${budget.category.name} budget`,
            });
        }
    }

    status.remainingBudget = Math.max(0, status.totalLimit - status.totalSpent);
    status.totalPercentageSpent =
        status.totalLimit > 0 ?
        ((status.totalSpent / status.totalLimit) * 100).toFixed(2) :
        0;

    res.status(200).json({
        success: true,
        data: status,
    });
});