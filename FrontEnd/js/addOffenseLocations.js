// const locations = [
//   "newroad",
//   "baneshwor",
//   "lainchaur",
//   "lazimpat",
//   "thamel",
//   "balaju",
//   "baluwatar",
//   "dillibazar",
//   "bagbazar",
//   "tripureshwar",
//   "nayabazar",
//   "naxal",
//   "hadigaun",
//   "koteshwor",

//   "ekantakuna",
//   "kumaripati",
//   "sankhamul",
//   "pulchwok",
//   "lagankhael",
//   "jaulakhel",
//   "kupondole",
//   "sanepa",
//   "teku",
// ];

// const dropDownOptions = locations.map((location, index) => ({
//   value: index,
//   text: location,
// }));

// let selectedLocation = "";

// const test = new TomSelect("#dropdown-input", {
//   plugins: ["dropdown_input"],
//   options: dropDownOptions,
//   onChange: (value) => {
//     selectedLocation = dropDownOptions[value].text;
//   },
// });

// document
//   ?.getElementById("add-offense-form")
//   ?.addEventListener("submit", function (event) {
//     event.preventDefault();

//     const licenseNumber = document.getElementById("license-number").value;
//     const offenseDetails = document.getElementById("offense-details").value;
//     const fine = document.getElementById("fine").value;
//     const contactNumber = document.getElementById("contact-number").value;
//     const email = document.getElementById("email").value;
//     const location = selectedLocation;

//     // Simulate sending data to the backend via AJAX
//     fetch("http://localhost:3000/api/offenses/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         licenseNumber: licenseNumber,
//         offenseDetails: offenseDetails,
//         fine: fine,
//         location: location,
//         contactNumber: contactNumber,
//         email: email,
//       }),
//     })
//       .then((res) => res.json())
//       .then((existData) => {
//         if (existData) {
//           alert(existData.message);
//           window.location.href = "dashboard.html";
//           console.log(existData);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         alert("Error");
//       });
//   });

const locations = [
  "newroad",
  "baneshwor",
  "lainchaur",
  "lazimpat",
  "thamel",
  "balaju",
  "baluwatar",
  "dillibazar",
  "bagbazar",
  "tripureshwar",
  "nayabazar",
  "naxal",
  "hadigaun",
  "koteshwor",
  "ekantakuna",
  "kumaripati",
  "sankhamul",
  "pulchwok",
  "lagankhael",
  "jaulakhel",
  "kupondole",
  "sanepa",
  "teku",
];

const dropDownOptions = locations.map((location, index) => ({
  value: index,
  text: location,
}));

let selectedLocation = "";

const test = new TomSelect("#dropdown-input", {
  plugins: ["dropdown_input"],
  options: dropDownOptions,
  create: false, // Disables the ability to type custom values
  onChange: (value) => {
    selectedLocation = dropDownOptions[value]?.text || "";
  },
});

document
  ?.getElementById("add-offense-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    const licenseNumber = document.getElementById("license-number").value;
    const offenseDetails = document.getElementById("offense-details").value;
    const fine = document.getElementById("fine").value;
    const contactNumber = document.getElementById("contact-number").value;
    const email = document.getElementById("email").value;
    const location = selectedLocation;

    // Simulate sending data to the backend via AJAX
    fetch("http://localhost:3000/api/offenses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        licenseNumber: licenseNumber,
        offenseDetails: offenseDetails,
        fine: fine,
        location: location,
        contactNumber: contactNumber,
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((existData) => {
        if (existData) {
          alert(existData.message);
          window.location.href = "dashboard.html";
          console.log(existData);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Error");
      });
  });
