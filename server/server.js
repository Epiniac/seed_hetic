const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');


const authRoutes = require('./routes/auth');
const plantRoutes = require('./routes/plants');
const notificationRoutes = require('./routes/notifications');
const plantCatalogRoutes = require('./routes/plantCatalog');
const userRoutes = require('./routes/users');
const sensorRoutes = require('./routes/sensors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/plant-catalog', plantCatalogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sensors', sensorRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend SEED fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    if (process.env.NODE_ENV === 'development') {
      // await seedPlantCatalog(); // TODO: Implémenter cette fonction
      console.log('Base de données initialisée avec des données de test');
    }

    try {
      const { setupRaspberryDataHandler } = require('./mqtt/raspberryHandler.js');
      const mqttClient = setupRaspberryDataHandler();
      console.log('✅ MQTT initialisé - Collecte de données capteurs activée');
    } catch (error) {
      console.warn('⚠️ MQTT non disponible:', error.message);
    }

    require('./utils/cron');

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;