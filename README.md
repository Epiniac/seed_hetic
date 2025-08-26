# 🌱 SEED - Smart Garden Management App

> **Application mobile de gestion intelligente de jardin avec capteurs IoT**  
> Une solution complète pour cultiver et surveiller vos plantes avec des données en temps réel.

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)

## 📖 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [API Documentation](#-api-documentation)
- [Technologies](#-technologies)
- [Développement](#-développement)
- [Contribuer](#-contribuer)

## 🎯 À propos

SEED est une application mobile innovante qui transforme votre expérience de jardinage en combinant :
- **Surveillance IoT** : Capteurs connectés pour mesurer température, humidité, luminosité
- **Intelligence artificielle** : Conseils personnalisés basés sur les données de vos plantes  
- **Catalogue complet** : Base de données de plantes avec instructions de soins
- **Communauté** : Partage d'expériences et de conseils entre jardiniers

### 🎯 Objectifs
- Démocratiser le jardinage intelligent
- Optimiser la croissance des plantes grâce aux données
- Créer une communauté de jardiniers connectés
- Promouvoir la durabilité environnementale

## ✨ Fonctionnalités

### 🔐 Authentification & Profils
- Inscription/Connexion sécurisée avec JWT
- Profils utilisateur avec photos personnalisées
- Gestion des avatars via sélection d'images
- Bibliothèque personnelle de plantes

### 🌿 Gestion des Plantes
- **Catalogue interne** : 8+ espèces pré-configurées (Basilic, Menthe, Monstera...)
- **Recherche intelligente** : Filtrage par nom, espèce, conditions de croissance
- **Fiches détaillées** : Instructions de soins, photos, données optimales
- **Suivi personnalisé** : Ajout/suppression dans votre bibliothèque

### 📊 Monitoring IoT
- **Capteurs temps réel** : Température, humidité, luminosité
- **Protocole MQTT** : Communication bidirectionnelle avec les capteurs
- **Alertes intelligentes** : Notifications basées sur les seuils
- **Historique** : Graphiques d'évolution des données

### 📱 Interface Mobile
- **Design moderne** : UI/UX optimisée avec Expo Router
- **Navigation intuitive** : Onglets et écrans contextuels
- **Responsive** : Compatible iOS et Android
- **Mode hors-ligne** : Stockage local des données critiques

## 🏗️ Architecture

### 📱 Frontend (React Native + Expo)
```
my-app/
├── app/                          # Navigation Expo Router
│   ├── (tabs)/                   # Onglets principaux
│   │   ├── index.tsx            # Écran d'accueil
│   │   └── _layout.tsx          # Layout des onglets
│   ├── (authenticated)/         # Pages protégées
│   │   ├── Dashboard.tsx        # Tableau de bord
│   │   └── Product.jsx          # Gestion des plantes
│   ├── authen/                  # Authentification
│   └── DashboardPlantDetail/    # Détails plante
├── components/                   # Composants réutilisables
│   ├── PlantSearch.tsx          # Recherche de plantes
│   ├── AuthContext.tsx          # Contexte d'authentification
│   └── ProtectedRoute.tsx       # Routes protégées
├── services/                     # Services API
│   ├── authService.ts           # Service d'authentification
│   ├── internalPlantApi.ts      # API interne des plantes
│   └── unifiedPlantApi.ts       # API unifiée
└── config/                      # Configuration
    └── environment.ts           # Variables d'environnement
```

### 🖥️ Backend (Node.js + Express)
```
server/
├── server.js                    # Point d'entrée principal
├── config/
│   ├── database.js             # Configuration MongoDB
│   └── config.js               # Configuration MQTT/ENV
├── models/                     # Modèles de données
│   ├── User.js                 # Utilisateurs avec bibliothèques
│   ├── Plant.js                # Plantes utilisateur
│   ├── PlantCatalog.js         # Catalogue de plantes
│   └── Notification.js         # Système de notifications
├── controllers/                # Logique métier
│   ├── authController.js       # Authentification
│   ├── plantController.js      # Gestion des plantes
│   └── notificationController.js
├── routes/                     # Routes API REST
│   ├── auth.js                 # /api/auth
│   ├── plants.js               # /api/plants
│   ├── plantCatalog.js         # /api/plant-catalog
│   └── users.js                # /api/users
├── mqtt/                       # Communication IoT
│   └── mqtt.js                 # Client MQTT
└── utils/
    └── cron.js                 # Tâches planifiées
```

### 🗄️ Base de données (MongoDB)
```
Collections:
├── users                       # Profils utilisateur
│   ├── email, password, name   
│   ├── avatar (base64)
│   └── library[]               # Bibliothèque de plantes
├── plants                      # Plantes des utilisateurs
│   ├── name, species, description
│   ├── careInstructions{}      # Instructions de soin
│   ├── currentStats{}          # Données capteurs
│   └── status                  # État de santé
├── plantcatalogs              # Catalogue de référence
│   ├── common_name, scientific_name
│   ├── care_info{}            # Informations de soin
│   └── default_image{}        # Images par défaut
└── notifications              # Système d'alertes
    ├── type, message, priority
    └── plant_id, user_id
```

## 🚀 Installation

### Prérequis
- **Node.js** >= 16.0.0
- **npm** ou **yarn**
- **Expo CLI** : `npm install -g expo-cli`
- **MongoDB Atlas** (ou instance locale)
- **Capteurs IoT** (optionnel pour développement)

### 1. Cloner le repository
```bash
git clone https://github.com/Epiniac/seed_hetic.git
cd seed_hetic
```

### 2. Installation Backend
```bash
cd server
npm install

# Créer le fichier .env
cp .env.example .env
# Remplir les variables d'environnement (voir Configuration)

# Démarrer le serveur
npm start
```

### 3. Installation Frontend
```bash
cd my-app
npm install

# Lancer l'application
npx expo start
```

## ⚙️ Configuration

### Variables d'environnement (server/.env)
```bash

# MQTT (Capteurs IoT)
MQTT_BROKER_URL=mqtt://your-mqtt-broker.com
MQTT_TOPIC=seed/sensors/+
MQTT_USERNAME=your_mqtt_username
MQTT_PASSWORD=your_mqtt_password

# API Externe (optionnel)
PERENUAL_API_KEY=your_perenual_api_key
```

### Configuration Frontend (my-app/config/environment.ts)
```typescript
export const config = {
  // Remplacer par l'IP de votre machine pour tests sur appareil physique
  API_BASE_URL: 'http://192.168.1.35:3001/api',
  
  // Pour émulateur Android
  // API_BASE_URL: 'http://10.0.2.2:3001/api',
  
  // Pour simulateur iOS
  // API_BASE_URL: 'http://localhost:3001/api',
};
```

### Initialisation de la base de données
```bash
cd server
node seedCatalog.js  # Peuple le catalogue de plantes
```

## 🎮 Utilisation

### 🏃‍♂️ Démarrage rapide

1. **Démarrer le backend**
   ```bash
   cd server
   npm start
   ```
   ✅ Serveur disponible sur `http://localhost:3001`

2. **Lancer l'app mobile**
   ```bash
   cd my-app
   npx expo start
   ```
   📱 Scanner le QR code avec Expo Go

3. **Premier utilisateur**
   - Ouvrir l'app → "Get Started"
   - Créer un compte (nom, email, mot de passe)
   - Explorer le catalogue de plantes
   - Ajouter des plantes à votre bibliothèque

### 📱 Navigation dans l'app

#### Écran d'accueil
- **Welcome Screen** : Présentation de l'app
- **Bouton "Get Started"** : Vers l'authentification

#### Onglets principaux
- **🏠 Accueil** : Dashboard avec vos plantes
- **🔍 Recherche** : Catalogue et recherche de plantes  
- **📊 Monitoring** : Données capteurs temps réel
- **👤 Profil** : Compte, bibliothèque, paramètres

#### Fonctionnalités clés
- **Recherche plantes** : Tapez le nom d'une plante
- **Ajout/Suppression** : Boutons ❤️ dans les fiches
- **Détails plante** : Instructions complètes de soin
- **Photo de profil** : Clic sur l'avatar → sélection image

## 📚 API Documentation

### 🔐 Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "securepassword"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "jwt_token_here",
  "user": { "id": "...", "name": "John Doe", "email": "...", "avatar": "..." }
}
```

#### Profil utilisateur
```http
GET /api/auth/profile
Authorization: Bearer jwt_token_here
```

#### Mise à jour avatar
```http
PUT /api/auth/avatar
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
}
```

### 🌿 Catalogue de plantes

#### Recherche dans le catalogue
```http
GET /api/plant-catalog/search?q=basilic
GET /api/plant-catalog/search           # Toutes les plantes
```

#### Détails d'une plante
```http
GET /api/plant-catalog/:id
```

#### Plantes populaires
```http
GET /api/plant-catalog/popular
```

### 👤 Bibliothèque utilisateur

#### Récupérer ma bibliothèque
```http
GET /api/users/library
Authorization: Bearer jwt_token_here
```

#### Ajouter une plante
```http
POST /api/users/library
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "plantId": "plant_catalog_id",
  "plantData": { /* données de la plante */ }
}
```

#### Supprimer une plante
```http
DELETE /api/users/library/:plantId
Authorization: Bearer jwt_token_here
```

### 🌱 Plantes utilisateur (avec capteurs)

#### Mes plantes avec données capteurs
```http
GET /api/plants
Authorization: Bearer jwt_token_here
```

#### Ajouter une plante avec capteurs
```http
POST /api/plants
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "name": "Mon Basilic",
  "species": "Ocimum basilicum",
  "description": "Basilic sur le balcon",
  "careInstructions": {
    "watering": { "frequency": "daily", "amount": "moderate" },
    "temperature": { "min": 15, "max": 30, "optimal": 22 },
    "humidity": { "min": 40, "max": 70, "optimal": 55 }
  }
}
```

### 🔔 Notifications

#### Mes notifications
```http
GET /api/notifications
Authorization: Bearer jwt_token_here
```

#### Marquer comme lue
```http
PUT /api/notifications/:id/read
Authorization: Bearer jwt_token_here
```

### 🌡️ Santé du serveur
```http
GET /api/health

