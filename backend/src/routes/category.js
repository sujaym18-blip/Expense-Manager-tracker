import express from 'express';
import {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    getCategoryStatistics,
} from '../controllers/categoryController.js';
import { authenticate } from '../middleware/auth.js';
import {
    createCategoryValidator,
    categoryIdValidator,
} from '../utils/validators.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All category routes require authentication
router.use(authenticate);

router.post(
    '/',
    createCategoryValidator,
    handleValidationErrors,
    createCategory
);

router.get('/', getCategories);

router.get(
    '/:id',
    categoryIdValidator,
    handleValidationErrors,
    getCategory
);

router.patch(
    '/:id',
    categoryIdValidator,
    createCategoryValidator,
    handleValidationErrors,
    updateCategory
);

router.delete(
    '/:id',
    categoryIdValidator,
    handleValidationErrors,
    deleteCategory
);

router.get(
    '/:id/statistics',
    categoryIdValidator,
    handleValidationErrors,
    getCategoryStatistics
);

export default router;