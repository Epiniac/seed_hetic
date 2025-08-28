const { startMQTTClient } = require('./mqtt.js');
const Plant = require('../models/Plant.js');
const Notification = require('../models/Notification.js');
const sensorDataService = require('../services/sensorDataService.js');

function setupRaspberryDataHandler() {
    const mqttClient = startMQTTClient();

    mqttClient.on('message', async (topic, message) => {
        try {
            console.log(`📡 Message reçu sur topic: ${topic}`);
            const messageStr = message.toString();
            
            // Traiter les données des capteurs Wirepas
            if (topic.startsWith('pws-packet/')) {
                await processWirepasSensorData(messageStr, topic);
            }
            // Traiter les données des capteurs Ruuvi (pour les tests)
            else if (topic.startsWith('ruuvi/')) {
                await processRuuviSensorData(messageStr, topic);
            }
            
        } catch (error) {
            console.error('❌ Erreur lors du traitement des données MQTT:', error);
            console.error('Topic:', topic);
            console.error('Message brut:', message.toString());
        }
    });

    return mqttClient;
}

// Traiter les données des capteurs
async function processRuuviSensorData(message, topic) {
    try {
        // Parser le message pour extraire température et humidité
        const lines = message.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
            if (line.includes('Temperature:')) {
                const tempMatch = line.match(/Temperature:\s*([-\d.]+)/);
                if (tempMatch) {
                    const temperature = parseFloat(tempMatch[1]);
                    const source = extractSourceFromTopic(topic);
                    sensorDataService.addSensorData('temperature', temperature, source);
                }
            }
            
            if (line.includes('Humidity:')) {
                const humMatch = line.match(/Humidity:\s*([\d.]+)/);
                if (humMatch) {
                    const humidity = parseFloat(humMatch[1]);
                    const source = extractSourceFromTopic(topic);
                    sensorDataService.addSensorData('humidity', humidity, source);
                }
            }
        }
    } catch (error) {
        console.error('❌ Erreur traitement données :', error);
    }
}

// Extraire la source depuis le topic MQTT
function extractSourceFromTopic(topic) {
    // Topic format: ruuvi/sensor_id ou ruuvi/data
    const parts = topic.split('/');
    return parts.length > 1 ? parts[1] : 'unknown';
}

async function processWirepasSensorData(messageStr, topic) {
    try {
        // Parser le message JSON
        const data = JSON.parse(messageStr);
        
        // Extraire le sensor_id depuis le JSON
        const sensor_id = data.sensor_id?.toString();
        
        // Filtrer seulement les capteurs 112 (température) et 114 (humidité)
        if (sensor_id === "112" || sensor_id === "114") {
            const timestamp = new Date().toISOString();
            const source = data.source_address || 'unknown';
            
            if (sensor_id === "112" && data.data && data.data.temperature !== undefined) {
                // Capteur de température
                const temperature = data.data.temperature;
                console.log(`🌡️  Température: ${temperature}°C (Source: ${source})`);
                sensorDataService.addSensorData('temperature', temperature, source);
                
            } else if (sensor_id === "114" && data.data && data.data.humidity !== undefined) {
                // Capteur d'humidité  
                const humidity = data.data.humidity;
                console.log(`💧 Humidité: ${humidity}% (Source: ${source})`);
                sensorDataService.addSensorData('humidity', humidity, source);
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur traitement données Wirepas:', error);
        console.error('Message:', messageStr);
        console.error('Topic:', topic);
    }
}

async function sendCommandToRaspberry(command) {
    try {
        console.log('📡 Envoi commande vers Raspberry:', command);
        return { success: true, message: 'Commande envoyée' };
    } catch (error) {
        console.error('❌ Erreur envoi commande:', error);
        return { success: false, error: error.message };
    }
}

module.exports = { setupRaspberryDataHandler, sendCommandToRaspberry };
