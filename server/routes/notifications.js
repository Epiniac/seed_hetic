const express = require('express');
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);

module.exports = router;