Response:
{
  "status": "OK",
  "message": "Backend SEED fonctionne correctement", 
  "timestamp": "2025-08-25T10:30:00.000Z"
}
```

## 🛠️ Technologies

### Frontend
- **React Native** 0.79.5 - Framework mobile
- **Expo** ~53.0.20 - Outils de développement
- **Expo Router** - Navigation basée sur les fichiers
- **TypeScript** - Typage statique
- **React Context** - Gestion d'état
- **AsyncStorage** - Stockage local
- **Expo Image Picker** - Sélection d'images

### Backend  
- **Node.js** - Runtime JavaScript
- **Express.js** 5.1.0 - Framework web
- **MongoDB** + **Mongoose** - Base de données NoSQL
- **JWT** - Authentification sans état
- **bcryptjs** - Hachage des mots de passe
- **MQTT.js** - Communication IoT
- **node-cron** - Tâches planifiées
- **CORS** - Gestion des requêtes cross-origin

### DevOps & Tools
- **MongoDB Atlas** - Cloud database
- **Expo Go** - Tests sur appareils
- **Git** - Contrôle de version
- **npm** - Gestionnaire de paquets
- **ESLint** - Linting JavaScript/TypeScript

## 🔧 Développement

### Scripts disponibles

#### Backend (server/)
```bash
npm start          # Démarrer le serveur
npm run dev        # Mode développement (avec auto-reload)
npm test           # Lancer les tests
node seedCatalog.js # Peupler la base de données
```

#### Frontend (my-app/)
```bash
npx expo start     # Lancer le bundler Metro
npx expo start --android    # Forcer Android
npx expo start --ios        # Forcer iOS  
npx expo start --web        # Version web
npm run typecheck  # Vérification TypeScript
npm test          # Tests Jest
```

### Tests et debug

#### Tester l'API manuellement
```bash
# Health check
curl http://localhost:3001/api/health

