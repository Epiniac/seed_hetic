// Service pour gérer les données des capteurs en mémoire
class SensorDataService {
  constructor() {
    this.sensorData = [];
    this.maxEntries = 50; // Limite comme dans htc-13
  }

  // Ajouter une nouvelle donnée capteur
  addSensorData(type, value, source) {
    const entry = {
      type,
      value: parseFloat(value),
      source,
      timestamp: new Date().toISOString()
    };

    this.sensorData.push(entry);

    // Garder seulement les dernières entrées
    if (this.sensorData.length > this.maxEntries) {
      this.sensorData = this.sensorData.slice(-this.maxEntries);
    }

    console.log(`📊 Nouvelle donnée capteur: ${type}=${value} (source: ${source})`);
  }

  // Récupérer les dernières données
  getLatestData() {
    return {
      timestamp: new Date().toISOString(),
      count: this.sensorData.length,
      data: this.sensorData
    };
  }

  // Récupérer les dernières données par type
  getLatestByType(type) {
    return this.sensorData
      .filter(entry => entry.type === type)
      .slice(-10); // Dernières 10 entrées du type demandé
  }

  // Statistiques
  getStats() {
    const temperatures = this.sensorData.filter(d => d.type === 'temperature');
    const humidities = this.sensorData.filter(d => d.type === 'humidity');
    
    return {
      totalEntries: this.sensorData.length,
      temperatureEntries: temperatures.length,
      humidityEntries: humidities.length,
      sources: [...new Set(this.sensorData.map(d => d.source))],
      lastUpdate: this.sensorData.length > 0 ? 
        this.sensorData[this.sensorData.length - 1].timestamp : null
    };
  }
}

// Instance singleton
const sensorDataService = new SensorDataService();

module.exports = sensorDataService;
