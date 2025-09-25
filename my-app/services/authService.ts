import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/environment';

const API_BASE_URL = config.API_BASE_URL;

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  // Inscription
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Tentative d\'inscription vers:', `${API_BASE_URL}/auth/register`);
      
      // Créer un AbortController pour gérer le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'inscription');
      }

      // Sauvegarder le token
      await AsyncStorage.setItem('token', result.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));

      return result;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error(`Impossible de se connecter au serveur. Vérifiez que le serveur est démarré et accessible à l'adresse: ${API_BASE_URL}`);
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La connexion au serveur a expiré. Veuillez réessayer.');
      }
      
      throw error;
    }
  }

  // Connexion
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('Tentative de connexion vers:', `${API_BASE_URL}/auth/login`);
      
      // Créer un AbortController pour gérer le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la connexion');
      }

      // Sauvegarder le token
      await AsyncStorage.setItem('token', result.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));

      return result;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error(`Impossible de se connecter au serveur. Vérifiez que le serveur est démarré et accessible à l'adresse: ${API_BASE_URL}`);
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La connexion au serveur a expiré. Veuillez réessayer.');
      }
      
      throw error;
    }
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  // Récupérer le token stocké
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  // Récupérer l'utilisateur stocké
  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  // Vérifier si l'utilisateur est connecté
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Récupérer le profil depuis le serveur
  async getProfile(): Promise<User> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error('Token non trouvé');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la récupération du profil');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour l'avatar de l'utilisateur
  async updateAvatar(avatar: string): Promise<User> {
    try {
      console.log('🔄 Début update avatar...');
      const token = await this.getToken();
      if (!token) {
        throw new Error('Token non trouvé');
      }

      console.log('🔑 Token trouvé, envoi vers:', `${API_BASE_URL}/auth/avatar`);
      console.log('📸 Taille avatar:', avatar.length, 'caractères');

      const response = await fetch(`${API_BASE_URL}/auth/avatar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar }),
      });

      console.log('📊 Statut réponse:', response.status);

      const result = await response.json();
      console.log('📄 Réponse serveur:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour de l\'avatar');
      }

      // Mettre à jour l'utilisateur en local
      await AsyncStorage.setItem('user', JSON.stringify(result.user));

      console.log('✅ Avatar mis à jour avec succès');
      return result.user;
    } catch (error) {
      console.error('❌ Erreur updateAvatar:', error);
      throw error;
    }
  }
}

export default new AuthService();
