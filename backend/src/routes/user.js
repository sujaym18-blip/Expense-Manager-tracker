import express from 'express';
import {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    getUserStatistics,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import {
    updateProfileValidator,
} from '../utils/validators.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', getProfile);

router.patch(
    '/profile',
    updateProfileValidator,
    handleValidationErrors,
    updateProfile
);

router.post('/change-password', changePassword);

router.delete('/account', deleteAccount);

router.get('/statistics', getUserStatistics);

export default router;