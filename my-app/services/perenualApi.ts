/**
 * Service pour intégrer l'API Perenual.com
 * Documentation: https://perenual.com/docs/api
 */

import { PERENUAL_API_KEY, PERENUAL_BASE_URL, ERROR_MESSAGES } from '../config/perenual';

// Types pour les réponses de l'API
export interface PlantImage {
  image_id: number;
  license: number;
  license_name: string;
  license_url: string;
  original_url: string;
  regular_url: string;
  medium_url: string;
  small_url: string;
  thumbnail: string;
}

export interface PlantSpecies {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  family: string | null;
  hybrid: boolean | null;
  authority: string | null;
  subspecies: string | null;
  cultivar: string | null;
  variety: string | null;
  species_epithet: string;
  genus: string;
  default_image: PlantImage | null;
}

export interface PlantDetails extends PlantSpecies {
  origin: string | null;
  type: string;
  dimensions: {
    type: string | null;
    min_value: number;
    max_value: number;
    unit: string;
  };
  cycle: string;
  watering: string;
  watering_general_benchmark: {
    value: string;
    unit: string;
  };
  sunlight: string[];
  pruning_month: string[];
  seeds: number;
  attracts: string[];
  propagation: string[];
  hardiness: {
    min: string;
    max: string;
  };
  flowers: boolean;
  flowering_season: string | null;
  fruits: boolean;
  edible_fruit: boolean;
  fruiting_season: string | null;
  harvest_season: string | null;
  leaf: boolean;
  edible_leaf: boolean;
  growth_rate: string;
  maintenance: string;
  medicinal: boolean;
  poisonous_to_humans: boolean;
  poisonous_to_pets: boolean;
  drought_tolerant: boolean;
  salt_tolerant: boolean;
  thorny: boolean;
  invasive: boolean;
  rare: boolean;
  tropical: boolean;
  cuisine: boolean;
  indoor: boolean;
  care_level: string;
  description: string;
  other_images: PlantImage[];
}

export interface ApiResponse<T> {
  data: T[];
  to: number;
  per_page: number;
  current_page: number;
  from: number;
  last_page: number;
  total: number;
}

/**
 * Recherche des plantes par nom
 * @param query - Le terme de recherche
 * @param page - Numéro de page (optionnel, défaut: 1)
 * @param perPage - Nombre de résultats par page (optionnel, défaut: 30)
 * @returns Promise avec les résultats de recherche
 */
export async function searchPlants(
  query: string,
  page: number = 1,
  perPage: number = 30
): Promise<ApiResponse<PlantSpecies>> {
  try {
    const url = `${PERENUAL_BASE_URL}/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la recherche de plantes:', error);
    throw error;
  }
}

/**
 * Obtient les détails d'une plante spécifique
 * @param plantId - ID de la plante
 * @returns Promise avec les détails de la plante
 */
export async function getPlantDetails(plantId: number): Promise<PlantDetails> {
  try {
    const url = `${PERENUAL_BASE_URL}/species/details/${plantId}?key=${PERENUAL_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails:', error);
    throw error;
  }
}

/**
 * Recherche des plantes avec filtres
 * @param options - Options de recherche
 * @returns Promise avec les résultats filtrés
 */
export async function searchPlantsWithFilters(options: {
  query?: string;
  page?: number;
  order?: 'asc' | 'desc';
  edible?: boolean;
  poisonous?: boolean;
  cycle?: 'perennial' | 'annual' | 'biennial' | 'biannual';
  watering?: 'frequent' | 'average' | 'minimum' | 'none';
  sunlight?: 'full_sun' | 'part_shade' | 'full_shade';
  indoor?: boolean;
}): Promise<ApiResponse<PlantSpecies>> {
  try {
    const params = new URLSearchParams({
      key: PERENUAL_API_KEY,
      ...(options.query && { q: options.query }),
      ...(options.page && { page: options.page.toString() }),
      ...(options.order && { order: options.order }),
      ...(options.edible !== undefined && { edible: options.edible ? '1' : '0' }),
      ...(options.poisonous !== undefined && { poisonous: options.poisonous ? '1' : '0' }),
      ...(options.cycle && { cycle: options.cycle }),
      ...(options.watering && { watering: options.watering }),
      ...(options.sunlight && { sunlight: options.sunlight }),
      ...(options.indoor !== undefined && { indoor: options.indoor ? '1' : '0' }),
    });

    const url = `${PERENUAL_BASE_URL}/species-list?${params.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la recherche avec filtres:', error);
    throw error;
  }
}

/**
 * Obtient une liste de plantes populaires/recommandées
 * @param page - Numéro de page
 * @param indoor - Filtrer par plantes d'intérieur
 * @returns Promise avec les plantes populaires
 */
export async function getPopularPlants(
  page: number = 1,
  indoor: boolean = true
): Promise<ApiResponse<PlantSpecies>> {
  try {
    const params = new URLSearchParams({
      key: PERENUAL_API_KEY,
      page: page.toString(),
      order: 'asc',
      indoor: indoor ? '1' : '0',
    });

    const url = `${PERENUAL_BASE_URL}/species-list?${params.toString()}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des plantes populaires:', error);
    throw error;
  }
}
