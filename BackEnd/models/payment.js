const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    offenseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offense',
        required: true,
    },
    paymentIntentId: {
        type: String,
        required: true,
        unique: true, // Ensure that paymentIntentId is unique
    },
    amount: {
        type: Number,
        required: true,
        min: 0, // Validate that amount is a positive number
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'], // Limit status to defined values
        default: 'Pending',
    },
}, { timestamps: true });

// Optional: Indexing for better performance
paymentSchema.index({ offenseId: 1 });
paymentSchema.index({ paymentIntentId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
