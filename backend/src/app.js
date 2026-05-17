import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import transactionRoutes from './routes/transaction.js';
import categoryRoutes from './routes/category.js';
import budgetRoutes from './routes/budget.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// ==================== Middleware ====================

// CORS Configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging (simple version)
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`${req.method} ${req.path}`);
    }
    next();
});

// ==================== Routes ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);

// ==================== Error Handling ====================

// 404 Not Found Handler
app.use(notFoundHandler);

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;