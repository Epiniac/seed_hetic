// Service pour récupérer les données des capteurs en temps réel
// URL de ton serveur Node.js local
const SENSOR_API_URL = 'http://localhost:3001/api/sensors/latest';

export const sensorService = {
  // Récupérer les dernières données des capteurs
  async getLatestSensorData() {
    try {
      const response = await fetch(SENSOR_API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Formater les données pour l'affichage
      const formattedData = this.formatSensorData(data.data || []);
      
      return {
        success: true,
        data: formattedData,
        timestamp: data.timestamp,
        count: data.count || 0
      };
    } catch (error) {
      console.error('Erreur récupération données capteurs:', error);
      return {
        success: false,
        error: error.message,
        data: {
          temperature: null,
          humidity: null,
          lastUpdate: null
        }
      };
    }
  },

  // Formater les données pour l'affichage
  formatSensorData(rawData) {
    const result = {
      temperature: null,
      humidity: null,
      lastUpdate: null,
      sources: []
    };

    if (!Array.isArray(rawData) || rawData.length === 0) {
      return result;
    }

    // Récupérer les dernières valeurs de température et humidité
    const temperatures = rawData.filter(item => item.type === 'temperature');
    const humidities = rawData.filter(item => item.type === 'humidity');

    if (temperatures.length > 0) {
      const latestTemp = temperatures[temperatures.length - 1];
      result.temperature = {
        value: parseFloat(latestTemp.value),
        source: latestTemp.source,
        timestamp: latestTemp.timestamp
      };
      result.lastUpdate = latestTemp.timestamp;
    }

    if (humidities.length > 0) {
      const latestHumidity = humidities[humidities.length - 1];
      result.humidity = {
        value: parseFloat(latestHumidity.value),
        source: latestHumidity.source,
        timestamp: latestHumidity.timestamp
      };
      
      // Prendre le timestamp le plus récent
      if (!result.lastUpdate || latestHumidity.timestamp > result.lastUpdate) {
        result.lastUpdate = latestHumidity.timestamp;
      }
    }

    // Extraire les sources uniques
    result.sources = [...new Set(rawData.map(item => item.source))];

    return result;
  }
};