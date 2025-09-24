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
  try {
    const alerts = [];

    // Vérifier l'humidité du sol ou l'humidité générale
    // Vérifier la humiérature
    if (plant.currentStats.humidity && 
        plant.careInstructions && 
        plant.careInstructions.humidity) {
      const humi = plant.currentStats.humidity.value;
      const { min, max } = plant.careInstructions.humidity;
      
      if (min && max && (humi < min || humi > max)) {
        let humiMessage;
        let humiTitle;
        let humiPriority = 'élevé';
        
        if (humi < min) {
          const messages = [
            `Votre ${plant.name} a soif ! L'humidité est à (${humi}°C). La plage recommandée : ${min}%.`,
            `Attention : votre ${plant.name} montre des signes deshydratation : ${humi}°C, minimum requis : ${min}°C.`,
            `Alerte arrosage ! Votre ${plant.name} a besoin d'eau. Humidité critique : ${humi}%.`
          ];
          
          const titles = [
            'Votre plante a besoin d\'eau immédiatement',
            'Niveau d\'hydratation critique détecté',
            'Arrosage urgent requis pour votre plante'
          ];
          
          humiMessage = messages[Math.floor(Math.random() * messages.length)];
          humiTitle = titles[Math.floor(Math.random() * titles.length)];
        } else {
          const messages = [
            `Humidité trop élevée pour votre ${plant.name} (${humi}%) ! Maximum recommandée :${max}°C.`,
            `Attention ! Votre ${plant.name} souffre d'excès d'humidité (${humi})°C. Maximum recommandé : ${max}°C.`,
            `${plant.name} risque la maladie à ${humi}°C.`
          ];
          
          const titles = [
            'Humidité excessive détectée',
            'Votre plante souffre d\'excès d\'humidité',
            'Risque de moisissure pour votre plante'
          ];
          
          humiMessage = messages[Math.floor(Math.random() * messages.length)];
          humiTitle = titles[Math.floor(Math.random() * titles.length)];
        }
        
        alerts.push({
          type: 'humidity',
          title: humiTitle,
          message: humiMessage,
          priority: humiPriority,
          actionRequired: true
        });
      }
    }

    // Vérifier la température
    if (plant.currentStats.temperature && 
        plant.careInstructions && 
        plant.careInstructions.temperature) {
      const temp = plant.currentStats.temperature.value;
      const { min, max } = plant.careInstructions.temperature;
      
      if (min && max && (temp < min || temp > max)) {
        let tempMessage;
        let tempTitle;
        let tempPriority = 'élevé';
        
        if (temp < min) {
          const messages = [
            `Il fait trop froid pour votre ${plant.name} (${temp}°C). Température recommandée : ${min}-${max}°C.`,
            `Votre ${plant.name} a froid ! Température actuelle : ${temp}°C, minimum requis : ${min}°C.`,
            `${plant.name} risque de souffrir à ${temp}°C. Rapprochez-la d'une source de chaleur.`
          ];
          
          const titles = [
            'Température trop basse pour votre plante',
            'Risque de gel détecté dans l\'environnement',
            'Votre plante souffre du froid ambiant'
          ];
          
          tempMessage = messages[Math.floor(Math.random() * messages.length)];
          tempTitle = titles[Math.floor(Math.random() * titles.length)];
        } else {
          const messages = [
            `Il fait trop chaud pour votre ${plant.name} (${temp}°C) ! Température recommandée : ${min}-${max}°C.`,
            `Attention canicule ! Votre ${plant.name} souffre à ${temp}°C. Maximum recommandé : ${max}°C.`,
            `${plant.name} risque la surchauffe à ${temp}°C. Trouvez-lui un endroit plus frais.`
          ];
          
          const titles = [
            'Température excessive détectée dans la zone',
            'Votre plante souffre de la chaleur',
            'Surchauffe dangereuse pour votre plante'
          ];
          
          tempMessage = messages[Math.floor(Math.random() * messages.length)];
          tempTitle = titles[Math.floor(Math.random() * titles.length)];
        }
        
        alerts.push({
          type: 'temperature',
          title: tempTitle,
          message: tempMessage,
          priority: tempPriority,
          actionRequired: true
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
      const hasHighPriority = alerts.some(alert => alert.priority === 'élevé');
      plant.status = hasHighPriority ? 'critique' : 'besoin attention';
      await plant.save();
    } else {
      // Si pas d'alertes, remettre en bonne santé
      plant.status = 'bonne sante';
      await plant.save();
    }
  } catch (error) {
    console.error('Erreur dans checkPlantAlerts:', error);
    // Ne pas faire planter le processus principal
  }
}

module.exports = plantController;
