const express = require('express');
const router = express.Router();
const offenseController = require('../controllers/offenseController');

router.post('/', offenseController.createOffense);
router.get('/', offenseController.getOffenses);

module.exports = router;
