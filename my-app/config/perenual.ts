/**
 * Configuration pour l'API Perenual
 * 
 * IMPORTANT: 
 * 1. Va sur https://perenual.com/user/developer
 * 2. Inscris-toi gratuitement 
 * 3. Récupère ta clé API
 * 4. Remplace 'YOUR_API_KEY_HERE' par ta vraie clé
 * 5. Ne partage pas cette clé publiquement !
 * * Documentation: https://perenual.com/docs/api
 * * Pour le moment j'ai cette clé sk-UoPY687df4a60ec0f11500 mais je peux demander une autre si besoin
 */

// ⚠️ REMPLACE CETTE VALEUR PAR CLÉ API
export const PERENUAL_API_KEY = 'sk-UoPY687df4a60ec0f11500';



// URLs de base
export const PERENUAL_BASE_URL = 'https://perenual.com/api/v2';

// Configuration par défaut
export const DEFAULT_CONFIG = {
  resultsPerPage: 10,
  searchDebounceMs: 500,
  maxSearchLength: 50,
  minSearchLength: 3,
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Problème de connexion internet',
  API_ERROR: 'Erreur du service de plantes',
  NO_RESULTS: 'Aucune plante trouvée',
  INVALID_KEY: 'Clé API invalide',
  SEARCH_TOO_SHORT: 'Tapez au moins 3 caractères',
};
