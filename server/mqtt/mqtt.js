const mqtt = require('mqtt');
const { config } = require('../config/config.js');

function startMQTTClient() {
    const protocol = config.mqtt.forceUnsecure ? 'mqtt' : 'mqtts';
    const brokerUrl = `${protocol}://${config.mqtt.brokerUrl}:${config.mqtt.port}`;
    
    const options = {
        username: config.mqtt.username,
        password: config.mqtt.password,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
    };

    const client = mqtt.connect(brokerUrl, options);

    client.on('connect', () => {
        console.log('Connecté au broker MQTT');
        client.subscribe(config.mqtt.topic, (err) => {
            if (err) {
                console.error('Erreur de souscription:', err);
            } else {
                console.log(`Souscrit au topic: ${config.mqtt.topic}`);
            }
        });
    });

    client.on('error', (err) => {
        console.error('Erreur MQTT :', err);
    });

    client.on('close', () => {
        console.log('Connexion MQTT fermée');
    });

    return client;
}
module.exports = { startMQTTClient };