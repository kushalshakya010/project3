const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(express.json()); // For parsing JSON requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Payment routes
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
