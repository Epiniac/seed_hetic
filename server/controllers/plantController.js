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

      // Ajouter des valeurs par défaut pour careInstructions si vides
      if (!plantData.careInstructions || Object.keys(plantData.careInstructions).length === 0) {
        plantData.careInstructions = {
          watering: {
            frequency: 'hebdomadaire',
            amount: 'modérée'
          },
          temperature: {
            min: 15,
            max: 30,
            optimal: 22
          },
          humidity: {
            min: 40,
            max: 70,
            optimal: 55
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
      
      const updateData = {};
      
      // Ajouter température si fournie
      if (temperature) {
        updateData['currentStats.temperature'] = {
          ...temperature,
          lastUpdated: new Date()
        };
      }
      
      // Ajouter humidité si fournie
      if (humidity) {
        updateData['currentStats.humidity'] = {
          ...humidity,
          lastUpdated: new Date()
        };
      }
      
      // Ajouter humidité du sol si fournie
      if (soilMoisture) {
        updateData['currentStats.soilMoisture'] = {
          ...soilMoisture,
          lastUpdated: new Date()
        };
      }
      
      // Ajouter niveau de lumière si fourni
      if (lightLevel) {
        updateData['currentStats.lightLevel'] = {
          ...lightLevel,
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

      // S'assurer que la plante a des careInstructions par défaut
      if (!plant.careInstructions || Object.keys(plant.careInstructions).length === 0) {
        plant.careInstructions = {
          watering: {
            frequency: 'hebdomadaire',
            amount: 'modérée'
          },
          temperature: {
            min: 15,
            max: 30,
            optimal: 22
          },
          humidity: {
            min: 40,
            max: 70,
            optimal: 55
          }
        };
        await plant.save();
      }

      // Vérifier si des alertes doivent être créées
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

// Fonction pour vérifier les alertes
async function checkPlantAlerts(plant) {
  try {
    const alerts = [];

    // Vérifier l'humidité du sol ou l'humidité générale
    const humidity = plant.currentStats.soilMoisture || plant.currentStats.humidity;
    if (humidity && humidity.unit < 30) {
      const messages = [
        `Votre ${plant.name} a soif ! L'humidité est à ${humidity.unit}%. Il est temps d'arroser.`,
        `Attention : ${plant.name} montre des signes de déshydratation (${humidity.unit}% d'humidité).`,
        `Alerte arrosage ! Votre ${plant.name} a besoin d'eau urgente. Humidité critique : ${humidity.unit}%.`
      ];
      
      const titles = [
        'Votre plante a besoin d\'eau immédiatement',
        'Niveau d\'hydratation critique détecté',
        'Arrosage urgent requis pour votre plante'
      ];
      
      alerts.push({
        type: 'arrosage',
        title: titles[Math.floor(Math.random() * titles.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        priority: 'élevé',
        actionRequired: true
      });
    } else if (humidity && humidity.unit < 50) {
      // Notification préventive pour humidité modérément basse
      const titles = [
        'Surveillance du niveau d\'hydratation',
        'Préparation d\'arrosage recommandée',
        'Attention au niveau d\'humidité'
      ];
      
      alerts.push({
        type: 'arrosage',
        title: titles[Math.floor(Math.random() * titles.length)],
        message: `Votre ${plant.name} pourrait bientôt avoir besoin d'eau. Humidité actuelle : ${humidity.unit}%.`,
        priority: 'moyen',
        actionRequired: false
      });
    }

    // Vérifier la température
    if (plant.currentStats.temperature && 
        plant.careInstructions && 
        plant.careInstructions.temperature) {
      const temp = plant.currentStats.temperature.unit;
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

    // Ajouter des notifications de bien-être général
    if (alerts.length === 0) {
      // Parfois ajouter des conseils positifs
      const shouldAddTip = Math.random() < 0.3; // 30% de chance
      if (shouldAddTip) {
        const hour = new Date().getHours();
        let wellnessTips;
        
        // Messages selon l'heure de la journée
        if (hour >= 6 && hour < 12) {
          wellnessTips = [
            `� Bonjour ! Votre ${plant.name} démarre bien la journée !`,
            `☀️ Belle matinée pour ${plant.name} ! Elle profite de la lumière douce.`,
            `🌱 Votre ${plant.name} semble radieuse ce matin ! Parfait pour commencer la journée.`
          ];
        } else if (hour >= 12 && hour < 18) {
          wellnessTips = [
            `🌞 Votre ${plant.name} se prélasse dans l'après-midi ! Tout va bien.`,
            `💚 ${plant.name} est au top de sa forme aujourd'hui !`,
            `🍃 Astuce après-midi : Votre ${plant.name} adore cette lumière naturelle.`
          ];
        } else {
          wellnessTips = [
            `🌙 Bonne soirée ! ${plant.name} se repose tranquillement.`,
            `✨ Votre ${plant.name} termine sa journée en beauté !`,
            `🌟 ${plant.name} vous souhaite une bonne nuit ! Tout est parfait.`
          ];
        }
        
        alerts.push({
          type: 'generale',
          title: 'Votre plante est en excellente santé',
          message: wellnessTips[Math.floor(Math.random() * wellnessTips.length)],
          priority: 'faible',
          actionRequired: false
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
    plant.status = hasHighPriority ? 'critique' : 'besoin attention';
    await plant.save();
  }
  } catch (error) {
    console.error('Erreur lors de la vérification des alertes:', error);
  }
}

module.exports = plantController;
