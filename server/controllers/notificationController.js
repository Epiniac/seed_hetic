const Notification = require('../models/Notification');

const notificationController = {
  // Récupérer toutes les notifications de l'utilisateur
  getNotifications: async (req, res) => {
    try {
      const { unreadOnly } = req.query;
      let query = { user: req.user.id };
      
      if (unreadOnly === 'true') {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .populate('plant', 'name species')
        .sort({ createdAt: -1 })
        .limit(50);

      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (req, res) => {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: 'Notification non trouvée' });
      }

      res.json({ message: 'Notification marquée comme lue' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async (req, res) => {
    try {
      await Notification.updateMany(
        { user: req.user.id, isRead: false },
        { isRead: true }
      );

      res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = notificationController;