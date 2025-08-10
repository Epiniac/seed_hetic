const cron = require('node-cron');
const Plant = require('../models/Plant');
const Notification = require('../models/Notification');

// Vérifier les plantes qui ont besoin d'attention chaque jour à 8h
cron.schedule('0 8 * * *', async () => {
  try {
    console.log('Vérification quotidienne des plantes...');
    
    const plants = await Plant.find({}).populate('owner');
    
    for (const plant of plants) {
      // Vérifier l'humidité
      if (plant.currentStats?.humidity?.value && plant.careInstructions?.humidity?.optimal) {
        const currentHumidity = plant.currentStats.humidity.value;
        const optimalHumidity = plant.careInstructions.humidity.optimal;
        const humidityDifference = Math.abs(currentHumidity - optimalHumidity);
        const humidityTolerance = 10; // Tolérance par défaut de 10%
        
        if (humidityDifference > humidityTolerance) {
          let message;
          let priority = 'medium';
          
          if (currentHumidity < optimalHumidity) {
            message = `L'humidité de votre ${plant.name} est trop faible (${currentHumidity}%). Optimal: ${optimalHumidity}%`;
          } else {
            message = `L'humidité de votre ${plant.name} est trop élevée (${currentHumidity}%). Optimal: ${optimalHumidity}%`;
          }
          
          // Priorité haute si l'écart est très important
          if (humidityDifference > humidityTolerance * 2) {
            priority = 'high';
          }
          
          await Notification.create({
            user: plant.owner._id,
            plant: plant._id,
            type: 'humidity',
            title: 'Problème d\'humidité',
            message: message,
            priority: priority
          });
          
          console.log(`Notification humidité créée pour ${plant.name}`);
        }
      }
      
      // Vérifier la température
      if (plant.currentStats?.temperature?.value && 
          plant.careInstructions?.temperature?.min && 
          plant.careInstructions?.temperature?.max) {
        
        const currentTemp = plant.currentStats.temperature.value;
        const minTemp = plant.careInstructions.temperature.min;
        const maxTemp = plant.careInstructions.temperature.max;
        
        let temperatureAlert = false;
        let message;
        let priority = 'high';
        
        if (currentTemp < minTemp) {
          temperatureAlert = true;
          message = `Température dangereuse pour votre ${plant.name} ! Trop froid: ${currentTemp}°C (Min: ${minTemp}°C)`;
        } else if (currentTemp > maxTemp) {
          temperatureAlert = true;
          message = `Température dangereuse pour votre ${plant.name} ! Trop chaud: ${currentTemp}°C (Max: ${maxTemp}°C)`;
        }
        
        if (temperatureAlert) {
          await Notification.create({
            user: plant.owner._id,
            plant: plant._id,
            type: 'temperature',
            title: 'Alerte température',
            message: message,
            priority: priority
          });
          
          console.log(`Notification température créée pour ${plant.name}`);
        }
      }
    }
    
    console.log('Vérification terminée');
  } catch (error) {
    console.error('Erreur lors de la vérification quotidienne:', error);
  }
});

// Fonction pour tester manuellement 
const testNotifications = async () => {
  try {
    console.log('Test manuel des notifications...');
    
    const plants = await Plant.find({}).populate('owner');
    console.log(`${plants.length} plantes trouvées`);
    
    for (const plant of plants) {
      console.log(`Plante: ${plant.name}`);
      console.log(`- Humidité actuelle: ${plant.currentStats?.humidity?.value}%`);
      console.log(`- Humidité optimale: ${plant.careInstructions?.humidity?.optimal}%`);
      console.log(`- Température actuelle: ${plant.currentStats?.temperature?.value}°C`);
      console.log(`- Température min/max: ${plant.careInstructions?.temperature?.min}°C - ${plant.careInstructions?.temperature?.max}°C`);
    }
  } catch (error) {
    console.error('Erreur test notifications:', error);
  }
};

module.exports = { testNotifications };