const express = require('express');
const router = express.Router();
const sensorDataService = require('../services/sensorDataService.js');

// Route pour recevoir les données des capteurs de la passerelle
router.post('/sensor-data', (req, res) => {
    try {
        const { type, value, source, timestamp } = req.body;
        
        console.log(`📊 Données capteur reçues:`);
        console.log(`   Type: ${type}`);
        console.log(`   Valeur: ${value}`);
        console.log(`   Source: ${source}`);
        console.log(`   Timestamp: ${timestamp}`);
        console.log('─'.repeat(50));
        
        // Sauvegarder dans le service de données
        sensorDataService.addSensorData(type, value, source);
        
        res.status(200).json({ 
            message: 'Données reçues avec succès',
            data: { type, value, source, timestamp }
        });
        
    } catch (error) {
        console.error('❌ Erreur réception données capteur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET /api/sensors/latest - Récupérer les dernières données des capteurs
router.get('/latest', (req, res) => {
    try {
        const data = sensorDataService.getLatestData();
        
        console.log(`📱 API appelée - ${data.count} entrées disponibles`);
        
        res.json({
            success: true,
            timestamp: data.timestamp,
            count: data.count,
            data: data.data
        });
    } catch (error) {
        console.error('❌ Erreur API sensors/latest:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur lors de la récupération des données'
        });
    }
});
router.get('/sensor-data/latest', async (req, res) => {
    try {
        // Proxy vers la passerelle
        const response = await fetch('http://192.168.100.54:8080/api/sensor-data/latest', {
            timeout: 5000 // 5 secondes de timeout
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('📊 Données capteurs récupérées via proxy:', data.count, 'entrées');
        
        res.status(200).json(data);
        
    } catch (error) {
        console.error('❌ Erreur proxy capteurs:', error.message);
        res.status(500).json({ 
            error: 'Impossible de récupérer les données des capteurs',
            details: error.message,
            status: 'offline'
        });
    }
});

// Route pour récupérer les dernières données des capteurs (ancienne version, gardée pour compatibilité)
router.get('/sensor-data/latest-old', (req, res) => {
    try {
        // TODO: Récupérer les dernières données de la base
        res.status(200).json({
            temperature: 26.5,
            humidity: 52.3,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Erreur récupération données:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
