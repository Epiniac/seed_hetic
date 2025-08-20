/**
 * Service de recherche de plantes unifié
 * Peut utiliser soit l'API Perenual externe, soit notre API interne
 */

import * as PerenualApi from './perenualApi';
import * as InternalApi from './internalPlantApi';

// Configuration pour choisir quelle API utiliser
const USE_INTERNAL_API = true; // Changez à true pour utiliser votre BDD

// Types unifiés (compatibles avec les deux APIs)
export type { PlantSpecies, PlantDetails, ApiResponse } from './perenualApi';

/**
 * Recherche des plantes - API unifiée
 */
export async function searchPlants(
  query: string,
  page: number = 1,
  perPage: number = 10
) {
  if (USE_INTERNAL_API) {
    console.log('🌱 Utilisation de l\'API interne pour la recherche');
    return await InternalApi.searchPlants(query, page, perPage);
  } else {
    console.log('🌐 Utilisation de l\'API Perenual externe');
    return await PerenualApi.searchPlants(query, page, perPage);
  }
}

/**
 * Obtenir les détails d'une plante - API unifiée
 */
export async function getPlantDetails(plantId: string | number) {
  if (USE_INTERNAL_API) {
    console.log('🌱 Utilisation de l\'API interne pour les détails');
    return await InternalApi.getPlantDetails(plantId.toString());
  } else {
    console.log('🌐 Utilisation de l\'API Perenual externe');
    return await PerenualApi.getPlantDetails(Number(plantId));
  }
}

/**
 * Recherche avec filtres - API unifiée
 */
export async function searchPlantsWithFilters(options: any) {
  if (USE_INTERNAL_API) {
    return await InternalApi.searchPlantsWithFilters(options);
  } else {
    return await PerenualApi.searchPlantsWithFilters(options);
  }
}

/**
 * Obtenir les plantes populaires - API unifiée
 */
export async function getPopularPlants(page: number = 1, limit: number = 10) {
  if (USE_INTERNAL_API) {
    return await InternalApi.getPopularPlants(page, limit);
  } else {
    return await PerenualApi.getPopularPlants(page, true);
  }
}

/**
 * Test de connectivité
 */
export async function testApiConnection(): Promise<{ internal: boolean; external: boolean }> {
  const [internal, external] = await Promise.allSettled([
    InternalApi.testConnection(),
    // Test simple pour l'API externe (sans clé API)
    fetch('https://perenual.com').then(r => r.ok).catch(() => false)
  ]);
  
  return {
    internal: internal.status === 'fulfilled' ? internal.value : false,
    external: external.status === 'fulfilled' ? external.value : false
  };
}

/**
 * Utilitaire pour basculer entre les APIs
 */
export function setApiMode(useInternal: boolean) {
  console.log(`🔄 Basculement vers l'API ${useInternal ? 'interne' : 'externe'}`);
  // Note: Cette fonction nécessiterait une refactorisation pour être dynamique
  // Pour l'instant, modifiez la constante USE_INTERNAL_API en haut du fichier
}
