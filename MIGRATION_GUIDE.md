# 🌱 Système de Recherche de Plantes Interne - Guide de Migration

## ✅ Ce qui a été implémenté

### 1. **API Backend Complète**
- **Nouveau modèle `PlantCatalog`** pour stocker les plantes du catalogue
- **Routes API** pour la recherche, détails, et plantes populaires
- **8 plantes d'exemple** ajoutées au catalogue (Basilic, Menthe, Monstera, etc.)
- **API testée et fonctionnelle** sur `http://localhost:3001`

### 2. **Services Frontend**
- **`internalPlantApi.ts`** : Service pour votre API interne
- **`unifiedPlantApi.ts`** : Service unifié qui peut basculer entre API externe/interne
- **`userLibraryService.ts`** : Service de bibliothèque utilisateur avec authentification
- **Routes utilisateur** pour gérer la bibliothèque personnelle

### 3. **Composant PlantSearch Modifié**
- Compatible avec votre nouvelle API interne
- Gestion des types MongoDB (ObjectId)
- Intégration avec le système d'authentification

## 🔧 Configuration Actuelle

### Serveur Backend
- **Port** : 3001
- **Base de données** : MongoDB Atlas (connectée)
- **Collections** : 
  - `plantcatalogs` : 8 plantes dans le catalogue
  - `users` : Gestion des bibliothèques utilisateur

### Frontend
- **API actuelle** : Configurée pour utiliser l'API interne
- **URL Backend** : `http://192.168.1.35:3001`
- **Services** : Prêts à être utilisés

## 🧪 Tests Effectués

### API Backend ✅
```bash
# Test de santé
curl http://localhost:3001/api/health

# Recherche générale (8 plantes trouvées)
curl http://localhost:3001/api/plant-catalog/search

# Recherche spécifique (basilic trouvé)
curl http://localhost:3001/api/plant-catalog/search?q=basilic

# Détails d'une plante
curl http://localhost:3001/api/plant-catalog/68a4e75a6091e0689a559f62
```

## 🚀 Prochaines Étapes

### 1. **Tester dans votre App React Native**

```typescript
// Dans un composant ou écran de test
import { runAllTests } from '../services/testAPI';

const TestScreen = () => {
  const handleTest = async () => {
    const success = await runAllTests();
    console.log('Tests réussis:', success);
  };
  
  return (
    <Button title="Tester l'API Interne" onPress={handleTest} />
  );
};
```

### 2. **Vérifier PlantSearch**
Votre composant `PlantSearch` devrait maintenant :
- Rechercher dans vos 8 plantes du catalogue
- Afficher les résultats avec images et informations
- Permettre d'ajouter/supprimer de la bibliothèque utilisateur

### 3. **Ajouter Plus de Plantes**
```bash
# Relancer le script de peuplement avec plus de plantes
cd /Users/jim/seed_hetic/server
node seedCatalog.js
```

## 📋 Fonctionnalités Disponibles

### ✅ Implémentées
- [x] Recherche dans le catalogue de plantes
- [x] Affichage des détails de plante
- [x] Gestion de bibliothèque utilisateur
- [x] Authentification pour la bibliothèque
- [x] Fallback vers stockage local si non connecté
- [x] API compatible avec le format existant

### 🔄 Basculement d'API
Pour changer entre API externe et interne, modifiez dans `unifiedPlantApi.ts` :
```typescript
const USE_INTERNAL_API = true; // true = votre BDD, false = API Perenual
```

## 🎯 Avantages du Nouveau Système

1. **Contrôle Total** : Vous gérez vos propres plantes
2. **Pas de Limite d'API** : Plus de restrictions de quota
3. **Données Personnalisées** : Ajoutez vos propres informations
4. **Intégration Utilisateur** : Bibliothèque liée aux comptes
5. **Performance** : Pas de dépendance externe

## 🔍 Debug et Dépannage

### Vérifier la Connectivité
```typescript
import { testApiConnection } from '../services/unifiedPlantApi';

const checkAPI = async () => {
  const result = await testApiConnection();
  console.log('API interne:', result.internal);
  console.log('API externe:', result.external);
};
```

### Logs Utiles
- Serveur : Logs dans le terminal où vous avez lancé `npm start`
- Frontend : Console du métro bundler et logs de l'émulateur

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que le serveur tourne sur le port 3001
2. Confirmez que l'IP dans `environment.ts` est correcte
3. Testez les routes API avec curl
4. Vérifiez les logs du serveur pour les erreurs
