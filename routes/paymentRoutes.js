const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to handle payment processing
router.post('/process', paymentController.processPayment);

module.exports = router;
