// Configuration de l'environnement
export const config = {
  // URL de votre serveur backend
  // Pour le développement local, utilisez l'IP de votre machine ou localhost
  API_BASE_URL: __DEV__ 
    ? 'http://192.168.1.35:3001/api' // IP locale de votre machine
    : 'https://votre-domaine-production.com/api',
    
  // Autres configurations
  TIMEOUT: 10000, // 10 secondes
};
