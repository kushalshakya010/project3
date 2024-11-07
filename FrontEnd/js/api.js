// api.js
document.getElementById('add-offense-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const licenseNumber = document.getElementById('license-number').value;
    const offenseDetails = document.getElementById('offense-details').value;
    const fine = document.getElementById('fine').value;
    const location = document.getElementById('location').value;
    const contactNumber = document.getElementById('contact-number').value;
    const email = document.getElementById('email').value;

    // Simulate sending data to the backend via AJAX
    console.log("Form Submitted:", {
        licenseNumber,
        offenseDetails,
        fine,
        location,
        contactNumber,
        email
    });

    // Simulate a successful response
    setTimeout(function() {
        alert('Offense added successfully!');
        window.location.href = '#'; // Redirect to dashboard after successful form submission
    }, 1000);
});
