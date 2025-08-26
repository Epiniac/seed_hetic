# Fonctionnalité Photo de Profil - Guide d'implémentation

## 📱 Fonctionnalités ajoutées

### Backend (Server)
1. **Modèle User mis à jour** : Le champ `avatar` était déjà présent dans le modèle
2. **Nouvelle route API** : `PUT /api/auth/avatar` pour mettre à jour la photo de profil
3. **Controller mis à jour** : Méthode `updateAvatar` dans `authController.js`
4. **Support images base64** : Limite augmentée à 10MB pour traiter les images

### Frontend (React Native)
1. **Service d'authentification** : Nouvelle méthode `updateAvatar()`
2. **Context Auth** : Nouvelle fonction `updateAvatar` dans le contexte
3. **Interface utilisateur** : Bouton "Modifier photo de profil" dans Connect.tsx
4. **Sélection d'images** : Intégration d'expo-image-picker
5. **Gestion des états** : Loading state pendant l'upload

## 🚀 Comment utiliser

### Pour l'utilisateur :
1. Aller sur l'écran "Mon Profil" (Connect.tsx)
2. Cliquer sur l'image de profil ou sur "Modifier photo de profil"
3. Sélectionner une image depuis la galerie
4. L'image est automatiquement redimensionnée et uploadée

### Technique :
- Les images sont converties en base64 avant l'envoi
- Format carré (aspect ratio 1:1) avec qualité 0.7
- Stockage direct en base64 dans MongoDB
- Affichage automatique de la nouvelle image

## 🛠 API Endpoints

### Mettre à jour l'avatar
```
PUT /api/auth/avatar
Authorization: Bearer <token>
Content-Type: application/json

{
  "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
}
```

### Réponse
```json
{
  "message": "Avatar mis à jour avec succès",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "data:image/jpeg;base64,..."
  }
}
```

## 📋 Tests

Un script de test a été créé (`test-avatar.js`) qui vérifie :
1. L'inscription d'un utilisateur
2. La mise à jour de l'avatar
3. La récupération du profil avec l'avatar

Pour exécuter le test :
```bash
cd /Users/jim/seed_hetic
node test-avatar.js
```

## 🎨 Styles ajoutés

Nouveaux styles dans `Connect.styles.tsx` :
- `profileImageContainer` : Container avec overlay d'édition
- `editOverlay` : Badge d'édition sur l'image
- `editAvatarButton` : Bouton de modification
- `disabledButton` : État désactivé pendant l'upload

## 📦 Dépendances ajoutées

- `expo-image-picker` : Pour la sélection d'images depuis la galerie
- `node-fetch@2` : Pour les tests API (développement uniquement)

## 🔧 Configuration

L'URL API a été mise à jour dans `config/environment.ts` pour pointer vers `localhost:3001`.

## 🚨 Points à noter

1. **Permissions** : L'app demande automatiquement les permissions d'accès à la galerie
2. **Taille des images** : Limite de 10MB côté serveur
3. **Format** : Images converties automatiquement en carré
4. **Stockage** : Base64 directement en MongoDB (pour les petites images)
5. **Fallback** : Image par défaut si aucun avatar n'est défini
6. **URL API** : Pour React Native, utiliser l'IP de la machine au lieu de localhost

## 🛠 Résolution des problèmes

### Erreur "Erreur interne du serveur"
1. **Vérifier l'URL API** : Dans React Native, `localhost` ne fonctionne pas. Utiliser l'IP de votre machine.
2. **Redémarrer le serveur** : Après modification du code backend, redémarrer le serveur.
3. **Vérifier les logs** : Consulter les logs du serveur pour identifier l'erreur exacte.
4. **Token d'authentification** : Vérifier que l'utilisateur est bien connecté.

### Pour déboguer :
```bash
# Récupérer l'IP de votre machine
ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'

# Mettre à jour config/environment.ts avec cette IP
# Exemple: 'http://192.168.1.101:3001/api'
```

## 🔄 Améliorations futures possibles

1. **Stockage cloud** : Utiliser AWS S3 ou Cloudinary au lieu de base64
2. **Compression** : Compression avancée des images
3. **Formats multiples** : Support de différents formats d'image
4. **Crop avancé** : Interface de crop plus sophistiquée
5. **Photo depuis caméra** : Option pour prendre une photo directement
