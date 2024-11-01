const mongoose = require('mongoose');

const offenseSchema = new mongoose.Schema({
    licenseNumber: {
        type: Number,
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
        default: 'Unpaid',
    },
}, { timestamps: true });

module.exports = mongoose.model('Offense', offenseSchema);
