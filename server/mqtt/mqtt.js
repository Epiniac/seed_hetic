import mqtt from 'mqtt';
import { config } from '../config/config.js';

export function startMQTTClient() {
    const options = {
        username: config.mqtt.username,
        password: config.mqtt.password,
        protocol: 'mqtt',
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
    };

    const client = mqtt.connect(config.mqtt.brokerUrl, options);

    client.on('connect', () => {
        console.log('Connecté au broker MQTT');
        client.subscribe(config.mqtt.topic, (err) => {
            if (err) {
                console.error('Erreur:', err);
            } else {
                console.log(`Topic: ${config.mqtt.topic}`);
            }
        });
    });

    client.on('message', (topic, message) => {
        const msg = message.toString();
        try{
            const data = JSON.parse(msg);
            // Données de test :
            
            //const test_data = '{"capteur":"test","temperature":22.2,"humidite":50,"pression":1013,"acceleration":{"x":0.1,"y":0.0,"z":9.8},"timestamp":"2025-07-28T12:00:00Z"}';
            //const data = JSON.parse(test_data);
            console.log(`Message reçu au topic [${topic}]:`, data);

            // TODO

            } 
            catch (err) {
                console.error('Erreur:', err);
            }
        
    });

    client.on('error', (err) => {
        console.error('Erreur MQTT :', err);
    });

    client.on('close', () => {
        console.log('Connexion MQTT fermée');
    });

    return client;
}
