const express = require("express");
require("dotenv").config(); //initializes dotenv
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create a payment intent
router.post("/", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // Optionally, add more details here
    });
    res.status(201).json({
      message: "Payment created successfully!",
      paymentIntent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

module.exports = router;
