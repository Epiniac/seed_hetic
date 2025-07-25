import mqtt from 'mqtt';
import { config } from '../config/config.js';

export function startMQTTClient() {
    const client = mqtt.connect(config.mqtt.brokerUrl);
    console.log("Successfully connected");
};
