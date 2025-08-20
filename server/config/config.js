import dotenv from 'dotenv';
dotenv.config();

export const config = {
  mqtt: {
    brokerUrl: process.env.WM_SERVICES_MQTT_HOSTNAME,
    port: parseInt(process.env.WM_SERVICES_MQTT_PORT, 10),
    username: process.env.WM_SERVICES_MQTT_USERNAME,
    password: process.env.WM_SERVICES_MQTT_PASSWORD,
    forceUnsecure: process.env.WM_SERVICES_MQTT_FORCE_UNSECURE === 'true',
    topic: process.env.MQTT_TOPIC || 'raspberry/data',
  }
};
