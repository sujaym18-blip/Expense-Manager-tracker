import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Transaction type is required'],
        index: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be positive'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
        index: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description must be less than 500 characters'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        index: true,
    },
    receiptImage: {
        type: String,
        default: null,
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'bank_transfer', 'wallet', 'other'],
        default: 'cash',
    },
    tags: {
        type: [String],
        default: [],
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurringData: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
        },
        nextDate: Date,
        parentTransactionId: mongoose.Schema.Types.ObjectId,
    },
}, { timestamps: true });

// Indexes for common queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, date: -1 });

// Virtual to calculate transaction for monthly summaries
transactionSchema.virtual('month').get(function() {
    return this.date.toISOString().slice(0, 7); // YYYY-MM format
});

// Populate category details by default
transactionSchema.pre(/^find/, function() {
    this.populate({
        path: 'category',
        select: 'name icon color',
    });
});

export default mongoose.model('Transaction', transactionSchema);