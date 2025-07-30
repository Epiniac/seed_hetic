const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');


// Importer les routes
const authRoutes = require('./routes/auth');
const plantRoutes = require('./routes/plants');
const notificationRoutes = require('./routes/notifications');

// Charger les variables d'environnement
dotenv.config();

// Créer l'app Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/notifications', notificationRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend SEED fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware de gestion d'erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connecter à la base de données
    await connectDB();
    
    // Initialiser le catalogue de plantes (en développement)
    if (process.env.NODE_ENV === 'development') {
      await seedPlantCatalog();
    }
    
    // Démarrer les tâches cron
    require('./utils/cron');
    
    // Démarrer le serveur
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