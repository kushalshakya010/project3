const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Initialize Stripe using the secret key from .env
const Payment = require('../models/Payment'); // Assuming your Payment model is in the models folder
const nodemailer = require('nodemailer');

// Create a payment method and process payment
exports.processPayment = async (req, res) => {
    const { offenseId, paymentMethodId } = req.body;

    try {
        // Find the offense details using the offenseId
        const offense = await Payment.findById(offenseId);
        if (!offense) {
            return res.status(404).send({ error: 'Offense not found' });
        }

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: offense.fine * 100, // Fine amount in cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true, // Confirm the payment
        });

        // Update the offense status to paid
        offense.paidStatus = 'paid';
        await offense.save();

        // Send email notification to the user
        sendEmailNotification(offense.email, offense);

        res.status(200).send({ success: 'Payment successful', paymentIntent });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Payment failed', message: error.message });
    }
};

// Function to send an email notification
const sendEmailNotification = (email, offense) => {
    // Set up transporter for nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use any email service provider
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Offense Payment Confirmation',
        text: `Dear User,\n\nYour payment of $${offense.fine} for the offense "${offense.offenseDetails}" has been successfully processed.\n\nThank you.\nTraffic Management System`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};
