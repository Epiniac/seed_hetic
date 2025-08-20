import { startMQTTClient } from './mqtt.js';
import Plant from '../models/Plant.js';
import Notification from '../models/Notification.js';

export function setupRaspberryDataHandler() {
    const mqttClient = startMQTTClient();

    mqttClient.on('message', async (topic, message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('Données Raspberry reçues:', data);

            await processRaspberryData(data);
            
        } catch (error) {
            console.error('Erreur lors du traitement des données MQTT:', error);
        }
    });

    return mqttClient;
}

async function processRaspberryData(data) {
    try {
        if (!data.plantId || !data.sensorId) {
            throw new Error('Données manquantes: plantId ou sensorId');
        }

        const plant = await Plant.findOne({ 
            _id: data.plantId,
            sensorId: data.sensorId 
        });

        if (!plant) {
            console.log(`Plante non trouvée: ${data.plantId}`);
            return;
        }

        const updateData = {
            lastUpdate: new Date(data.timestamp || Date.now()),
            currentData: {
                temperature: data.temperature,
                humidity: data.humidity,
                soilMoisture: data.soilMoisture,
                light: data.light
            }
        };
        const notifications = await checkThresholds(plant, data);
        
        await Plant.findByIdAndUpdate(plant._id, updateData);

        for (const notification of notifications) {
            await Notification.create(notification);
        }

        console.log(`Données mises à jour pour plante: ${plant.name}`);

    } catch (error) {
        console.error('Erreur lors du traitement:', error);
    }
}

async function checkThresholds(plant, sensorData) {
    const notifications = [];
    const thresholds = plant.thresholds || {};

    if (sensorData.soilMoisture !== undefined && thresholds.soilMoisture) {
        if (sensorData.soilMoisture < thresholds.soilMoisture.min) {
            notifications.push({
                userId: plant.userId,
                plantId: plant._id,
                type: 'watering',
                message: `La plante ${plant.name} a besoin d'eau (humidité: ${sensorData.soilMoisture}%)`,
                priority: 'high'
            });
        }
    }

    if (sensorData.temperature !== undefined && thresholds.temperature) {
        if (sensorData.temperature < thresholds.temperature.min || 
            sensorData.temperature > thresholds.temperature.max) {
            notifications.push({
                userId: plant.userId,
                plantId: plant._id,
                type: 'temperature',
                message: `Température anormale pour ${plant.name}: ${sensorData.temperature}°C`,
                priority: 'medium'
            });
        }
    }

    if (sensorData.humidity !== undefined && thresholds.humidity) {
        if (sensorData.humidity < thresholds.humidity.min || 
            sensorData.humidity > thresholds.humidity.max) {
            notifications.push({
                userId: plant.userId,
                plantId: plant._id,
                type: 'humidity',
                message: `Humidité anormale pour ${plant.name}: ${sensorData.humidity}%`,
                priority: 'low'
            });
        }
    }

    return notifications;
}

export function sendCommandToRaspberry(mqttClient, sensorId, command) {
    const topic = `raspberry/${sensorId}/commands`;
    const message = JSON.stringify({
        command: command,
        timestamp: new Date().toISOString()
    });

    mqttClient.publish(topic, message, { qos: 1 }, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi de la commande:', err);
        } else {
            console.log(`Commande envoyée: ${command} au sensor ${sensorId}`);
        }
    });
}