# Recherche de plantes
curl http://localhost:3001/api/plant-catalog/search?q=basilic

# Test complet d'authentification
cd /Users/jim/seed_hetic
node test-auth.js

# Test upload d'avatar
node test-avatar.js
```

#### Debug React Native
- **Expo DevTools** : Ouvrir dans le navigateur
- **React Native Debugger** : Outil dédié
- **Console logs** : Visible dans Metro bundler
- **Network inspection** : Requêtes API tracées

#### Logs serveur
```bash
# Logs en temps réel
tail -f server/logs/app.log

# Logs MQTT
# Les messages des capteurs apparaissent dans la console du serveur
```

### Structure des données capteurs (MQTT)

#### Format attendu des capteurs
```json
{
  "capteur": "sensor_001",
  "temperature": 22.5,
  "humidite": 65,
  "luminosite": 750,
  "ph": 6.8,
  "acceleration": {
    "x": 0.1,
    "y": 0.0, 
    "z": 9.8
  },
  "timestamp": "2025-08-25T10:30:00Z",
  "plant_id": "plant_mongodb_id_here"
}
```

#### Topic MQTT
- **Subscription** : `seed/sensors/+`
- **Publication** : `seed/commands/sensor_001`

### Ajout de nouvelles plantes

#### Méthode 1 : Via le script de peuplement
```javascript
// Modifier server/seedCatalog.js
const newPlants = [
  {
    common_name: "Lavande",
    scientific_name: ["Lavandula angustifolia"],
    default_image: {
      thumbnail: "url_thumbnail",
      small_url: "url_small", 
      regular_url: "url_regular"
    },
    care_info: {
      watering: "Arrosage modéré, laisser sécher entre les arrosages",
      temperature: { min: 5, max: 35, optimal: 20 },
      humidity: { min: 30, max: 60, optimal: 45 }
    }
  }
];
```

#### Méthode 2 : Via l'API
```bash
curl -X POST http://localhost:3001/api/plant-catalog \
  -H "Content-Type: application/json" \
  -d '{"common_name": "Lavande", "scientific_name": ["Lavandula angustifolia"], ...}'
