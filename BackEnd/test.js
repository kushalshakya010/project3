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

function getPolynomialDate(startYear, endYear, power = 2) {
  // const start = new Date(startYear, 0, 1).getTime(); // Jan 1 of startYear
  // const end = new Date(endYear, 11, 31).getTime(); // Dec 31 of endYear

  const start = new Date(2024, 0, 1).getTime(); // Jan 1, 2010
  const end = new Date(2024, 11, 31).getTime(); // Dec 31, 2010
  const range = end - start;

  // Generate a random number with a polynomial distribution.
  const randomFactor = Math.pow(Math.random(), power); // Adjust power for distribution skew.
  const timestamp = start + randomFactor * range;

  return new Date(timestamp).toISOString(); // Convert to ISO format
}

let generatedData = {};
let total = 40;
exports.runTest = async () => {
  for (let i = 0; i < total; i++) {
    const licenseNumber = 2000 + i;
    const location = locations[Math.floor(Math.random() * locations.length)];
    // const location = "newroad";
    const offenseDetails =
      offenses[Math.floor(Math.random() * offenses.length)];
    const fine = (Math.floor(Math.random() * 10) + 1) * 500;
    const createdAt = getPolynomialDate(2010, 2010, 2);

    generatedData = {
      licenseNumber: licenseNumber,
      offenseDetails: offenseDetails,
      fine: fine,
      location: location,
      contactNumber: String(licenseNumber),
      email: "kushalshakya020@gmail.com",
      createdAt,
      paidStatus: i < total / 3 ? "Unpaid" : "Paid",
      // paidStatus: "Paid",
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

// async function deleteDataBefore2010() {
//   try {
//     // Define the cutoff date as January 1, 2010
//     const cutoffDate = new Date(2010, 0, 1);

//     // Use deleteMany to remove records with createdAt before the cutoff date
//     const result = await Offense.deleteMany({ createdAt: { $lt: cutoffDate } });
//     console.log(cutoffDate);

//     console.log(`Deleted ${result.deletedCount} records created before 2010.`);
//   } catch (error) {
//     console.error("Error deleting records:", error);
//   }
// }

//deleteDataBefore2010();
