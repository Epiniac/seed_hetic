const Plant = require('../models/Plant');
// const PlantCatalog = require('../models/PlantCatalog');
const Notification = require('../models/Notification');

const plantController = {
  // Récupérer toutes les plantes de l'utilisateur
  getUserPlants: async (req, res) => {
    try {
      const { category, status, search } = req.query;
      let query = { owner: req.user.id };

      // Filtres
      if (category) query.category = category;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { species: { $regex: search, $options: 'i' } }
        ];
      }

      const plants = await Plant.find(query).sort({ createdAt: -1 });
      res.json(plants);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Récupérer une plante spécifique
  getPlant: async (req, res) => {
    try {
      const plant = await Plant.findOne({ 
        _id: req.params.id, 
        owner: req.user.id 
      });

      if (!plant) {
        return res.status(404).json({ message: 'Plante non trouvée' });
      }

      res.json(plant);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Ajouter une nouvelle plante
  addPlant: async (req, res) => {
    try {
      const plantData = {
        ...req.body,
        owner: req.user.id
      };

      const plant = new Plant(plantData);
      await plant.save();

      res.status(201).json({
        message: 'Plante ajoutée avec succès',
        plant
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour une plante
  updatePlant: async (req, res) => {
    try {
      const plant = await Plant.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!plant) {
        return res.status(404).json({ message: 'Plante non trouvée' });
      }

      res.json({
        message: 'Plante mise à jour avec succès',
        plant
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Supprimer une plante
  deletePlant: async (req, res) => {
    try {
      const plant = await Plant.findOneAndDelete({ 
        _id: req.params.id, 
        owner: req.user.id 
      });

      if (!plant) {
        return res.status(404).json({ message: 'Plante non trouvée' });
      }

      // Supprimer les notifications liées
      await Notification.deleteMany({ plant: req.params.id });

      res.json({ message: 'Plante supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour les statistiques d'une plante
  updatePlantStats: async (req, res) => {
    try {
      const { temperature, humidity, soilMoisture, lightLevel } = req.body;
      
      const updateData = {
        'currentStats.temperature': temperature && {
          ...temperature,
          lastUpdated: new Date()
        },
        'currentStats.humidity': humidity && {
          ...humidity,
          lastUpdated: new Date()
        },
      };

      // Enlever les propriétés undefined
      Object.keys(updateData).forEach(key => {
        if (!updateData[key]) delete updateData[key];
      });

      const plant = await Plant.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.id },
        updateData,
        { new: true }
      );

      if (!plant) {
        return res.status(404).json({ message: 'Plante non trouvée' });
      }

      // Vérifier si des alertes doivent être créées
      await checkPlantAlerts(plant);

      res.json({
        message: 'Statistiques mises à jour avec succès',
        plant
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },
};

// Fonction pour vérifier les alertes
async function checkPlantAlerts(plant) {
  const alerts = [];

  // Vérifier l'humidité du sol
  if (plant.currentStats.soilMoisture && plant.currentStats.soilMoisture.value < 30) {
    alerts.push({
      type: 'watering',
      title: 'Plante déshydratée',
      message: `Votre ${plant.name} a besoin d'eau. Humidité du sol: ${plant.currentStats.soilMoisture.value}%`,
      priority: 'high'
    });
  }

  // Vérifier la température
  if (plant.currentStats.temperature && plant.careInstructions.temperature) {
    const temp = plant.currentStats.temperature.value;
    const { min, max } = plant.careInstructions.temperature;
    
    if (temp < min || temp > max) {
      alerts.push({
        type: 'temperature',
        title: 'Température inadéquate',
        message: `La température de ${plant.name} est de ${temp}°C. Plage recommandée: ${min}-${max}°C`,
        priority: 'medium'
      });
    }
  }

  // Créer les notifications
  for (const alert of alerts) {
    await Notification.create({
      user: plant.owner,
      plant: plant._id,
      ...alert
    });
  }

  // Mettre à jour le statut de la plante
  if (alerts.length > 0) {
    const hasHighPriority = alerts.some(alert => alert.priority === 'high');
    plant.status = hasHighPriority ? 'critical' : 'needs-attention';
    await plant.save();
  }
}

module.exports = plantController;
