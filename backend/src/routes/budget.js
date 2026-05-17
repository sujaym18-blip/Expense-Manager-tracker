import express from 'express';
import {
    createBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget,
    getBudgetStatus,
} from '../controllers/budgetController.js';
import { authenticate } from '../middleware/auth.js';
import {
    createBudgetValidator,
    budgetIdValidator,
} from '../utils/validators.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All budget routes require authentication
router.use(authenticate);

router.post(
    '/',
    createBudgetValidator,
    handleValidationErrors,
    createBudget
);

router.get('/', getBudgets);

router.get(
    '/status/:month',
    getBudgetStatus
);

router.get(
    '/:id',
    budgetIdValidator,
    handleValidationErrors,
    getBudget
);

router.patch(
    '/:id',
    budgetIdValidator,
    handleValidationErrors,
    updateBudget
);

router.delete(
    '/:id',
    budgetIdValidator,
    handleValidationErrors,
    deleteBudget
);

export default router;