import dotenv from 'dotenv';
dotenv.config();

export const config = {
  mqtt: {
    brokerUrl: process.env.MQTT_BROKER_URL,
    topic: process.env.MQTT_TOPIC,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  }
};
