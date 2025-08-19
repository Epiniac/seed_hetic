import AsyncStorage from '@react-native-async-storage/async-storage';

const LIBRARY_STORAGE_KEY = '@plant_library';

export interface LibraryPlant {
  id: number;
  common_name: string;
  scientific_name: string[];
  default_image?: {
    thumbnail?: string;
    small_url?: string;
    regular_url?: string;
  } | null;
  addedAt: string;
  daysToHarvest?: string;
}

// Ajouter une plante à la bibliothèque
export const addToLibrary = async (plant: Omit<LibraryPlant, 'addedAt'>): Promise<boolean> => {
  try {
    const existingLibrary = await getLibrary();
    
    // Vérifier si la plante n'est pas déjà dans la bibliothèque
    const isAlreadyInLibrary = existingLibrary.some(p => p.id === plant.id);
    if (isAlreadyInLibrary) {
      return false; // Déjà dans la bibliothèque
    }
    
    const newPlant: LibraryPlant = {
      ...plant,
      addedAt: new Date().toISOString(),
      daysToHarvest: plant.daysToHarvest || '5 days' // Valeur par défaut
    };
    
    const updatedLibrary = [...existingLibrary, newPlant];
    await AsyncStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(updatedLibrary));
    
    return true; // Ajouté avec succès
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la bibliothèque:', error);
    throw error;
  }
};

// Récupérer toutes les plantes de la bibliothèque
export const getLibrary = async (): Promise<LibraryPlant[]> => {
  try {
    const libraryData = await AsyncStorage.getItem(LIBRARY_STORAGE_KEY);
    return libraryData ? JSON.parse(libraryData) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération de la bibliothèque:', error);
    return [];
  }
};

// Supprimer une plante de la bibliothèque
export const removeFromLibrary = async (plantId: number): Promise<void> => {
  try {
    const existingLibrary = await getLibrary();
    const updatedLibrary = existingLibrary.filter(plant => plant.id !== plantId);
    await AsyncStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(updatedLibrary));
  } catch (error) {
    console.error('Erreur lors de la suppression de la bibliothèque:', error);
    throw error;
  }
};

// Vérifier si une plante est dans la bibliothèque
export const isInLibrary = async (plantId: number): Promise<boolean> => {
  try {
    const library = await getLibrary();
    return library.some(plant => plant.id === plantId);
  } catch (error) {
    console.error('Erreur lors de la vérification de la bibliothèque:', error);
    return false;
  }
};

// Obtenir le nombre de plantes dans la bibliothèque
export const getLibraryCount = async (): Promise<number> => {
  try {
    const library = await getLibrary();
    return library.length;
  } catch (error) {
    console.error('Erreur lors du comptage de la bibliothèque:', error);
    return 0;
  }
};

// Effacer toute la bibliothèque (utile pour les tests)
export const clearLibrary = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LIBRARY_STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de l\'effacement de la bibliothèque:', error);
    throw error;
  }
};
