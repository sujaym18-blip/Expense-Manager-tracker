import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Reminder title is required'],
        trim: true,
        maxlength: [200, 'Title must be less than 200 characters'],
    },
    description: {
        type: String,
        maxlength: [500, 'Description must be less than 500 characters'],
    },
    type: {
        type: String,
        enum: ['bill', 'subscription', 'budget_alert', 'custom'],
        default: 'custom',
    },
    reminderDate: {
        type: Date,
        required: [true, 'Reminder date is required'],
        index: true,
    },
    frequency: {
        type: String,
        enum: ['once', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'once',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    notificationSent: {
        type: Boolean,
        default: false,
    },
    amount: {
        type: Number,
        min: [0, 'Amount must be positive'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
}, { timestamps: true });

// Index for querying active reminders by date
reminderSchema.index({ userId: 1, isActive: 1, reminderDate: 1 });

// Pre-populate category
reminderSchema.pre(/^find/, function() {
    this.populate({
        path: 'category',
        select: 'name icon',
    });
});

// Static method to find pending reminders
reminderSchema.statics.findPendingReminders = async function(userId) {
    const now = new Date();
    return await this.find({
        userId,
        isActive: true,
        reminderDate: { $lte: now },
        notificationSent: false,
    });
};

export default mongoose.model('Reminder', reminderSchema);