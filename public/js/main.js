const stripe = Stripe('your_publishable_key'); // Replace with your actual publishable key
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const form = document.getElementById('payment-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Create payment method
    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    if (error) {
        document.getElementById('payment-error').textContent = error.message;
    } else {
        // Send paymentMethod.id and offenseId to your backend
        const offenseId = 'your-offense-id'; // Replace with the actual offense ID
        const response = await fetch('/api/payments/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ offenseId, paymentMethodId: paymentMethod.id }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            document.getElementById('payment-error').textContent = result.message;
        }
    }
});
