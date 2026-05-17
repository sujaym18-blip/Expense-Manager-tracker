import express from 'express';
import {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlySummary,
} from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';
import {
    createTransactionValidator,
    updateTransactionValidator,
    transactionIdValidator,
    paginationValidator,
    transactionFilterValidator,
} from '../utils/validators.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All transaction routes require authentication
router.use(authenticate);

router.post(
    '/',
    createTransactionValidator,
    handleValidationErrors,
    createTransaction
);

router.get(
    '/',
    paginationValidator,
    transactionFilterValidator,
    handleValidationErrors,
    getTransactions
);

router.get(
    '/summary/monthly',
    getTransactions,
    getMonthlySummary
);

router.get(
    '/:id',
    transactionIdValidator,
    handleValidationErrors,
    getTransaction
);

router.patch(
    '/:id',
    transactionIdValidator,
    updateTransactionValidator,
    handleValidationErrors,
    updateTransaction
);

router.delete(
    '/:id',
    transactionIdValidator,
    handleValidationErrors,
    deleteTransaction
);

export default router;