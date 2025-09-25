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
            
            if (topic.startsWith('pws-packet/')) {
                await processWirepasSensorData(messageStr, topic);
            }

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

async function processRuuviSensorData(message, topic) {
    try {
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

function extractSourceFromTopic(topic) {
    const parts = topic.split('/');
    return parts.length > 1 ? parts[1] : 'unknown';
}

async function processWirepasSensorData(messageStr, topic) {
    try {
        const data = JSON.parse(messageStr);
        
        const sensor_id = data.sensor_id?.toString();

        if (sensor_id === "112" || sensor_id === "114") {
            const timestamp = new Date().toISOString();
            const source = data.source_address || 'unknown';
            
            if (sensor_id === "112" && data.data && data.data.temperature !== undefined) {
                const temperature = data.data.temperature;
                console.log(`🌡️  Température: ${temperature}°C (Source: ${source})`);
                sensorDataService.addSensorData('temperature', temperature, source);
                
            } else if (sensor_id === "114" && data.data && data.data.humidity !== undefined) { 
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
