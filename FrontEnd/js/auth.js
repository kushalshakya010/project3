document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const role = document.getElementById('role').value;
    const licenseNumber = document.getElementById('license').value;

    if (!role || !licenseNumber) {
        alert('Please fill out all fields');
        return;
    }

    // Send the data to backend API
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            role: role,
            licenseNumber: licenseNumber
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to the appropriate dashboard
            if (role === 'police') {
                window.location.href = '/police/dashboard.html'; // Redirect to Police dashboard
            } else {
                window.location.href = '/drivers/dashboard.html'; // Redirect to Driver dashboard
            }
        } else {
            alert(data.message || 'Login failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login');
    });
});
