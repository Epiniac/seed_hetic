/**
 * Service de gestion des plantes favorites
 * Utilise AsyncStorage pour la persistance locale
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Types pour les favoris
export interface FavoritePlant {
  id: number;
  common_name: string;
  scientific_name: string[];
  default_image?: {
    thumbnail: string;
    small_url: string;
  } | null;
  addedAt: string; // Date d'ajout
}

const FAVORITES_STORAGE_KEY = '@plant_favorites';

// ========================================
// FONCTIONS DE GESTION DES FAVORIS
// ========================================

/**
 * Récupérer tous les favoris
 */
export const getFavorites = async (): Promise<FavoritePlant[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    if (favoritesJson) {
      return JSON.parse(favoritesJson);
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    return [];
  }
};

/**
 * Ajouter une plante aux favoris
 */
export const addToFavorites = async (plant: Omit<FavoritePlant, 'addedAt'>): Promise<void> => {
  try {
    const favorites = await getFavorites();
    
    // Vérifier si la plante n'est pas déjà en favoris
    const exists = favorites.find(fav => fav.id === plant.id);
    if (exists) {
      console.log('Plante déjà en favoris');
      return;
    }

    // Ajouter la nouvelle plante avec la date
    const newFavorite: FavoritePlant = {
      ...plant,
      addedAt: new Date().toISOString(),
    };

    const updatedFavorites = [newFavorite, ...favorites]; // Ajouter en premier
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    
    console.log(`Plante "${plant.common_name}" ajoutée aux favoris`);
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
    throw error;
  }
};

/**
 * Retirer une plante des favoris
 */
export const removeFromFavorites = async (plantId: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== plantId);
    
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    console.log(`Plante ID ${plantId} retirée des favoris`);
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris:', error);
    throw error;
  }
};

/**
 * Vérifier si une plante est en favoris
 */
export const isFavorite = async (plantId: number): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.id === plantId);
  } catch (error) {
    console.error('Erreur lors de la vérification des favoris:', error);
    return false;
  }
};

/**
 * Basculer le statut favori d'une plante
 */
export const toggleFavorite = async (plant: Omit<FavoritePlant, 'addedAt'>): Promise<boolean> => {
  try {
    const isCurrentlyFavorite = await isFavorite(plant.id);
    
    if (isCurrentlyFavorite) {
      await removeFromFavorites(plant.id);
      return false; // Plus en favoris
    } else {
      await addToFavorites(plant);
      return true; // Maintenant en favoris
    }
  } catch (error) {
    console.error('Erreur lors du basculement des favoris:', error);
    throw error;
  }
};

/**
 * Compter le nombre de favoris
 */
export const getFavoritesCount = async (): Promise<number> => {
  try {
    const favorites = await getFavorites();
    return favorites.length;
  } catch (error) {
    console.error('Erreur lors du comptage des favoris:', error);
    return 0;
  }
};

/**
 * Vider tous les favoris (utile pour debug/reset)
 */
export const clearAllFavorites = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
    console.log('Tous les favoris ont été supprimés');
  } catch (error) {
    console.error('Erreur lors de la suppression de tous les favoris:', error);
    throw error;
  }
};
