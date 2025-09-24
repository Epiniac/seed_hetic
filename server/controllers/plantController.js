const Plant = require('../models/Plant');
// const PlantCatalog = require('../models/PlantCatalog');
const Notification = require('../models/Notification');

const plantController = {

  getUserPlants: async (req, res) => {
    try {
      const { category, status, search } = req.query;
      let query = { owner: req.user.id };

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

  addPlant: async (req, res) => {
    try {
      const plantData = {
        ...req.body,
        owner: req.user.id
      };

      if (!plantData.careInstructions || Object.keys(plantData.careInstructions).length === 0) {
        plantData.careInstructions = {
          watering: {
            frequency: 'rajouter',
            amount: 'rajouter'
          },
          temperature: {
            min: 0,
            max: 0,
            optimal: 0
          },
          humidity: {
            min: 0,
            max: 0,
            optimal: 0
          }
        };
      }

      const plant = new Plant(plantData);
      await plant.save();

      res.status(201).json({
        message: 'Plante ajoutée avec succès',
        plant
      });
    } catch (error) {
      console.error('Erreur addPlant:', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

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

  deletePlant: async (req, res) => {
    try {
      const plant = await Plant.findOneAndDelete({ 
        _id: req.params.id, 
        owner: req.user.id 
      });

      if (!plant) {
        return res.status(404).json({ message: 'Plante non trouvée' });
      }

      await Notification.deleteMany({ plant: req.params.id });

      res.json({ message: 'Plante supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

 
  updatePlantStats: async (req, res) => {
    try {
      const { temperature, humidity, soilMoisture, lightLevel } = req.body;
      
      const updateData = {};
   
      if (temperature) {
        updateData['currentStats.temperature'] = {
          ...temperature,
          lastUpdated: new Date()
        };
      }
      
      if (humidity) {
        updateData['currentStats.humidity'] = {
          ...humidity,
          lastUpdated: new Date()
        };
      }

      let plant = await Plant.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.id },
        updateData,
        { new: true }
      );

      if (!plant) {
        return res.status(404).json({ message: 'Plante non trouvée' });
      }

      if (!plant.careInstructions || Object.keys(plant.careInstructions).length === 0) {
        plant.careInstructions = {
          watering: {
            frequency: 'rajouter',
            amount: 'rajouter'
          },
          temperature: {
            min: 0,
            max: 0,
            optimal: 0
          },
          humidity: {
            min: 0,
            max: 0,
            optimal: 0
          }
        };
        await plant.save();
      }

      await checkPlantAlerts(plant);

      res.json({
        message: 'Statistiques mises à jour avec succès',
        plant
      });
    } catch (error) {
      console.error('Erreur updatePlantStats:', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },
};

async function checkPlantAlerts(plant) {
  const alerts = [];

  if (plant.currentStats.temperature && plant.careInstructions.temperature) {
    const temp = plant.currentStats.temperature.value;
    const { min, max } = plant.careInstructions.temperature;
    
    if (temp < min || temp > max) {
      alerts.push({
        type: 'Temperature',
        title: 'Température inadéquate',
        message: `La température de la plante ${plant.name} est de ${temp}°C. La plage recommandée: ${min}-${max}°C`,
      });
    }
  }

  if (plant.currentStats.humidity && plant.careInstructions.humidity) {
    const currentHumidity = plant.currentStats.humidity.value;
    const { min: minHumidity, max: maxHumidity } = plant.careInstructions.humidity;
    
    if (currentHumidity < minHumidity || currentHumidity > maxHumidity) {
      alerts.push({
        type: 'Humidité',
        title: 'Humidité',
        message: `L'humidité de la plante ${plant.name} est de ${currentHumidity}%. La plage recommandée: ${minHumidity}-${maxHumidity}%`,
      });
    }
  }

  for (const alert of alerts) {
    try {
      await Notification.create({
        user: plant.owner,
        plant: plant._id,
        type: alert.type,
        title: alert.title,
        message: alert.message,
        actionRequired: true 
      });
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  }

  if (alerts.length > 0) {
    const hasCriticalAlert = alerts.some(alert => 
      alert.type === 'Humidité' || 
      (alert.type === 'Temperature' && plant.currentStats.temperature && 
       (plant.currentStats.temperature.value < 0 || plant.currentStats.temperature.value > 30))
    );
    
    plant.status = hasCriticalAlert ? 'critical' : 'needs-attention';
    
    try {
      await plant.save();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la plante:', error);
    }
  } else {
    plant.status = 'healthy';
    try {
      await plant.save();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la plante:', error);
    }
  }
  
  return alerts;
}

module.exports = plantController;
