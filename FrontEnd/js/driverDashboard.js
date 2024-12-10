import { getAllOffenses, editOffense } from "./api.js";

let offenses = [];
const ITEMS_PER_PAGE = 10; // Number of offenses displayed per page
let currentOffensePage = 1;
let currentPastOffensePage = 1;
let totalUnpaid = 0;
let totalPaid = 0;
let g = new JustGage({
  id: "gauge",
  value: 0, // Example value for the risk meter
  min: 0,
  max: 10,
  title: "Risk Level", // Customize the title
  // label: "Risk", // Optional label
  // levelColors: ["#f00", "#ff0", "#0f0"], // Color scale for the gauge
  // gaugeWidthScale: 0.6, // Adjust the gauge thickness
});

const loader = document.querySelector(".mainContainer");

// Load offenses with pagination
function loadOffenses() {
  const pendingOffenses = offenses.filter(
    (offense) => offense.paidStatus === "Unpaid"
  );

  const pastOffenses = offenses.filter(
    (offense) => offense.paidStatus === "Paid"
  );

  totalUnpaid = pendingOffenses.length;
  totalPaid = pastOffenses.length;
  g.refresh(scaledValue());
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
  window.location.href = `/FrontEnd/views/driver/payment.html?id=${pendingOffense._id}`;

  // loader.style.visibility = "visible";
  // pendingOffense.paidStatus = "Paid";
  // const updateOffense = await editOffense(pendingOffense);

  // alert(`Payment successful!`);
  // loadOffenses(); // Refresh tables after payment update
  // loader.style.visibility = "hidden";
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user")) || [];
  offenses = await getAllOffenses();

  var licenseNumber = localStorage.getItem("licenseNumber");
  if (licenseNumber) {
    document.getElementById("license-number").textContent = licenseNumber;
  } else {
    document.getElementById("license-number").textContent = "Unknown";
  }

  offenses = offenses.filter(
    (offense) => offense.licenseNumber == user.licenseNumber
  );
  loadOffenses();
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

// ----------------------------------------risk meter-=----------------------------------
function scaledValue() {
  let totalOffenses = totalPaid + totalUnpaid;
  console.log(totalOffenses);
  return 10 * (totalUnpaid / totalOffenses);
}

// Call the function to set the initial greeting
updateGreeting();
