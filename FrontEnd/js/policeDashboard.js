// Sample data for pending offenses
const pendingOffenses = [
    {
        licenseNumber: "A12345",
        offense: "Speeding",
        location: "Downtown",
        amount: "$200",
        date: "2024-11-01"
    },
    {
        licenseNumber: "B67890",
        offense: "Illegal Parking",
        location: "5th Avenue",
        amount: "$50",
        date: "2024-10-28"
    },
    {
        licenseNumber: "C24680",
        offense: "Signal Violation",
        location: "Main Street",
        amount: "$100",
        date: "2024-10-25"
    }
];

// Sample data for offense history
const offenseHistory = [
    {
        licenseNumber: "A12345",
        offense: "Speeding",
        location: "Downtown",
        amount: "$200",
        date: "2024-09-15",
        paidStatus: "Paid"
    },
    {
        licenseNumber: "D11223",
        offense: "Seatbelt Violation",
        location: "Broadway",
        amount: "$75",
        date: "2024-08-20",
        paidStatus: "Paid"
    }
];

let currentEditIndex = null;

// Function to load pending offenses
function loadPendingOffenses() {
    const pendingOffensesTable = document.getElementById("pending-offenses").getElementsByTagName('tbody')[0];
    pendingOffensesTable.innerHTML = ""; // Clear the table

    pendingOffenses.forEach((offense, index) => {
        const row = pendingOffensesTable.insertRow();
        row.innerHTML = `
            <td>${offense.licenseNumber}</td>
            <td>${offense.offense}</td>
            <td>${offense.location}</td>
            <td>${offense.amount}</td>
            <td>${offense.date}</td>
            <td>
                <button onclick="openEditModal(${index})">Edit</button>
                <button onclick="deleteOffense(${index})">Delete</button>
            </td>
        `;
    });
}

// Function to load offense history
function loadOffenseHistory() {
    const offenseHistoryTable = document.getElementById("offense-history").getElementsByTagName('tbody')[0];
    offenseHistoryTable.innerHTML = ""; // Clear the table

    offenseHistory.forEach(offense => {
        const row = offenseHistoryTable.insertRow();
        row.innerHTML = `
            <td>${offense.licenseNumber}</td>
            <td>${offense.offense}</td>
            <td>${offense.location}</td>
            <td>${offense.amount}</td>
            <td>${offense.date}</td>
            <td>${offense.paidStatus}</td>
        `;
    });
}

// Function to open the edit modal and populate with offense data
function openEditModal(index) {
    currentEditIndex = index;
    const offense = pendingOffenses[index];
    document.getElementById("licenseNumber").value = offense.licenseNumber;
    document.getElementById("offense").value = offense.offense;
    document.getElementById("location").value = offense.location;
    document.getElementById("amount").value = offense.amount;
    document.getElementById("date").value = offense.date;
    document.getElementById("editModal").style.display = "flex";
}

// Function to close the modal
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

// Function to save the edited offense data
function saveEdit() {
    const offense = pendingOffenses[currentEditIndex];
    offense.offense = document.getElementById("offense").value;
    offense.location = document.getElementById("location").value;
    offense.amount = document.getElementById("amount").value;
    offense.date = document.getElementById("date").value;
    closeModal();
    loadPendingOffenses();
}

// Function to delete an offense
function deleteOffense(index) {
    if (confirm("Are you sure you want to delete this offense?")) {
        pendingOffenses.splice(index, 1);
        loadPendingOffenses();
    }
}

// Initialize tables with data on page load
document.addEventListener("DOMContentLoaded", () => {
    loadPendingOffenses();
    loadOffenseHistory();
});
