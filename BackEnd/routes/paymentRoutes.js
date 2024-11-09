const express = require("express");
const Stripe = require("stripe");
const {
  createPaymentIntent,
  processPayment,
  createPaymentMethod,
} = require("../controllers/paymentController");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();


router.post("/process", processPayment);

router.post("/create-payment-method", createPaymentMethod);

module.exports = router;
