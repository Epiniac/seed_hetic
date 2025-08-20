/**
 * Composant de test pour diagnostiquer les problèmes d'authentification
 * À utiliser temporairement pour déboguer
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import AuthDebugService from '../services/authDebugService';
import { useAuth } from '../contexts/AuthContext';

export const AuthDebugComponent: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const { user, isAuthenticated, logout } = useAuth();

  const handleGetDebugInfo = async () => {
    try {
      const info = await AuthDebugService.getDebugInfo();
      setDebugInfo(info);
      console.log('Debug info récupéré:', info);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les infos de débogage');
    }
  };

  const handleRunDiagnostic = async () => {
    try {
      const foundIssues = await AuthDebugService.runDiagnostic();
      setIssues(foundIssues);
      if (foundIssues.length === 0) {
        Alert.alert('Diagnostic', 'Aucun problème détecté ✅');
      } else {
        Alert.alert('Diagnostic', `${foundIssues.length} problème(s) détecté(s)`);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de faire le diagnostic');
    }
  };

  const handleClearAuthData = async () => {
    Alert.alert(
      'Nettoyer les données',
      'Cela va supprimer toutes les données d\'authentification. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Nettoyer',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthDebugService.clearAllAuthData();
              await logout(); // Déconnecter également du contexte
              Alert.alert('Succès', 'Données d\'authentification nettoyées');
              setDebugInfo(null);
              setIssues([]);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de nettoyer les données');
            }
          }
        }
      ]
    );
  };

  const handleAutoFix = async () => {
    Alert.alert(
      'Réparation automatique',
      'Cela va nettoyer et réparer automatiquement les problèmes détectés. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réparer',
          onPress: async () => {
            try {
              await AuthDebugService.autoFix();
              await logout(); // Déconnecter également du contexte
              Alert.alert('Succès', 'Problèmes réparés. Vous devez vous reconnecter.');
              setDebugInfo(null);
              setIssues([]);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de réparer automatiquement');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔍 Débogage Authentification</Text>
      
      {/* État actuel du contexte */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>État du contexte Auth</Text>
        <Text>Connecté: {isAuthenticated ? '✅ Oui' : '❌ Non'}</Text>
        <Text>Utilisateur: {user ? `${user.name} (${user.email})` : 'Aucun'}</Text>
        <Text>ID utilisateur: {user?.id || 'Aucun'}</Text>
      </View>

      {/* Boutons d'action */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={handleGetDebugInfo}>
          <Text style={styles.buttonText}>Récupérer infos de débogage</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleRunDiagnostic}>
          <Text style={styles.buttonText}>Faire un diagnostic</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={handleClearAuthData}>
          <Text style={styles.buttonText}>Nettoyer données auth</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleAutoFix}>
          <Text style={styles.buttonText}>Réparation automatique</Text>
        </TouchableOpacity>
      </View>

      {/* Affichage des informations de débogage */}
      {debugInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations AsyncStorage</Text>
          <Text>Token stocké: {debugInfo.storedToken ? '✅ Présent' : '❌ Absent'}</Text>
          <Text>Utilisateur stocké: {debugInfo.storedUser ? '✅ Présent' : '❌ Absent'}</Text>
          {debugInfo.storedUser && (
            <>
              <Text>  Email: {debugInfo.storedUser.email}</Text>
              <Text>  ID: {debugInfo.storedUser.id}</Text>
              <Text>  Nom: {debugInfo.storedUser.name}</Text>
            </>
          )}
          <Text>Authentifié: {debugInfo.isAuthenticated ? '✅ Oui' : '❌ Non'}</Text>
          <Text>Clés auth: {debugInfo.authRelatedKeys.join(', ') || 'Aucune'}</Text>
        </View>
      )}

      {/* Affichage des problèmes détectés */}
      {issues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Problèmes détectés</Text>
          {issues.map((issue, index) => (
            <Text key={index} style={styles.issueText}>• {issue}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  warningButton: {
    backgroundColor: '#FF9500',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  issueText: {
    color: '#FF3B30',
    marginBottom: 5,
  },
});

export default AuthDebugComponent;
