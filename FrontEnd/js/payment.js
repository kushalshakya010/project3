const queryString = window.location.search;

// Extract and decode the user object
const urlParams = new URLSearchParams(queryString);
const offenseId = urlParams.get("id");

// Initialize Stripe
const stripe = Stripe(CONFIG.STRIPE_PUBLISHABLE_KEY); // Replace with your test publishable key
const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

// Handle form submission
const form = document.getElementById("payment-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Create a payment method
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: "card",
    card: cardElement,
  });

  if (error) {
    // Display error.message in #card-errors
    document.getElementById("card-errors").textContent = error.message;
  } else {
    result = await processPayment(offenseId, paymentMethod.id);

    console.log(result);
    if (result.message != null) {
      // Send paymentMethod.id to your server to create a payment intent
      console.log("Payment method created successfully:", paymentMethod.id);
      alert("Test payment successful!");
      window.location.href = `/FrontEnd/views/driver/dashboard.html`;
    }
    if (result.error != null) {
      // Send paymentMethod.id to your server to create a payment intent
      alert(result.error);
    }
  }
});
// --------------------------------------processPayment---------------------------------------------------
const processPayment = async (offenseId, paymentMethodId) => {
  try {
    const res = await fetch("http://localhost:3000/api/payments/process/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ offenseId, paymentMethodId }),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    alert("Error");
  }
};
