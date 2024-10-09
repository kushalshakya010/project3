const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    licenseNumber: {
        type: String,
        required: true,
        unique: true,  // Ensure the license number is unique
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true,  // Ensure the contact number is unique
    },
    role: {
        type: String,
        enum: ['licenseHolder', 'police'],  // Two possible roles
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', UserSchema);
