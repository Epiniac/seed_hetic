const express = require('express');
const plantController = require('../controllers/plantController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes CRUD pour les plantes
router.get('/', plantController.getUserPlants);
router.get('/:id', plantController.getPlant);
router.post('/', plantController.addPlant);
router.put('/:id', plantController.updatePlant);
router.delete('/:id', plantController.deletePlant);
router.patch('/:id/stats', plantController.updatePlantStats);

module.exports = router;