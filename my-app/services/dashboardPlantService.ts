/**
 * Service pour gérer les plantes du dashboard (collection Plant)
 */

import { BACKEND_URL } from '../config/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Récupérer le token d'authentification
 */
async function getAuthToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
}

/**
 * Récupérer toutes les plantes de l'utilisateur dans le dashboard
 */
export const getDashboardPlants = async () => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.warn('Utilisateur non connecté');
      return [];
    }

    const response = await fetch(`${BACKEND_URL}/api/plants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des plantes du dashboard:', error);
    return [];
  }
};

/**
 * Récupérer une plante spécifique du dashboard
 */
export const getDashboardPlant = async (plantId: string) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.warn('Utilisateur non connecté');
      return null;
    }

    const response = await fetch(`${BACKEND_URL}/api/plants/${plantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la plante:', error);
    return null;
  }
};

/**
 * Supprimer une plante du dashboard
 */
export const removeDashboardPlant = async (plantId: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Utilisateur non connecté');
    }

    const response = await fetch(`${BACKEND_URL}/api/plants/${plantId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la plante:', error);
    throw error;
  }
};
