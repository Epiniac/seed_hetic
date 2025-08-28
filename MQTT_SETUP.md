# 🌱 SEED - Intégration Capteurs IoT en Temps Réel

## 📋 Vue d'ensemble

Ce projet intègre des **capteurs IoT physiques** (température/humidité) dans l'application SEED via MQTT et une API REST.

## 🏗️ Architecture

```
🌡️ Capteurs Raspberry Pi
    ↓ (MQTT)
📡 Broker MQTT (admin-hetic.arcplex.tech:8830)
    ↓ (Souscription)
🖥️ Serveur Node.js (localhost:3001)
    ↓ (API REST)
📱 App React Native
```

## 🚀 Démarrage Rapide

### 1. Backend (Serveur Node.js)

```bash
cd server
npm install
npm start
```

Le serveur démarre sur le port **3001** et se connecte automatiquement au broker MQTT.

### 2. Frontend (App React Native)

```bash
cd my-app
npm install
npm start
# ou npx expo start
```

### 3. Test de l'API Capteurs

```bash
# Tester l'API des capteurs
curl http://localhost:3001/api/sensors/latest

# Réponse attendue :
{
  "success": true,
  "timestamp": "2025-08-27T19:56:23.089Z",
  "count": 4,
  "data": [
    {
      "type": "temperature",
      "value": 28.01,
      "source": 1222203606,
      "timestamp": "2025-08-27T19:55:09.363Z"
    },
    {
      "type": "humidity", 
      "value": 52.11,
      "source": 1222203606,
      "timestamp": "2025-08-27T19:55:09.426Z"
    }
  ]
}
```

## ⚙️ Configuration

### Variables d'environnement (.env)

Le fichier `server/.env` est déjà configuré avec :

```properties
# Configuration MQTT - Capteurs IoT
WM_SERVICES_MQTT_HOSTNAME=admin-hetic.arcplex.tech
WM_SERVICES_MQTT_PORT=8830
WM_SERVICES_MQTT_USERNAME=
WM_SERVICES_MQTT_PASSWORD=
WM_SERVICES_MQTT_FORCE_UNSECURE=true
MQTT_TOPIC=pws-packet/+/+/+
```

**⚠️ Important :** Ne pas modifier ces paramètres MQTT sans raison.

## 📊 Données des Capteurs

### Types de capteurs supportés :
- **Capteur 112** : Température (°C)
- **Capteur 114** : Humidité (%)

### Format des données API :
```json
{
  "type": "temperature|humidity",
  "value": 25.3,
  "source": 1222203606,
  "timestamp": "2025-08-27T19:55:09.363Z"
}
```

## 🔧 Développement

### Structure des fichiers modifiés :

**Backend :**
- `server/services/sensorDataService.js` - Service de stockage des données
- `server/routes/sensors.js` - Routes API pour les capteurs  
- `server/mqtt/raspberryHandler.js` - Traitement des messages MQTT
- `server/.env` - Configuration MQTT

**Frontend :**
- `my-app/services/sensorService.ts` - Service React Native pour l'API
- `my-app/components/SensorDisplay.tsx` - Composant d'affichage des données

### Debug et logs :

Quand le serveur fonctionne, vous verrez :
```
✅ MQTT initialisé - Collecte de données capteurs activée
Connecté au broker MQTT
Souscrit au topic: pws-packet/+/+/+
🌡️ Température: 28.01°C (Source: 1222203606)
💧 Humidité: 52.11% (Source: 1222203606)
```

## 🚨 Résolution de problèmes

### Problème : Aucune donnée capteur (`"count": 0`)
**Solutions :**
1. Vérifier que le serveur Node.js affiche "Connecté au broker MQTT"
2. Attendre quelques minutes pour que des données arrivent
3. Vérifier les logs pour des messages d'erreur MQTT

### Problème : Erreur de connexion MQTT
**Solutions :**
1. Vérifier la connexion internet
2. Le broker MQTT n'est accessible que depuis certains réseaux
3. Redémarrer le serveur Node.js

### Problème : API retourne une erreur 500
**Solutions :**
1. Vérifier que le serveur Node.js est démarré
2. Vérifier les logs du serveur pour des erreurs
3. Tester avec `curl http://localhost:3001/api/health`

## 🔄 Intégration avec l'équipe

### Avant de merger :
1. S'assurer que le serveur démarre sans erreur
2. Tester l'API des capteurs
3. Vérifier que l'app React Native se connecte à localhost:3001

### Fichiers sensibles pour le merge :
- `my-app/services/sensorService.ts` (URL de l'API)
- Tout fichier dans `server/` (nouveau code)
- `my-app/components/` (si ajout de composants capteurs)

## 📝 TODO / Améliorations futures

- [ ] Intégrer SensorDisplay dans le Dashboard
- [ ] Ajouter la persistance en base de données
- [ ] Implémenter des seuils d'alerte pour les plantes
- [ ] Ajouter plus de types de capteurs
- [ ] Optimiser la consommation réseau

---

**🎯 Objectif :** Fournir des données de capteurs **réelles** et **en temps réel** pour améliorer l'expérience utilisateur de l'application SEED.
