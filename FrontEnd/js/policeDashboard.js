import { getAllOffenses, editOffense, deleteOffenseById } from "./api.js";

let pendingOffenses,
  offenseHistory = [];
let currentEditIndex = null;

// Function to load pending offenses
function loadPendingOffenses(pendingOffenses) {
  const pendingOffensesTable = document
    .getElementById("pending-offenses")
    .getElementsByTagName("tbody")[0];
  pendingOffensesTable.innerHTML = ""; // Clear the table

  pendingOffenses.forEach((offense, index) => {
    const row = pendingOffensesTable.insertRow();
    row.innerHTML = `
            <td>${offense.licenseNumber}</td>
            <td>${offense.offenseDetails}</td>
            <td>${offense.location}</td>
            <td>${offense.fine}</td>
            <td>${offense.createdAt}</td>
            <td>
                <button class="edit-btn" data-index="${index}" >Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
        `;
    row
      .querySelector(".edit-btn")
      .addEventListener("click", () => openEditModal(index));
    row
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteOffense(index));
  });
}

// Function to load offense history
function loadOffenseHistory(offenseHistory) {
  const offenseHistoryTable = document
    .getElementById("offense-history")
    .getElementsByTagName("tbody")[0];
  offenseHistoryTable.innerHTML = ""; // Clear the table

  offenseHistory.forEach((offense) => {
    const row = offenseHistoryTable.insertRow();
    row.innerHTML = `
            <td>${offense.licenseNumber}</td>
            <td>${offense.offenseDetails}</td>
            <td>${offense.location}</td>
            <td>${offense.fine}</td>
            <td>${offense.createdAt}</td>
            <td>${offense.paidStatus}</td>
        `;
  });
}

// Function to open the edit modal and populate with offense data------------------------------------------------
function openEditModal(index) {
  currentEditIndex = index;
  const offense = pendingOffenses[index];
  document.getElementById("licenseNumber").value = offense.licenseNumber;
  document.getElementById("offense").value = offense.offenseDetails;
  document.getElementById("location").value = offense.location;
  document.getElementById("amount").value = offense.fine;
  // document.getElementById("date").value = offense.createdAt;
  document.getElementById("editModal").style.display = "flex";
}

// Function to close the modal---------------------------------------------------------------------------------
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// Function to save the edited offense data---------------------------------------------------------------------
async function saveEdit() {
  const offense = pendingOffenses[currentEditIndex];
  if (!offense) {
    return;
  }
  offense.offenseDetails = document.getElementById("offense").value;
  offense.location = document.getElementById("location").value;
  offense.fine = document.getElementById("amount").value;
  const updateOffense = await editOffense(offense);
  console.log(updateOffense);
  closeModal();
  loadPendingOffenses(pendingOffenses);
}

// Function to delete an offense---------------------------------------------------------------------------------
async function deleteOffense(index) {
  const offense = pendingOffenses[index];
  if (!offense) {
    return;
  }
  if (confirm("Are you sure you want to delete this offense?")) {
    const deleted = await deleteOffenseById(offense);
    alert(deleted.message);
    pendingOffenses.splice(index, 1);
    loadPendingOffenses(pendingOffenses);
  }
}
document.querySelector(".close").addEventListener("click", () => closeModal());
document.querySelector(".save-btn").addEventListener("click", () => saveEdit());

// Initialize tables with data on page load
document.addEventListener("DOMContentLoaded", async () => {
  const offences = await getAllOffenses();
  offences.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // Sample data for pending offenses
  pendingOffenses = offences.filter((x) => {
    return x.paidStatus === "Unpaid";
  });

  // Sample data for offense history
  offenseHistory = offences.filter((x) => {
    return x.paidStatus === "Paid";
  });
  loadPendingOffenses(pendingOffenses);
  loadOffenseHistory(offenseHistory);
});
