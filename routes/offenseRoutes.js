const express = require('express');
const Offense = require('../models/Offense'); // Import Offense model
const { createOffense, getAllOffenses, updateOffense, deleteOffense } = require('../controllers/offenseController');
const router = express.Router();

// Create a new offense
router.post('/',createOffense );

// Get all offenses
router.get('/', getAllOffenses );

// Update an offense by ID
router.put('/:id', updateOffense);

// Delete an offense by ID
router.delete('/:id',deleteOffense );

module.exports = router;
