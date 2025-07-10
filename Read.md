# GreenHouse App

**GreenHouse** est une application mobile React Native (Expo) qui aide les utilisateurs à gérer et surveiller leurs plantes et leur jardin, tout en rendant l'expérience agréable et intuitive.

## Fonctionnalités principales

- **Accueil personnalisé** : Un écran d'accueil engageant avec un slogan et un bouton pour démarrer l'inscription.
- **Authentification** : Un écran dédié à la connexion/inscription, avec une interface animée et des formulaires modernes.
- **Navigation par onglets** : Quatre onglets principaux pour accéder rapidement aux différentes sections de l'app :
  - **Dashboard** : Vue d'ensemble de vos plantes, recherche, catégories, et notifications.
  - **Product** : Statistiques détaillées d'une plante (température, humidité, type de sol, etc.).
  - **Connect** : Espace d'authentification avec gestion de la connexion et de l'inscription.
  - **Menu** : Accès rapide à d'autres fonctionnalités (ex : modal d'information).
- **Design moderne** : Utilisation d'images, d'icônes personnalisées et de styles adaptés pour une expérience utilisateur agréable.
- **Responsive** : Adapté aux différentes tailles d'écran, notamment iPhone 16 Pro Max.

## Structure du projet

```
my-app/
  app/
    (tabs)/
      _layout.tsx         # Configuration de la navigation par onglets
      index.tsx           # Écran d'accueil
      Dashboard.tsx       # Dashboard principal
      Product.jsx         # Détail/statistiques d'une plante
      Connect.jsx         # Authentification (connexion/inscription)
    authen/
      authen.tsx          # Écran d'authentification
    styles/
      ...                 # Fichiers de styles pour chaque écran
    assets/
      images/             # Images utilisées dans l'app
      fonts/              # Polices personnalisées
    components/           # Composants réutilisables
    constants/            # Constantes globales (ex: couleurs)
    _layout.tsx           # Layout principal (Stack navigation)
    +html.tsx             # Configuration web (Expo Router)
    +not-found.tsx        # Page 404 personnalisée
  package.json
  app.json
  tsconfig.json
  ...
```

## Installation

1. **Cloner le repo**  
   ```bash
   git clone <url-du-repo>
   cd App_GreenHouse/my-app
   ```

2. **Installer les dépendances**  
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Lancer l'application**  
   ```bash
   npx run ios
   ```

4. **Ouvrir sur un simulateur ou un appareil physique**  
   - Scanner le QR code avec l'app Expo Go
   - Ou lancer sur un simulateur iOS/Android

## Technologies utilisées

- **React Native** (Expo)
- **Expo Router** pour la navigation
- **TypeScript** (partiel)
- **React Native Reanimated**
- **expo-font** pour la gestion des polices
- **@expo/vector-icons** pour les icônes

## Personnalisation

- Les images sont dans `assets/images/`
- Les styles sont dans `app/styles/`
- Les composants réutilisables sont dans `components/`

## Scripts utiles

- `npm start` : Démarre le serveur Expo
- `npm run android` : Lance sur un simulateur Android
- `npm run ios` : Lance sur un simulateur iOS
- `npm run web` : Lance la version web

## Contribution

1. Fork le projet
2. Crée une branche (`git checkout -b feature/ma-feature`)
3. Commit tes changements (`git commit -am 'Ajout d'une feature'`)
4. Push la branche (`git push origin feature/ma-feature`)
5. Ouvre une Pull Request
