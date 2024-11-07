const Stripe = require('stripe');
const dotenv = require('dotenv'); // Ensure dotenv is imported
const Offense = require('../models/Offense');
const Payment = require('../models/payment');
const nodemailer = require('nodemailer');

dotenv.config(); // Load environment variables

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Email notification function
const sendEmailNotification = async (email, offenseDetails) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Payment Notification',
        text: `Your payment for the following offense has been processed: ${offenseDetails}`,
    };

    await transporter.sendMail(mailOptions);
};


// Create a payment intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency } = req.body;
    
        // Basic validation
        if (!amount || !currency) {
          return res.status(400).json({ error: "Amount and currency are required" });
        }
    
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
        });
    
        res.status(201).json({
          message: "Payment created successfully!",
          paymentIntent,
        });
      } catch (error) {
        console.error("Payment Intent Error:", error);
        res.status(500).json({ error: "Failed to create payment" });
      }
};

// Process payment
exports.processPayment = async (req, res) => {
    const { offenseId, paymentMethodId } = req.body;

    // Validate the request data
    if (!offenseId || !paymentMethodId) {
        return res.status(400).json({ message: 'Offense ID and Payment Method ID are required' });
    }

    try {
        // Retrieve the offense
        const offense = await Offense.findById(offenseId);
        if (!offense) return res.status(404).json({ message: 'Offense not found' });

        // Create a Stripe payment
        const paymentIntent = await stripe.paymentIntents.create({
            amount: offense.fine * 100, // Fine amount in cents
            payment_method: paymentMethodId,
            confirm: true,
        });

        // Mark offense as paid
        offense.paidStatus = 'Paid';
        await offense.save();

        // Record payment in the Payment collection
        const payment = new Payment({
            offenseId: offense._id,
            paymentIntentId: paymentIntent.id,
            amount: offense.fine,
            status: 'Paid',
        });
        await payment.save();

        // Send email notification
        await sendEmailNotification(offense.email, offense.offenseDetails);

        res.status(200).json({ message: 'Payment successful!' });
    } catch (error) {
        console.error("Payment Processing Error:", error);
        res.status(500).json({ message: error.message || "Failed to process payment" });
    }
};

exports.createPaymentMethod = async (req, res) => {
    try {
        const { type, card } = req.body;

        // Create a new PaymentMethod with Stripe
        const paymentMethod = await stripe.paymentMethods.create({
            type, // e.g., 'card'
            card, // { number, exp_month, exp_year, cvc } for card payment method
        });

        res.status(201).json({
            message: "Payment method created successfully!",
            paymentMethod,
        });
    } catch (error) {
        console.error("Error creating payment method:", error);
        res.status(500).json({ error: "Failed to create payment method" });
    }
};