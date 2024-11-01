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
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
