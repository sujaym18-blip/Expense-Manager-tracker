import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/database.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'FRONTEND_URL',
    'PORT',
];

const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
    console.error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
    process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async() => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('✅ Database connected');

        // Start listening
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

startServer();