```

## 🤝 Contribuer

### Workflow de contribution
1. **Fork** le repository
2. **Créer une branche** : `git checkout -b feature/nouvelle-fonctionnalite`
3. **Commit** : `git commit -m "feat: ajouter recherche avancée"`
4. **Push** : `git push origin feature/nouvelle-fonctionnalite`  
5. **Pull Request** : Vers la branche `develop`

### Standards de code
- **Commits** : Format conventionnel (`feat:`, `fix:`, `docs:`)
- **TypeScript** : Typage strict activé
- **ESLint** : Configuration standard React Native
- **Tests** : Couverture minimum 70%

### Roadmap
- [ ] **Mode hors-ligne** complet
- [ ] **Notifications push** natives  
- [ ] **Graphiques** d'évolution des données
- [ ] **Export PDF** des rapports de croissance
- [ ] **Intégration IA** pour diagnostics automatiques
- [ ] **Mode sombre** complet
- [ ] **Support multi-langues** (FR/EN/ES)
- [ ] **Widget iOS/Android** pour données rapides

---

## 📞 Support & Contact

- **Issues** : [GitHub Issues](https://github.com/Epiniac/seed_hetic/issues)
- **Discussions** : [GitHub Discussions](https://github.com/Epiniac/seed_hetic/discussions)
- **Email** : support@seed-app.com

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🏆 Remerciements

- **Expo Team** pour l'excellent framework
- **MongoDB** pour la solution de base de données
- **Perenual API** pour les données de plantes de référence
- **Communauté React Native** pour les ressources et l'aide

---

*Développé avec ❤️ pour rendre le jardinage accessible à tous*