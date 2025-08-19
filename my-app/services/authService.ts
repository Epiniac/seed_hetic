import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/environment';

const API_BASE_URL = config.API_BASE_URL;

interface User {
  id: string;
  email: string;
  name: string;
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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de l\'inscription');
      }

      // Sauvegarder le token
      await AsyncStorage.setItem('token', result.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Connexion
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la connexion');
      }

      // Sauvegarder le token
      await AsyncStorage.setItem('token', result.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));

      return result;
    } catch (error) {
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
}

export default new AuthService();
