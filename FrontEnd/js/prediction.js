import { getAllOffenses } from "./api.js";

const offenses = await getAllOffenses();
let model;
let chart;

let groupedByYear = Object.entries(
  offenses.reduce((acc, obj) => {
    const year = new Date(obj.createdAt).getFullYear(); // Extract the year
    acc[year] = (acc[year] || 0) + 1; // Increment the count for the year
    return acc;
  }, {})
).map(([year, count]) => ({ year, count })); // Convert to desired array format

// Build and train the model
async function createAndTrainModel() {
  const years = groupedByYear.map((x) => parseInt(x.year));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const normalizedYears = years.map(
    (year) => (year - minYear) / (maxYear - minYear)
  );
  const accidents = groupedByYear.map((y) => y.count);
  console.log(accidents);
  model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 1,
      inputShape: [1],
      kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
      activation: "relu",
    })
  ); // 1 for time, 3 for location, 3 for offense
  // Hidden layer with 16 neurons
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));

  // Another hidden layer with 8 neurons
  model.add(tf.layers.dense({ units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "relu" }));

  // model.compile({ optimizer: "sgd", loss: "meanSquaredError" });
  model.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });

  const xs = tf.tensor1d([...normalizedYears]);
  console.log(xs.print());
  const ys = tf.tensor1d([...accidents]);
  console.log(ys.print());

  await model.fit(xs, ys, {
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        // console.log(`Epoch: ${epoch}, Loss: ${logs.loss}`);
      },
    },
  });
  console.log("Model trained");
  const savedWeights = JSON.parse(localStorage.getItem("modelWeights"));
  const weights = model.getWeights();
  const weightsArray = JSON.stringify(weights.map((w) => w.arraySync()));
  // console.log(weightsArray);
  if (!savedWeights) {
    localStorage.setItem(
      "modelWeights",
      JSON.stringify(weights.map((w) => w.arraySync()))
    );
    return;
  }

  model.setWeights(savedWeights.map((w) => tf.tensor(w)));
}

// Make a prediction based on input data
async function makePrediction(year) {
  const years = groupedByYear.map((x) => parseInt(x.year));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const normalizedYear = (year - minYear) / (maxYear - minYear);
  const prediction = model
    .predict(tf.tensor2d([normalizedYear], [1, 1]))
    .arraySync()[0][0];
  console.log(prediction);
  const accidents = groupedByYear.map((y) => y.count);
  const minCount = Math.min(...accidents);
  const maxCount = Math.max(...accidents);
  const originalPrediction = prediction * (maxCount - minCount) + minCount;

  return { year, prediction: originalPrediction };
}

