/**
 * Service de bibliothèque utilisateur - Version avec authentification
 * Remplace AsyncStorage par un système basé sur l'utilisateur connecté
 */

import { BACKEND_URL } from '../config/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types pour la compatibilité
export interface LibraryPlant {
  id: string; // MongoDB ObjectId
  common_name: string;
  scientific_name: string[];
  default_image?: {
    thumbnail?: string;
    small_url?: string;
    regular_url?: string;
  } | null;
  addedAt: string;
  daysToHarvest?: string;
  // Informations supplémentaires pour les plantes internes
  care_info?: {
    watering: string;
    temperature: any;
    humidity: any;
  };
  status?: string;
}

/**
 * Récupérer le token d'authentification
 */
async function getAuthToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('@auth_token');
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
}

/**
 * Ajouter une plante à la bibliothèque de l'utilisateur connecté
 */
export const addToLibrary = async (plant: Omit<LibraryPlant, 'addedAt'>): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.warn('Utilisateur non connecté - utilisation du stockage local');
      return addToLocalLibrary(plant);
    }

    const response = await fetch(`${BACKEND_URL}/api/users/library`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        plantId: plant.id,
        plantData: {
          ...plant,
          addedAt: new Date().toISOString()
        }
      }),
    });

    if (response.status === 409) {
      // Plante déjà dans la bibliothèque
      return false;
    }

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la bibliothèque:', error);
    // Fallback vers le stockage local
    return addToLocalLibrary(plant);
  }
};

/**
 * Récupérer la bibliothèque de l'utilisateur connecté
 */
export const getLibrary = async (): Promise<LibraryPlant[]> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.warn('Utilisateur non connecté - utilisation du stockage local');
      return getLocalLibrary();
    }

    const response = await fetch(`${BACKEND_URL}/api/users/library`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.library || [];
  } catch (error) {
    console.error('Erreur lors de la récupération de la bibliothèque:', error);
    // Fallback vers le stockage local
    return getLocalLibrary();
  }
};

/**
 * Supprimer une plante de la bibliothèque
 */
export const removeFromLibrary = async (plantId: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.warn('Utilisateur non connecté - utilisation du stockage local');
      return removeFromLocalLibrary(plantId);
    }

    const response = await fetch(`${BACKEND_URL}/api/users/library/${plantId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la bibliothèque:', error);
    // Fallback vers le stockage local
    return removeFromLocalLibrary(plantId);
  }
};

/**
 * Vérifier si une plante est dans la bibliothèque
 */
export const isInLibrary = async (plantId: string): Promise<boolean> => {
  try {
    const library = await getLibrary();
    return library.some(plant => plant.id === plantId);
  } catch (error) {
    console.error('Erreur lors de la vérification de la bibliothèque:', error);
    return false;
  }
};

/**
 * Obtenir le nombre de plantes dans la bibliothèque
 */
export const getLibraryCount = async (): Promise<number> => {
  try {
    const library = await getLibrary();
    return library.length;
  } catch (error) {
    console.error('Erreur lors du comptage de la bibliothèque:', error);
    return 0;
  }
};

/**
 * Effacer toute la bibliothèque
 */
export const clearLibrary = async (): Promise<void> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return clearLocalLibrary();
    }

    const response = await fetch(`${BACKEND_URL}/api/users/library`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'effacement de la bibliothèque:', error);
    return clearLocalLibrary();
  }
};

// ========================================
// FONCTIONS DE FALLBACK (STOCKAGE LOCAL)
// ========================================

const LIBRARY_STORAGE_KEY = '@plant_library';

async function addToLocalLibrary(plant: Omit<LibraryPlant, 'addedAt'>): Promise<boolean> {
  try {
    const existingLibrary = await getLocalLibrary();
    
    const isAlreadyInLibrary = existingLibrary.some(p => p.id === plant.id);
    if (isAlreadyInLibrary) {
      return false;
    }
    
    const newPlant: LibraryPlant = {
      ...plant,
      addedAt: new Date().toISOString(),
      daysToHarvest: plant.daysToHarvest || '5 days'
    };
    
    const updatedLibrary = [...existingLibrary, newPlant];
    await AsyncStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(updatedLibrary));
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la bibliothèque locale:', error);
    throw error;
  }
}

async function getLocalLibrary(): Promise<LibraryPlant[]> {
  try {
    const libraryData = await AsyncStorage.getItem(LIBRARY_STORAGE_KEY);
    return libraryData ? JSON.parse(libraryData) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération de la bibliothèque locale:', error);
    return [];
  }
}

async function removeFromLocalLibrary(plantId: string): Promise<void> {
  try {
    const existingLibrary = await getLocalLibrary();
    const updatedLibrary = existingLibrary.filter(plant => plant.id !== plantId);
    await AsyncStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(updatedLibrary));
  } catch (error) {
    console.error('Erreur lors de la suppression de la bibliothèque locale:', error);
    throw error;
  }
}

async function clearLocalLibrary(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LIBRARY_STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de l\'effacement de la bibliothèque locale:', error);
    throw error;
  }
}
