import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.js';
import { sendBudgetAlertEmail } from '../utils/sendEmail.js';

/**
 * Create Transaction
 * POST /api/transactions
 */
export const createTransaction = asyncHandler(async(req, res) => {
    const { type, amount, category, description, date, paymentMethod, tags } =
    req.body;

    // Create transaction
    const transaction = await Transaction.create({
        userId: req.user._id,
        type,
        amount,
        category,
        description,
        date,
        paymentMethod: paymentMethod || 'cash',
        tags: tags || [],
    });

    // Populate category details
    await transaction.populate({
        path: 'category',
        select: 'name icon color',
    });

    // Update budget if expense
    if (type === 'expense') {
        const monthStr = new Date(date).toISOString().slice(0, 7);
        const budget = await Budget.findOne({
            userId: req.user._id,
            category,
            month: monthStr,
        });

        if (budget) {
            budget.spent += amount;
            await budget.save();

            // Check if budget exceeded and send alert
            if (budget.shouldSendAlert()) {
                try {
                    const categoryName = (await budget.populate('category')).category
                        .name;
                    await sendBudgetAlertEmail(
                        req.user.email,
                        req.user.firstName,
                        categoryName,
                        budget.spent,
                        budget.limit
                    );
                    budget.alertSent = true;
                    await budget.save();
                } catch (error) {
                    console.error('Error sending budget alert:', error);
                }
            }
        }
    }

    res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
    });
});

/**
 * Get All Transactions with Filters
 * GET /api/transactions
 */
export const getTransactions = asyncHandler(async(req, res) => {
    const {
        type,
        category,
        startDate,
        endDate,
        sort = '-date',
        page = 1,
        limit = 10,
        search,
    } = req.query;

    // Build filter object
    const filter = { userId: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (search) {
        filter.description = { $regex: search, $options: 'i' };
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Get transactions
    const transactions = await Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum);

    // Get total count
    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
        success: true,
        data: transactions,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
        },
    });
});

/**
 * Get Single Transaction
 * GET /api/transactions/:id
 */
export const getTransaction = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
        _id: id,
        userId: req.user._id,
    });

    if (!transaction) {
        throw new AppError('Transaction not found', 404);
    }

    res.status(200).json({
        success: true,
        data: transaction,
    });
});

/**
 * Update Transaction
 * PATCH /api/transactions/:id
 */
export const updateTransaction = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const { type, amount, category, description, date, paymentMethod } =
    req.body;

    // Get original transaction
    const originalTransaction = await Transaction.findOne({
        _id: id,
        userId: req.user._id,
    });

    if (!originalTransaction) {
        throw new AppError('Transaction not found', 404);
    }

    // Update transaction
    const transaction = await Transaction.findByIdAndUpdate(
        id, {
            ...(type && { type }),
            ...(amount && { amount }),
            ...(category && { category }),
            ...(description && { description }),
            ...(date && { date }),
            ...(paymentMethod && { paymentMethod }),
        }, { new: true, runValidators: true }
    );

    // Update budget if amount or type changed
    if (
        (originalTransaction.type === 'expense' &&
            (amount || type === 'income')) ||
        (type === 'expense' && originalTransaction.type !== 'expense')
    ) {
        const monthStr = originalTransaction.date.toISOString().slice(0, 7);

        // If originally was expense, reduce budget
        if (originalTransaction.type === 'expense') {
            const budget = await Budget.findOne({
                userId: req.user._id,
                category: originalTransaction.category,
                month: monthStr,
            });

            if (budget) {
                budget.spent -= originalTransaction.amount;
                budget.alertSent = false;
                await budget.save();
            }
        }

        // If now is expense, add to new budget
        if (transaction.type === 'expense') {
            const newMonthStr = transaction.date.toISOString().slice(0, 7);
            const newBudget = await Budget.findOne({
                userId: req.user._id,
                category: transaction.category,
                month: newMonthStr,
            });

            if (newBudget) {
                newBudget.spent += transaction.amount;
                await newBudget.save();
            }
        }
    }

    res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        data: transaction,
    });
});

/**
 * Delete Transaction
 * DELETE /api/transactions/:id
 */
export const deleteTransaction = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
        _id: id,
        userId: req.user._id,
    });

    if (!transaction) {
        throw new AppError('Transaction not found', 404);
    }

    // Update budget if expense
    if (transaction.type === 'expense') {
        const monthStr = transaction.date.toISOString().slice(0, 7);
        const budget = await Budget.findOne({
            userId: req.user._id,
            category: transaction.category,
            month: monthStr,
        });

        if (budget) {
            budget.spent -= transaction.amount;
            budget.alertSent = false;
            await budget.save();
        }
    }

    // Delete transaction
    await Transaction.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
    });
});

/**
 * Get Monthly Summary
 * GET /api/transactions/summary/monthly
 */
export const getMonthlySummary = asyncHandler(async(req, res) => {
    const { month } = req.query;

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const transactions = await Transaction.find({
        userId: req.user._id,
        date: {
            $gte: startDate,
            $lte: endDate,
        },
    });

    const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    // Category-wise breakdown for expenses
    const categoryBreakdown = {};
    for (const transaction of transactions.filter((t) => t.type === 'expense')) {
        const categoryId = transaction.category._id.toString();
        if (!categoryBreakdown[categoryId]) {
            categoryBreakdown[categoryId] = {
                category: transaction.category,
                amount: 0,
                count: 0,
            };
        }
        categoryBreakdown[categoryId].amount += transaction.amount;
        categoryBreakdown[categoryId].count += 1;
    }

    res.status(200).json({
        success: true,
        data: {
            month,
            income,
            expenses,
            balance,
            transactionCount: transactions.length,
            categoryBreakdown: Object.values(categoryBreakdown),
        },
    });
});