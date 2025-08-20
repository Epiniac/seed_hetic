/**
 * Service pour l'API du catalogue de plantes interne
 * Remplace l'API Perenual par notre propre base de données
 */

import { BACKEND_URL } from '../config/environment';

// Types pour compatibilité avec l'interface existante
export interface PlantImage {
  thumbnail?: string;
  small_url?: string;
  regular_url?: string;
}

export interface PlantSpecies {
  id: string; // Changé de number à string pour MongoDB ObjectId
  common_name: string;
  scientific_name: string[];
  description?: string;
  default_image: PlantImage | null;
  care_info?: {
    watering: string;
    temperature: any;
    humidity: any;
  };
}

export interface PlantDetails extends PlantSpecies {
  type: string;
  cycle: string;
  watering: string;
  maintenance: string;
  care_instructions?: {
    watering: any;
    temperature: any;
    humidity: any;
  };
  planting_date?: string;
  status?: string;
  notes?: any[];
}

export interface ApiResponse<T> {
  data: T[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  // Propriétés pour compatibilité avec l'interface Perenual existante
  to?: number;
  per_page?: number;
  current_page?: number;
  from?: number;
  last_page?: number;
  total?: number;
}

/**
 * Recherche des plantes dans le catalogue interne
 * @param query - Le terme de recherche
 * @param page - Numéro de page (optionnel, défaut: 1)
 * @param perPage - Nombre de résultats par page (optionnel, défaut: 10)
 * @returns Promise avec les résultats de recherche
 */
export async function searchPlants(
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<ApiResponse<PlantSpecies>> {
  try {
    const url = `${BACKEND_URL}/api/plant-catalog/search?q=${encodeURIComponent(query)}&page=${page}&limit=${perPage}`;
    
    console.log('Recherche dans le catalogue interne:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Adapter la réponse pour correspondre au format attendu
    return {
      data: data.data,
      // Adapter pagination pour correspondre au format Perenual
      to: data.pagination?.to || data.data.length,
      per_page: data.pagination?.per_page || perPage,
      current_page: data.pagination?.current_page || page,
      from: data.pagination?.from || 1,
      last_page: data.pagination?.last_page || 1,
      total: data.pagination?.total || data.data.length,
    };
  } catch (error) {
    console.error('Erreur lors de la recherche de plantes internes:', error);
    throw error;
  }
}

/**
 * Obtient les détails d'une plante spécifique
 * @param plantId - ID de la plante (string pour MongoDB)
 * @returns Promise avec les détails de la plante
 */
export async function getPlantDetails(plantId: string | number): Promise<PlantDetails> {
  try {
    const url = `${BACKEND_URL}/api/plant-catalog/${plantId}`;
    
    console.log('Récupération des détails de la plante:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la plante:', error);
    throw error;
  }
}

/**
 * Recherche des plantes avec filtres (version simplifiée pour notre BDD)
 * @param options - Options de recherche
 * @returns Promise avec les résultats filtrés
 */
export async function searchPlantsWithFilters(options: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PlantSpecies>> {
  return searchPlants(options.query || '', options.page || 1, options.limit || 10);
}

/**
 * Obtient une liste de plantes populaires/récentes
 * @param page - Numéro de page
 * @param limit - Nombre de résultats
 * @returns Promise avec les plantes populaires
 */
export async function getPopularPlants(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PlantSpecies>> {
  try {
    const url = `${BACKEND_URL}/api/plant-catalog/popular?limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      data: data.data,
      to: data.data.length,
      per_page: limit,
      current_page: page,
      from: 1,
      last_page: 1,
      total: data.data.length,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des plantes populaires:', error);
    throw error;
  }
}

/**
 * Test de connectivité avec l'API interne
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Erreur de connexion à l\'API interne:', error);
    return false;
  }
}
