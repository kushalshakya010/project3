const express = require("express");
const router = express.Router();
const offenseController = require("../controllers/offenseController");

// Route to get offenses for a user
router.get("/offenses/:licenseNumber", offenseController.getUserOffenses);

// Route to pay for an offense
router.post("/pay", offenseController.payOffense);

module.exports = router;
