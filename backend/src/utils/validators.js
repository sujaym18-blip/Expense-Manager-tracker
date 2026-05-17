import { body, param, query } from 'express-validator';

// ==================== Authentication Validators ====================

export const registerValidator = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain both letters and numbers'),
    body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
    body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
];

export const loginValidator = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const forgotPasswordValidator = [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];

export const resetPasswordValidator = [
    body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain both letters and numbers'),
    body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
];

// ==================== User Validators ====================

export const updateProfileValidator = [
    body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
    body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
    body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
];

// ==================== Transaction Validators ====================

export const createTransactionValidator = [
    body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
    body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
    body('category')
    .notEmpty()
    .withMessage('Category is required'),
    body('description')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
    body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
];

export const updateTransactionValidator = [
    body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
    body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
    body('category')
    .optional()
    .notEmpty()
    .withMessage('Category cannot be empty'),
    body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
    body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
];

export const transactionIdValidator = [
    param('id')
    .isMongoId()
    .withMessage('Invalid transaction ID'),
];

// ==================== Category Validators ====================

export const createCategoryValidator = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
    body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Icon must be less than 50 characters'),
    body('color')
    .optional()
    .trim()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Please provide a valid hex color code'),
];

export const categoryIdValidator = [
    param('id')
    .isMongoId()
    .withMessage('Invalid category ID'),
];

// ==================== Budget Validators ====================

export const createBudgetValidator = [
    body('limit')
    .isFloat({ min: 0.01 })
    .withMessage('Budget limit must be greater than 0'),
    body('category')
    .notEmpty()
    .withMessage('Category is required'),
    body('month')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month must be in YYYY-MM format'),
];

export const budgetIdValidator = [
    param('id')
    .isMongoId()
    .withMessage('Invalid budget ID'),
];

// ==================== Query Validators ====================

export const paginationValidator = [
    query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const transactionFilterValidator = [
    query('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
    query('category')
    .optional()
    .notEmpty()
    .withMessage('Category cannot be empty'),
    query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
    query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
    query('sort')
    .optional()
    .isIn(['date', 'amount', '-date', '-amount'])
    .withMessage('Sort must be one of: date, amount, -date, -amount'),
];