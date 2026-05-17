import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    limit: {
        type: Number,
        required: [true, 'Budget limit is required'],
        min: [0.01, 'Budget limit must be greater than 0'],
    },
    month: {
        type: String,
        required: [true, 'Month is required in YYYY-MM format'],
        match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
    spent: {
        type: Number,
        default: 0,
        min: [0, 'Spent amount cannot be negative'],
    },
    alertThreshold: {
        type: Number,
        default: 80,
        min: [0, 'Alert threshold cannot be negative'],
        max: [100, 'Alert threshold cannot exceed 100'],
    },
    alertSent: {
        type: Boolean,
        default: false,
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes must be less than 500 characters'],
    },
}, { timestamps: true });

// Index for unique budget per user, category, and month
budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

// Pre-populate category
budgetSchema.pre(/^find/, function() {
    this.populate({
        path: 'category',
        select: 'name icon color',
    });
});

// Virtual to calculate percentage spent
budgetSchema.virtual('percentageSpent').get(function() {
    if (this.limit === 0) return 0;
    return Math.min((this.spent / this.limit) * 100, 100);
});

// Virtual to calculate remaining amount
budgetSchema.virtual('remaining').get(function() {
    return Math.max(this.limit - this.spent, 0);
});

// Method to check if alert should be sent
budgetSchema.methods.shouldSendAlert = function() {
    return !this.alertSent && this.percentageSpent >= this.alertThreshold;
};

export default mongoose.model('Budget', budgetSchema);