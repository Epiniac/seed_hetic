import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/Connect.styles';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthActions } from '../../hooks/useAuthActions';

export default function ConnectScreen() {
  const { user } = useAuth();
  const { handleLogout } = useAuthActions();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <View style={styles.headerIcon} />
      </View>

      {/* Profil utilisateur */}
      <View style={styles.profileContainer}>
        <Image 
          source={require('../../assets/images/Profil.png')} 
          style={styles.profileImage} 
        />
        <Text style={styles.profileName}>{user?.name || 'Utilisateur'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
      </View>

      {/* Informations supplémentaires */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Bienvenue dans votre jardin connecté !</Text>
        <Text style={styles.infoText}>
          Vous êtes maintenant connecté et pouvez accéder à toutes vos plantes depuis n'importe où.
        </Text>
      </View>

      {/* Bouton de déconnexion */}
      <View style={styles.buttonContainerCustom}>
        <TouchableOpacity 
          style={[styles.loginButtonCustom, styles.logoutButton]} 
          onPress={handleLogout}
        >
          <Text style={[styles.loginButtonText, styles.logoutButtonText]}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
