import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        minlength: [2, 'Category name must be at least 2 characters'],
        maxlength: [50, 'Category name must be less than 50 characters'],
    },
    icon: {
        type: String,
        default: '📁',
    },
    color: {
        type: String,
        default: '#3498db',
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color'],
    },
    type: {
        type: String,
        enum: ['income', 'expense', 'both'],
        default: 'both',
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        maxlength: [500, 'Description must be less than 500 characters'],
    },
}, { timestamps: true });

// Index for unique category name per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

// Default categories that all users get
const DEFAULT_CATEGORIES = {
    income: [
        { name: 'Salary', icon: '💰', color: '#27ae60' },
        { name: 'Freelance', icon: '💻', color: '#3498db' },
        { name: 'Bonus', icon: '🎁', color: '#f39c12' },
        { name: 'Investment', icon: '📈', color: '#9b59b6' },
        { name: 'Other Income', icon: '➕', color: '#95a5a6' },
    ],
    expense: [
        { name: 'Food & Dining', icon: '🍔', color: '#e74c3c' },
        { name: 'Shopping', icon: '🛍️', color: '#e91e63' },
        { name: 'Transportation', icon: '🚗', color: '#2196f3' },
        { name: 'Utilities', icon: '💡', color: '#ff9800' },
        { name: 'Entertainment', icon: '🎬', color: '#9c27b0' },
        { name: 'Healthcare', icon: '⚕️', color: '#4caf50' },
        { name: 'Education', icon: '📚', color: '#00bcd4' },
        { name: 'Travel', icon: '✈️', color: '#ff5722' },
        { name: 'Subscriptions', icon: '📱', color: '#673ab7' },
        { name: 'Other Expense', icon: '➖', color: '#95a5a6' },
    ],
};

// Static method to create default categories for a user
categorySchema.statics.createDefaultCategories = async function(userId) {
    const categories = [];

    for (const category of DEFAULT_CATEGORIES.income) {
        categories.push({
            userId,
            ...category,
            type: 'income',
            isDefault: true,
        });
    }

    for (const category of DEFAULT_CATEGORIES.expense) {
        categories.push({
            userId,
            ...category,
            type: 'expense',
            isDefault: true,
        });
    }

    return await this.insertMany(categories);
};

export default mongoose.model('Category', categorySchema);