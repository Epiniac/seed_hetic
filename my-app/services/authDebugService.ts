/**
 * Service de débogage pour l'authentification
 * Utilisé pour diagnostiquer et résoudre les problèmes d'authentification
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from './authService';

interface DebugInfo {
  storedToken: string | null;
  storedUser: any;
  isAuthenticated: boolean;
  allKeys: readonly string[];
  authRelatedKeys: string[];
}

export class AuthDebugService {
  /**
   * Récupérer toutes les informations de débogage
   */
  static async getDebugInfo(): Promise<DebugInfo> {
    try {
      // Récupérer le token et l'utilisateur stockés
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserString = await AsyncStorage.getItem('user');
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      
      // Vérifier l'état d'authentification
      const isAuthenticated = await authService.isAuthenticated();
      
      // Récupérer toutes les clés de AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
      
      // Filtrer les clés liées à l'authentification
      const authRelatedKeys = allKeys.filter(key => 
        key.includes('token') || 
        key.includes('user') || 
        key.includes('auth') ||
        key.includes('@')
      );

      return {
        storedToken,
        storedUser,
        isAuthenticated,
        allKeys,
        authRelatedKeys
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des infos de débogage:', error);
      throw error;
    }
  }

  /**
   * Nettoyer complètement toutes les données d'authentification
   */
  static async clearAllAuthData(): Promise<void> {
    try {
      console.log('🧹 Nettoyage complet des données d\'authentification...');
      
      // Récupérer toutes les clés
      const allKeys = await AsyncStorage.getAllKeys();
      
      // Identifier toutes les clés potentiellement liées à l'authentification
      const authKeys = allKeys.filter(key => 
        key.includes('token') || 
        key.includes('user') || 
        key.includes('auth') ||
        key.includes('@auth') ||
        key.includes('@user') ||
        key === 'token' ||
        key === 'user'
      );

      console.log('🔍 Clés d\'authentification trouvées:', authKeys);

      // Supprimer toutes les clés d'authentification
      if (authKeys.length > 0) {
        await AsyncStorage.multiRemove(authKeys);
        console.log('✅ Données d\'authentification supprimées:', authKeys);
      } else {
        console.log('ℹ️ Aucune donnée d\'authentification à supprimer');
      }

      // Déconnexion via le service d'authentification
      await authService.logout();
      
      console.log('✨ Nettoyage terminé');
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
      throw error;
    }
  }

  /**
   * Afficher les informations de débogage dans la console
   */
  static async logDebugInfo(): Promise<void> {
    try {
      const info = await this.getDebugInfo();
      
      console.log('🔍 === INFORMATIONS DE DÉBOGAGE AUTHENTIFICATION ===');
      console.log('📱 Token stocké:', info.storedToken ? 'Présent ✅' : 'Absent ❌');
      if (info.storedToken) {
        // Afficher seulement les premiers/derniers caractères du token pour sécurité
        const tokenPreview = info.storedToken.length > 20 
          ? `${info.storedToken.substring(0, 10)}...${info.storedToken.substring(info.storedToken.length - 10)}`
          : info.storedToken;
        console.log('🔑 Aperçu du token:', tokenPreview);
      }
      
      console.log('👤 Utilisateur stocké:', info.storedUser ? 'Présent ✅' : 'Absent ❌');
      if (info.storedUser) {
        console.log('   📧 Email:', info.storedUser.email);
        console.log('   🆔 ID:', info.storedUser.id);
        console.log('   📛 Nom:', info.storedUser.name);
      }
      
      console.log('🔐 État authentification:', info.isAuthenticated ? 'Connecté ✅' : 'Déconnecté ❌');
      console.log('🗄️ Clés AsyncStorage liées à l\'auth:', info.authRelatedKeys);
      console.log('📋 Toutes les clés AsyncStorage:', info.allKeys.length, 'clés au total');
      console.log('🔍 === FIN DES INFORMATIONS DE DÉBOGAGE ===');
    } catch (error) {
      console.error('❌ Erreur lors de l\'affichage des infos de débogage:', error);
    }
  }

  /**
   * Diagnostic rapide pour identifier les problèmes
   */
  static async runDiagnostic(): Promise<string[]> {
    try {
      const issues: string[] = [];
      const info = await this.getDebugInfo();

      // Vérifier les incohérences
      if (!info.storedToken && info.isAuthenticated) {
        issues.push('Token manquant mais utilisateur marqué comme connecté');
      }

      if (info.storedToken && !info.isAuthenticated) {
        issues.push('Token présent mais utilisateur marqué comme déconnecté');
      }

      if (!info.storedToken && !info.storedUser) {
        issues.push('Aucune donnée d\'authentification trouvée');
      }

      if (info.storedToken && !info.storedUser) {
        issues.push('Token présent mais données utilisateur manquantes');
      }

      if (!info.storedToken && info.storedUser) {
        issues.push('Données utilisateur présentes mais token manquant');
      }

      // Vérifier la présence d'anciennes clés
      const oldKeys = info.authRelatedKeys.filter(key => 
        key.includes('@auth_token') || 
        key.includes('@user_data')
      );
      if (oldKeys.length > 0) {
        issues.push(`Anciennes clés d'authentification détectées: ${oldKeys.join(', ')}`);
      }

      return issues;
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
      return ['Erreur lors du diagnostic'];
    }
  }

  /**
   * Solution automatique des problèmes détectés
   */
  static async autoFix(): Promise<void> {
    try {
      console.log('🔧 Démarrage de la réparation automatique...');
      
      const issues = await this.runDiagnostic();
      
      if (issues.length === 0) {
        console.log('✅ Aucun problème détecté');
        return;
      }

      console.log('⚠️ Problèmes détectés:', issues);
      
      // Nettoyer toutes les données d'authentification
      await this.clearAllAuthData();
      
      console.log('🔧 Réparation terminée. L\'utilisateur devra se reconnecter.');
    } catch (error) {
      console.error('❌ Erreur lors de la réparation automatique:', error);
      throw error;
    }
  }
}

export default AuthDebugService;
