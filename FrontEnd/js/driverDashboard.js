import { getAllOffenses } from "./api.js";
let offenses = [];
let currentEditIndex = null;

// Function to load offenses into the respective tables
function loadOffenses(offenses) {
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

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];

  console.log(user.licenseNumber);

  offenses = await getAllOffenses();
  offenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  console.log(offenses);
  offenses = offenses.filter((offense) => {
    return offense.licenseNumber == user.licenseNumber;
  });
  loadOffenses(offenses);
});
