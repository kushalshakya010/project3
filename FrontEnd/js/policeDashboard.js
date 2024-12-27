import { getAllOffenses, editOffense, deleteOffenseById } from "./api.js";

let pendingOffenses = [],
  offenseHistory = [];
let currentEditIndex = null;
let currentPendingPage = 1;
let currentHistoryPage = 1;
const recordsPerPage = 10; // Adjust the number of records per page as needed

// Function to load pending offenses with pagination
function loadPendingOffenses(pendingOffenses) {
  const pendingOffensesTable = document
    .getElementById("pending-offenses")
    .getElementsByTagName("tbody")[0];
  pendingOffensesTable.innerHTML = ""; // Clear the table

  const start = (currentPendingPage - 1) * recordsPerPage;
  const end = start + recordsPerPage;
  const paginatedOffenses = pendingOffenses.slice(start, end);

  paginatedOffenses.forEach((offense, index) => {
    const row = pendingOffensesTable.insertRow();
    row.innerHTML = `
      <td>${offense.licenseNumber}</td>
      <td>${offense.offenseDetails}</td>
      <td>${offense.location}</td>
      <td>${offense.fine}</td>
      <td>${offense.createdAt}</td>
      <td>
        <button class="edit-btn" data-index="${start + index}" >Edit</button>
        <button class="delete-btn" data-index="${start + index}">Delete</button>
      </td>
    `;
    row
      .querySelector(".edit-btn")
      .addEventListener("click", () => openEditModal(start + index));
    row
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteOffense(start + index));
  });

  updatePendingPagination();
}

// Function to load offense history with pagination
function loadOffenseHistory(offenseHistory) {
  const offenseHistoryTable = document
    .getElementById("offense-history")
    .getElementsByTagName("tbody")[0];
  offenseHistoryTable.innerHTML = ""; // Clear the table

  const start = (currentHistoryPage - 1) * recordsPerPage;
  const end = start + recordsPerPage;
  const paginatedHistory = offenseHistory.slice(start, end);

  paginatedHistory.forEach((offense) => {
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

  updateHistoryPagination();
}

// Function to create pagination controls for pending offenses
function updatePendingPagination() {
  const paginationContainer = document.getElementById("pending-pagination");
  paginationContainer.innerHTML = ""; // Clear existing pagination

  const totalPages = Math.ceil(pendingOffenses.length / recordsPerPage);

  const pageButton = document.createElement("button");
  pageButton.classList.add("page-btn");
  pageButton.innerText = "<";
  pageButton.addEventListener("click", () => {
    currentPendingPage = currentPendingPage != 1 ? currentPendingPage - 1 : 1;
    loadPendingOffenses(pendingOffenses);
  });
  paginationContainer.appendChild(pageButton);
  let index = 1;
  if (currentPendingPage > 5) {
    index = currentPendingPage - 4;
  }
  for (let i = index; i <= index + 4; i++) {
    const pageButton = document.createElement("button");
    pageButton.classList.add("page-btn");
    if (i === currentPendingPage) pageButton.classList.add("active");
    pageButton.innerText = i;
    pageButton.addEventListener("click", () => {
      currentPendingPage = i;
      loadPendingOffenses(pendingOffenses);
    });
    paginationContainer.appendChild(pageButton);
  }

  const pageButton2 = document.createElement("button");
  pageButton2.classList.add("page-btn");
  pageButton2.innerText = ">";
  pageButton2.addEventListener("click", () => {
    currentPendingPage =
      currentPendingPage != totalPages ? currentPendingPage + 1 : totalPages;
    loadPendingOffenses(pendingOffenses);
  });
  paginationContainer.appendChild(pageButton2);
}

// Function to create pagination controls for offense history
function updateHistoryPagination() {
  const paginationContainer = document.getElementById("history-pagination");
  paginationContainer.innerHTML = ""; // Clear existing pagination

  const totalPages = Math.ceil(offenseHistory.length / recordsPerPage);

  const pageButton = document.createElement("button");
  pageButton.classList.add("page-btn");
  pageButton.innerText = "<";
  pageButton.addEventListener("click", () => {
    currentHistoryPage = currentHistoryPage != 1 ? currentHistoryPage - 1 : 1;
    loadOffenseHistory(offenseHistory);
  });
  paginationContainer.appendChild(pageButton);
  let index = 1;
  if (currentHistoryPage > 5) {
    index = currentHistoryPage - 4;
  }
  for (let i = index; i <= index + 4; i++) {
    const pageButton = document.createElement("button");
    pageButton.classList.add("page-btn");
    if (i === currentHistoryPage) pageButton.classList.add("active");
    pageButton.innerText = i;
    pageButton.addEventListener("click", () => {
      currentHistoryPage = i;
      loadOffenseHistory(offenseHistory);
    });
    paginationContainer.appendChild(pageButton);
  }
  const pageButton2 = document.createElement("button");
  pageButton2.classList.add("page-btn");
  pageButton2.innerText = ">";
  pageButton2.addEventListener("click", () => {
    currentHistoryPage =
      currentHistoryPage != totalPages ? currentHistoryPage + 1 : totalPages;
      loadOffenseHistory(offenseHistory);
  });
  paginationContainer.appendChild(pageButton2);
}

// Function to open the edit modal and populate with offense data
function openEditModal(index) {
  currentEditIndex = index;
  const offense = pendingOffenses[index];
  document.getElementById("licenseNumber").value = offense.licenseNumber;
  document.getElementById("offense").value = offense.offenseDetails;
  document.getElementById("location").value = offense.location;
  document.getElementById("amount").value = offense.fine;
  document.getElementById("editModal").style.display = "flex";
}

// Function to close the modal
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// Function to save the edited offense data
async function saveEdit() {
  const offense = pendingOffenses[currentEditIndex];
  if (!offense) return;

  offense.offenseDetails = document.getElementById("offense").value;
  offense.location = document.getElementById("location").value;
  offense.fine = document.getElementById("amount").value;
  const updateOffense = await editOffense(offense);
  console.log(updateOffense);
  closeModal();
  loadPendingOffenses(pendingOffenses);
}

// Function to delete an offense
async function deleteOffense(index) {
  const offense = pendingOffenses[index];
  if (!offense) return;

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
  const offenses = await getAllOffenses();

  var licenseNumber = localStorage.getItem("licenseNumber");
  if (licenseNumber) {
    document.getElementById("license-number").textContent = licenseNumber;
  } else {
    document.getElementById("license-number").textContent = "Unknown";
  }

  offenses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  pendingOffenses = offenses.filter((x) => x.paidStatus === "Unpaid");
  offenseHistory = offenses.filter((x) => x.paidStatus === "Paid");

  loadPendingOffenses(pendingOffenses);
  loadOffenseHistory(offenseHistory);
});

// ----------------greetings---------------

// Function to update greeting based on time of day
function updateGreeting() {
  const greetingText = document.getElementById("greeting-text");
  const currentHour = new Date().getHours(); // Get current hour (0-23)

  if (currentHour < 12) {
    greetingText.textContent = "Good Morning !";
  } else if (currentHour < 18) {
    greetingText.textContent = "Good Afternoon !";
  } else {
    greetingText.textContent = "Good Evening !";
  }
}
// Call the function to set the initial greeting
updateGreeting();
