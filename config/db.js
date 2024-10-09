// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://kushalshakya010:padma123@trafficoffencemanagemen.wyrbo.mongodb.net/?retryWrites=true&w=majority&appName=TrafficOffenceManagement');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);  // Exit the app if there's an error
    }
};

module.exports = connectDB;
