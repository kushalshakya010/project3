const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    licenseNumber: {
        type: String,
        required: true,
    },
    offenseDetails: {
        type: String,
        required: true,
    },
    fine: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    paidStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid',
    },
});

module.exports = mongoose.model('Payment', paymentSchema);
