# seed_hetic

## Démarrage server.js 

✅ Résumé de ce qui fonctionne maintenant :
✅ Connexion MongoDB : Votre serveur est connecté avec succès à votre cluster MongoDB Atlas
✅ Serveur Express : Tourne sur le port 5000
✅ Variables d'environnement : Chargées correctement
✅ Routes API : Disponibles à /api/auth, /api/plants, /api/notifications


🌐 Testez votre serveur :
Ouvrons le navigateur pour tester l'API :

A ouvert le navigateur simple à http://localhost:5000/api/health

🚀 Comment gérer votre serveur maintenant :
Pour démarrer le serveur : node server.js

Pour arrêter le serveur : ctrl + c 

URLs disponibles :

🏥 Health check : http://localhost:5000/api/health
🔐 Authentification : http://localhost:5000/api/auth
🌱 Plantes : http://localhost:5000/api/plants
🔔 Notifications : http://localhost:5000/api/notifications