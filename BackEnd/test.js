const Offense = require("../BackEnd/models/Offense");

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

const offenses = [
  "overspeeding",
  "signal violation",
  "illegal parking",
  "drunk driving",
  "lane violation",
  "no seatbelt",
  "expired license",
  "using mobile while driving",
  "unauthorized horn use",
  "overloading",
];

function getRandomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1).getTime(); // Jan 1 of startYear
  const end = new Date(endYear, 11, 31).getTime(); // Dec 31 of endYear
  const randomTimestamp = start + Math.random() * (end - start);
  return new Date(randomTimestamp).toISOString(); // Convert to ISO format
}

let generatedData = {};
let total = 5;
exports.runTest = async () => {
  for (let i = 0; i < total; i++) {
    const licenseNumber = 2000 + i;
    const location = locations[Math.floor(Math.random() * locations.length)];
    const offenseDetails =
      offenses[Math.floor(Math.random() * offenses.length)];
    const fine = (Math.floor(Math.random() * 10) + 1) * 500;
    const createdAt = getRandomDate(2010, 2024);

    generatedData = {
      licenseNumber: licenseNumber,
      offenseDetails: offenseDetails,
      fine: fine,
      location: location,
      contactNumber: String(licenseNumber),
      email: "kushalshakya020@gmail.com",
      createdAt,
      paidStatus: i < total / 3 ? "Unpaid" : "Paid",
    };

    try {
      const offense = new Offense(generatedData);
      await offense.save();
      console.log("saved: " + i);
    } catch (err) {
      console.log(err);
    }
  }
};
