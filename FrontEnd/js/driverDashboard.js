// Dummy data for offenses
const offenses = [
    { offenseDetails: "Speeding", fine: 150, location: "Downtown", paidStatus: "Unpaid" },
    { offenseDetails: "Parking Violation", fine: 75, location: "5th Avenue", paidStatus: "Paid" },
    { offenseDetails: "Signal Violation", fine: 100, location: "Main Street", paidStatus: "Unpaid" },
];

document.addEventListener("DOMContentLoaded", function () {
    loadOffenses();
});

// Function to load offenses into the respective tables
function loadOffenses() {
    const pendingOffensesTable = document.getElementById("offenses");
    const pastOffensesTable = document.getElementById("past-offenses");

    // Clear existing rows
    pendingOffensesTable.innerHTML = "";
    pastOffensesTable.innerHTML = "";

    // Loop through offenses and categorize based on payment status
    offenses.forEach((offense, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${offense.offenseDetails}</td>
            <td>$${offense.fine}</td>
            <td>${offense.location}</td>
            <td>${offense.paidStatus}</td>
        `;

        if (offense.paidStatus === "Unpaid") {
            // Add a "Pay Now" button to pending offenses
            const actionCell = document.createElement("td");
            const payButton = document.createElement("button");
            payButton.textContent = "Pay Now";
            payButton.onclick = () => payFine(index);
            actionCell.appendChild(payButton);
            row.appendChild(actionCell);

            pendingOffensesTable.appendChild(row);
        } else {
            // Only display past offenses in "Past Offenses" table
            pastOffensesTable.appendChild(row);
        }
    });
}

// Function to handle fine payment
function payFine(index) {
    const offense = offenses[index];
    offense.paidStatus = "Paid";

    alert(`Payment successful for: ${offense.offenseDetails}`);
    loadOffenses(); // Refresh tables after updating the status
}
