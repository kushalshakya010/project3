import { getAllOffenses, editOffense } from "./api.js";

let offenses = [];
const ITEMS_PER_PAGE = 10; // Number of offenses displayed per page
let currentOffensePage = 1;
let currentPastOffensePage = 1;

const loader = document.querySelector(".mainContainer");

// Load offenses with pagination
function loadOffenses() {
  const pendingOffenses = offenses.filter(
    (offense) => offense.paidStatus === "Unpaid"
  );

  const pastOffenses = offenses.filter(
    (offense) => offense.paidStatus === "Paid"
  );

  paginateTable(
    "offenses",
    pendingOffenses,
    currentOffensePage,
    "offense-pagination",
    updateOffensePage
  );
  paginateTable(
    "past-offenses",
    pastOffenses,
    currentPastOffensePage,
    "past-offense-pagination",
    updatePastOffensePage
  );
}

// Helper to paginate tables
function paginateTable(
  tableId,
  offenseList,
  page,
  paginationContainerId,
  setPageCallback
) {
  const tableBody = document.getElementById(tableId);
  const paginationContainer = document.getElementById(paginationContainerId);

  tableBody.innerHTML = "";
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOffenses = offenseList.slice(startIndex, endIndex);

  paginatedOffenses.forEach((offense, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${offense.offenseDetails}</td>
      <td>$${offense.fine}</td>
      <td>${offense.location}</td>
      <td>${offense.paidStatus}</td>
    `;
    if (offense.paidStatus === "Unpaid") {
      const actionCell = document.createElement("td");
      const payButton = document.createElement("button");
      payButton.textContent = "Pay Now";
      payButton.onclick = () => payFine(index + startIndex, offense);
      actionCell.appendChild(payButton);
      row.appendChild(actionCell);
    }
    tableBody.appendChild(row);
  });

  renderPagination(
    offenseList.length,
    page,
    paginationContainer,
    setPageCallback
  );
}

// Generate pagination controls
function renderPagination(totalItems, currentPage, container, setPageCallback) {
  container.innerHTML = "";
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = "page-btn";
    pageButton.textContent = i;
    pageButton.onclick = () => setPageCallback(i);
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    container.appendChild(pageButton);
  }
}

// Page update callbacks
function updateOffensePage(page) {
  currentOffensePage = page;
  loadOffenses();
}

function updatePastOffensePage(page) {
  currentPastOffensePage = page;
  loadOffenses();
}

// Payment handling
async function payFine(index, pendingOffense) {
  loader.style.visibility = "visible";
  pendingOffense.paidStatus = "Paid";
  const updateOffense = await editOffense(pendingOffense);

  alert(`Payment successful for: ${offenses[index].offenseDetails}`);
  loadOffenses(); // Refresh tables after payment update
  loader.style.visibility = "hidden";
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];
  offenses = await getAllOffenses();

  offenses = offenses.filter(
    (offense) => offense.licenseNumber == user.licenseNumber
  );
  loadOffenses();
});
