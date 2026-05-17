import express from 'express';
import {
    register,
    login,
    forgotPassword,
    resetPassword,
    logout,
} from '../controllers/authController.js';
import {
    registerValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} from '../utils/validators.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post(
    '/register',
    registerValidator,
    handleValidationErrors,
    register
);

router.post(
    '/login',
    loginValidator,
    handleValidationErrors,
    login
);

router.post(
    '/forgot-password',
    forgotPasswordValidator,
    handleValidationErrors,
    forgotPassword
);

router.post(
    '/reset-password',
    resetPasswordValidator,
    handleValidationErrors,
    resetPassword
);

router.post('/logout', logout);

export default router;