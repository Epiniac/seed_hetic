const express = require('express');
const plantController = require('../controllers/plantController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', plantController.getUserPlants);
router.get('/:id', plantController.getPlant);
router.post('/', plantController.addPlant);
router.put('/:id', plantController.updatePlant);
router.delete('/:id', plantController.deletePlant);
router.patch('/:id/stats', plantController.updatePlantStats);

module.exports = router;