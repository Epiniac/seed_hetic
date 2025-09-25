/**
 * Service pour gérer les notifications
 */

import { BACKEND_URL } from '../config/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  _id: string;
  user: string;
  plant: {
    _id: string;
    name: string;
    species: string;
  };
  type: 'arrosage' | 'temperature' | 'humidité' | 'generale';
  title: string;
  message: string;
  priority: 'faible' | 'moyen' | 'élevé' | 'high' | 'medium' | 'low';
  isRead: boolean;
  actionRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

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
 * Récupérer toutes les notifications de l'utilisateur
 */
export const getNotifications = async (unreadOnly: boolean = false): Promise<Notification[]> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      console.warn('Utilisateur non connecté');
      return [];
    }

    const url = `${BACKEND_URL}/api/notifications${unreadOnly ? '?unreadOnly=true' : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const notifications = await response.json();
    return notifications || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return [];
  }
};

/**
 * Marquer une notification comme lue
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Utilisateur non connecté');
    }

    const response = await fetch(`${BACKEND_URL}/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    throw error;
  }
};

/**
 * Marquer toutes les notifications comme lues
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Utilisateur non connecté');
    }

    const response = await fetch(`${BACKEND_URL}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors du marquage des notifications:', error);
    throw error;
  }
};

/**
 * Obtenir l'icône selon le type de notification
 */
export const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'arrosage':
      return '💧';
    case 'temperature':
      return '🌡️';
    case 'humidité':
      return '💨';
    case 'generale':
      return '🌱';
    default:
      return '⚠️';
  }
};

/**
 * Obtenir la couleur selon la priorité
 */
export const getNotificationColor = (priority: string): string => {
  switch (priority) {
    case 'faible':
    case 'low':
      return '#26CB66'; // Vert
    case 'moyen':
    case 'medium':
      return '#FF8C00'; // Orange
    case 'élevé':
    case 'high':
      return '#FF4444'; // Rouge
    default:
      return '#FF8C00';
  }
};
