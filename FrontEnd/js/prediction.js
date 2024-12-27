import { getAllOffenses } from "./api.js";

const offenses = await getAllOffenses();
let chart;

let groupedByYear = Object.entries(
  offenses.reduce((acc, obj) => {
    const year = new Date(obj.createdAt).getFullYear(); // Extract the year
    acc[year] = (acc[year] || 0) + 1; // Increment the count for the year
    return acc;
  }, {})
).map(([year, count]) => ({ year, count })); // Convert to desired array format

// Historical dataset: years and accident counts
const years = groupedByYear.map((x) => parseInt(x.year));
const accidentCounts = groupedByYear.map((y) => y.count);
// Normalize the years by subtracting the starting year
const baseYear = 2010;
const normalizedYears = years.map((year) => year - baseYear);

// Format the data for regression.js using normalized years
const data = normalizedYears.map((year, index) => [
  year,
  accidentCounts[index],
]);

// Perform polynomial regression (order 2 for quadratic fitting)
const result = regression.polynomial(data, { order: 2 });

// Generate data points for the regression curve
let regressionCurve = [];
const prepareRegressionCurve = (years) => {
  regressionCurve = [];
  for (
    let year = years[0] - baseYear;
    year <= years[years.length - 1] - baseYear;
    year += 0.1
  ) {
    // Use normalized years
    const predicted = result.predict(year);
    regressionCurve.push({ x: year + baseYear, y: predicted[1] }); // Convert back to actual years
  }
};
document.getElementById("predictAccident").addEventListener("click", () => {
  predictAccident();
});

document.getElementById("year").addEventListener("input", function (event) {
  let value = event.target.value.replace(/\D/g, "");
  // Ensure the value is not longer than 4 digits
  if (value.length > 4) {
    value = value.slice(0, 4);
  }
  // Set the sanitized value back to the input field
  event.target.value = value;
});

// Handle prediction button click
async function predictAccident() {
  const year = document.getElementById("year").value - baseYear; // Example time, you can change this or get from input
  if (year == "") {
    return;
  }
  const prediction = result.predict(year);
  console.log("Predicted Accident Probability:", prediction[1]);
  regressionCurve.push({ x: year + baseYear, y: prediction[1] });
  years.push(year + baseYear);
  prepareRegressionCurve(years);
  accidentCounts.push(prediction[1]);
  drawChart(years, regressionCurve);
}

const drawChart = (years, regressionCurve) => {
  // Chart.js setup
  const ctx = document.getElementById("regressionChart").getContext("2d");
  if (chart instanceof Chart) {
    // Destroy the existing chart before creating a new one
    chart.destroy();
  }
  chart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Historical Data",
          data: years.map((year, index) => ({
            x: year,
            y: accidentCounts[index],
          })),
          backgroundColor: "blue",
          pointRadius: 5,
          showLine: false, // Only show scatter points for historical data
        },
        {
          label: "Polynomial Regression Curve",
          data: regressionCurve,
          borderColor: "red",
          borderWidth: 2,
          fill: false,
          showLine: true, // Show a smooth line for the regression curve
          pointRadius: 0, // Hide points on the curve for smoothness
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
      scales: {
        x: {
          title: { display: true, text: "Year" },
          type: "linear",
          position: "bottom",
        },
        y: {
          title: { display: true, text: "Number of Accidents" },
        },
      },
    },
  });
};

const init = () => {
  prepareRegressionCurve(years);
  drawChart(years, regressionCurve);
};

init();
