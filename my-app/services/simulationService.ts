/**
 * Service pour simuler des changements de statut de plantes (pour test)
 * À supprimer une fois que les vrais capteurs sont connectés
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
 * Simuler des données de capteurs pour déclencher un changement de statut
 */
export const simulateStatusChange = async (plantId: string, simulationType: 'drought' | 'temperature' | 'healthy' | 'cold' | 'moderate-dry') => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Utilisateur non connecté');
    }

    let sensorData;
    
    switch (simulationType) {
      case 'drought':
        // Simuler une humidité très faible
        sensorData = {
          humidity: {
            value: Math.floor(Math.random() * 20) + 10, // 10-29%
            unit: '%'
          },
          temperature: {
            value: 22,
            unit: '°C'
          }
        };
        break;

      case 'moderate-dry':
        // Simuler une humidité modérément basse
        sensorData = {
          humidity: {
            value: Math.floor(Math.random() * 15) + 35, // 35-49%
            unit: '%'
          },
          temperature: {
            value: 23,
            unit: '°C'
          }
        };
        break;
        
      case 'temperature':
        // Simuler une température trop élevée
        sensorData = {
          temperature: {
            value: Math.floor(Math.random() * 10) + 35, // 35-44°C
            unit: '°C'
          },
          humidity: {
            value: 60,
            unit: '%'
          }
        };
        break;

      case 'cold':
        // Simuler une température trop basse
        sensorData = {
          temperature: {
            value: Math.floor(Math.random() * 5) + 5, // 5-9°C
            unit: '°C'
          },
          humidity: {
            value: 55,
            unit: '%'
          }
        };
        break;
        
      case 'healthy':
        // Simuler des valeurs optimales
        sensorData = {
          temperature: {
            value: Math.floor(Math.random() * 6) + 20, // 20-25°C
            unit: '°C'
          },
          humidity: {
            value: Math.floor(Math.random() * 20) + 50, // 50-69%
            unit: '%'
          }
        };
        break;
        
      default:
        throw new Error('Type de simulation non reconnu');
    }

    console.log('Envoi des données de simulation:', sensorData);

    const response = await fetch(`${BACKEND_URL}/api/plants/${plantId}/stats`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(sensorData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur réponse serveur:', errorText);
      throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Réponse du serveur:', result);
    return result;
  } catch (error) {
    console.error('Erreur lors de la simulation:', error);
    throw error;
  }
};