async function renderYearlyAccidentsGraph(prediction) {
  const { year: predictedYear, prediction: predictedAccidents } = prediction;

  const years = groupedByYear.map((data) => data.year);
  const totalAccidents = groupedByYear.map((data) => data.count);

  // Add prediction
  years.push(predictedYear);
  totalAccidents.push(predictedAccidents);

  console.log({ years, totalAccidents });

  // Chart.js Graph
  const ctx = document.getElementById("predictionChart").getContext("2d");
  if (chart instanceof Chart) {
    // Destroy the existing chart before creating a new one
    chart.destroy();
  }
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: years,
      datasets: [
        {
          label: "Total Accidents",
          data: totalAccidents,
          backgroundColor: years.map((year) =>
            year === predictedYear
              ? "rgba(255, 99, 132, 0.5)"
              : "rgba(54, 162, 235, 0.5)"
          ),
          borderColor: years.map((year) =>
            year === predictedYear
              ? "rgba(255, 99, 132, 1)"
              : "rgba(54, 162, 235, 1)"
          ),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Yearly Accidents and Predicted Probability",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Handle prediction button click
async function predictAccident() {
  const year = document.getElementById("year").value; // Example time, you can change this or get from input
  if (year == "") {
    return;
  }
  const prediction = await makePrediction(year);
  console.log("Predicted Accident Probability:", prediction);
  renderYearlyAccidentsGraph(prediction);
}

// Initialize the model and chart when the page loads
async function init() {
  await createAndTrainModel();
}

init();

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

// Initialize the Leaflet map
// const map = L.map("map").setView([27.7172, 85.324], 12); // Kathmandu coordinates
const map = L.map("map", {
  center: [27.7172, 85.324],
  zoom: 10,
  maxZoom: 14.5,
  minZoom: 13,
}); // Kathmandu coordinates

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 14.5,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

const test = [
  [27.705, 85.3098, .3], //newroad
  [27.690, 85.3350, .5], //baneshwor
  [27.7196, 85.3176, .3], //lainchaur
  [27.7261, 85.3206, .7], //lazimpat
  [27.7159, 85.312, .8], //thamel
  [27.7333, 85.3004, .9], //balaju
  [27.7318, 85.3312, .2], //baluwatar
  [27.7067, 85.3280, .4], //dillibazar
  [27.7067, 85.3204, .6], //bagbazar
  [27.692, 85.3173, .9], //tripureshwar
  [27.7202, 85.3101, .8], //nayabazar
  [27.7151, 85.3336, .9], //naxal
  [27.7224, 85.3392, .5], //hadigaun
  [27.6800, 85.3488, .3], //koteshwor
  [27.6679, 85.309, .5], //ekantakuna
  [27.6720, 85.3192, .4], //kumaripati
  [27.6856, 85.3344, .8], //sankhamul
  [27.6785, 85.3155, .7], //pulchwok
  [27.6676, 85.3221, .9], //lagankhael
  [27.6716, 85.3111, .5], //jaulakhel
  [27.6842, 85.3186, .7], //kupondole
  [27.6835, 85.3058, .3], //sanepa
  [27.6985, 85.3055, .8], //teku
];

const heat = L.heatLayer(test, {
  maxZoom: 10,
  radius: 25,
  minOpacity: 0.3,
  gradient: { 0.4: "blue", 0.65: "lime", 1: "red" },
}).addTo(map);

const address_intensity = (offenses) => {
  const result_object = {};

  offenses.forEach(function (offense) {
    // Dynamically normalize the address
    const normalizedAddress = Object.keys(result_object).find((key) =>
      offense.location.toLowerCase().split(" ")[0].includes(key.split(" ")[0])
    );
    if (!normalizedAddress) {
      result_object[offense.location.toLowerCase()] =
        (result_object[offense.location] || 0) + 1;
      return;
    }
    result_object[normalizedAddress] =
      (result_object[normalizedAddress] || 0) + 1;
  });

  // Convert the result_object into an array of objects
  const result_arr = Object.keys(result_object).map((key) => {
    return { [key]: result_object[key] };
  });

  return result_arr;
};

const intensity_address = address_intensity(offenses);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const latAndLongAndCount = async (intensity_address) => {
  const result_array = [];

  //----------------------------------------------------------------------------------------geo location api to retrive lat, lon--------------
  intensity_address.forEach(async function (obj) {
    const [[address, count]] = Object.entries(obj);
    const storedAddress = JSON.parse(localStorage.getItem(address));
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address + ", Kathmandu Nepal"
    )}&format=json`;
    if (storedAddress) {
      result_array.push([
        storedAddress.address,
        storedAddress.lat,
        storedAddress.lon,
        count,
      ]);
      return;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length == 0) {
          return;
        }
        result_array.push([address, data[0].lat, data[0].lon, count]);
        localStorage.setItem(
          address,
          JSON.stringify({ address, lat: data[0].lat, lon: data[0].lon })
        );
      })
      .catch((error) => {
        console.error(error);
      });

    await delay(10000);
  });
  return result_array;
};

// const heatMapLocations = await latAndLongAndCount(intensity_address);
// console.log(heatMapLocations);
