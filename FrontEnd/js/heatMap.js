import { getAllOffenses } from "./api.js";

const offenses = await getAllOffenses();
let model;
let chart;

// Initialize the Leaflet map
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
console.log(intensity_address);
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
        // storedAddress.address,
        storedAddress.lat,
        storedAddress.lon,
        scaledValue(count),
      ]);
      return;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length == 0) {
          return;
        }
        result_array.push([
          // address,
          data[0].lat,
          data[0].lon,
          scaledValue(count),
        ]);
        localStorage.setItem(
          address,
          JSON.stringify({ address, lat: data[0].lat, lon: data[0].lon })
        );
      })
      .catch((error) => {
        console.error(error);
      });

    await delay(100000);
  });
  return result_array;
};

//this calls api-----------------------------------------------------------------off this for local storage(delete all data first)
const heatMapLocations = await latAndLongAndCount(intensity_address);
console.log(heatMapLocations);

const test = [
  [27.705, 85.3098, 0.3], //newroad
  [27.69, 85.335, 0.5], //baneshwor
  [27.7196, 85.3176, 0.3], //lainchaur
  [27.7261, 85.3206, 0.7], //lazimpat
  [27.7159, 85.312, 0.8], //thamel
  [27.7333, 85.3004, 0.9], //balaju
  [27.7318, 85.3312, 0.2], //baluwatar
  [27.7067, 85.328, 0.4], //dillibazar
  [27.7067, 85.3204, 0.6], //bagbazar
  [27.692, 85.3173, 0.9], //tripureshwar
  [27.7202, 85.3101, 0.8], //nayabazar
  [27.7151, 85.3336, 0.9], //naxal
  [27.7224, 85.3392, 0.5], //hadigaun
  [27.68, 85.3488, 0.3], //koteshwor
  [27.6679, 85.309, 0.5], //ekantakuna
  [27.672, 85.3192, 0.4], //kumaripati
  [27.6856, 85.3344, 0.8], //sankhamul
  [27.6785, 85.3155, 0.7], //pulchwok
  [27.6676, 85.3221, 0.9], //lagankhael
  [27.6716, 85.3111, 0.5], //jaulakhel
  [27.6842, 85.3186, 0.7], //kupondole
  [27.6835, 85.3058, 0.3], //sanepa
  [27.6985, 85.3055, 0.8], //teku
];

//comment this for local storage launch for a while----------------------------------
const heat = L.heatLayer(heatMapLocations, {
  maxZoom: 10,
  radius: 25,
  minOpacity: 0.3,
  gradient: { 0.25: "blue", 0.5: "lime", 0.75: "orange", 1: "red" },
  // gradient: { 0.7: "blue", 0.9: "lime", 1: "red" },
}).addTo(map);

// storing lat and lon in local storage for caching
const cacheGeoLocation = intensity_address.map((obj, index) => {
  const [[address, count]] = Object.entries(obj);
  localStorage.setItem(
    address,
    JSON.stringify({ address, lat: test[index][0], lon: test[index][1] })
  );
});

function scaledValue(count) {
  let heighestCount = 0;
  intensity_address.forEach(function (obj) {
    const [[address, count]] = Object.entries(obj);
    heighestCount = Math.max(heighestCount, count);
  });
  return count / heighestCount;
}
