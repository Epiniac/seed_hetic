const express = require('express');
const router = express.Router();
const plantAnalysisController = require('../controllers/plantAnalysisController');

// Route pour analyser une plante
router.post('/analyze', plantAnalysisController.analyzePlant);

module.exports = router;