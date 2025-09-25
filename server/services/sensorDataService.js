
class SensorDataService {
  constructor() {
    this.sensorData = [];
    this.maxEntries = 100;
    this.maxAgeHours = 2; 
    
    this.startAutoCleanup();
  }

  addSensorData(type, value, source) {
    const entry = {
      type,
      value: parseFloat(value),
      source,
      timestamp: new Date().toISOString()
    };

    this.sensorData.push(entry);

    if (this.sensorData.length > this.maxEntries) {
      this.sensorData = this.sensorData.slice(-this.maxEntries);
      console.log(`⚠️ Limite atteinte: gardé seulement les ${this.maxEntries} dernières entrées`);
    }

    console.log(`📊 Nouvelle donnée capteur: ${type}=${value} (source: ${source})`);
  }

  getLatestData() {
    return {
      timestamp: new Date().toISOString(),
      count: this.sensorData.length,
      data: this.sensorData
    };
  }

  getLatestByType(type) {
    return this.sensorData
      .filter(entry => entry.type === type)
      .slice(-10); 
  }

  cleanOldData() {
    const now = new Date();
    const maxAge = this.maxAgeHours * 60 * 60 * 1000;
    const cutoffTime = new Date(now.getTime() - maxAge);
    
    const initialCount = this.sensorData.length;
    this.sensorData = this.sensorData.filter(entry => {
      return new Date(entry.timestamp) > cutoffTime;
    });
    
    const cleanedCount = initialCount - this.sensorData.length;
    if (cleanedCount > 0) {
      console.log(`🧹 Nettoyage automatique: ${cleanedCount} entrées supprimées (> ${this.maxAgeHours}h)`);
      console.log(`📊 Données restantes: ${this.sensorData.length} entrées`);
    }
  }

  startAutoCleanup() {
    this.cleanOldData();
    this.cleanupInterval = setInterval(() => {
      this.cleanOldData();
    }, 3600000);
    
    console.log(`🔄 Nettoyage automatique démarré: toutes les heures, garde ${this.maxAgeHours}h de données`);
  }
  stopAutoCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      console.log('🛑 Nettoyage automatique arrêté');
    }
  }
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

const sensorDataService = new SensorDataService();

module.exports = sensorDataService;
