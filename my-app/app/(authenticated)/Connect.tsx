import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/Connect.styles';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthActions } from '../../hooks/useAuthActions';

export default function ConnectScreen() {
  const { user, updateAvatar } = useAuth();
  const { handleLogout } = useAuthActions();
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  useEffect(() => {
    console.log('👤 Utilisateur connecté:', user ? user.name + ' (' + user.email + ')' : 'Non connecté');
  }, [user]);

  const pickImage = async () => {
    try {
      // Demander les permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission requise',
          'Vous devez autoriser l\'accès à vos photos pour changer votre photo de profil.'
        );
        return;
      }

      // Ouvrir la galerie
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUpdatingAvatar(true);
        
        // Convertir l'image en base64 pour l'upload
        const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
        
        try {
          await updateAvatar(imageUri);
          Alert.alert('Succès', 'Votre photo de profil a été mise à jour avec succès !');
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'avatar:', error);
          Alert.alert(
            'Erreur',
            'Impossible de mettre à jour votre photo de profil. Veuillez réessayer.'
          );
        } finally {
          setIsUpdatingAvatar(false);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
      setIsUpdatingAvatar(false);
    }
  };

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
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          <Image 
            source={
              user?.avatar 
                ? { uri: user.avatar }
                : require('../../assets/images/Profil.png')
            } 
            style={styles.profileImage} 
          />
          <View style={styles.editOverlay}>
            <Image 
              source={require('../../assets/images/Edit.png')}
              style={styles.editIcon}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.profileName}>{user?.name || 'Utilisateur'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
        
        <TouchableOpacity 
          onPress={pickImage} 
          style={[styles.editAvatarButton, isUpdatingAvatar && styles.disabledButton]}
          disabled={isUpdatingAvatar}
        >
          <Text style={styles.editAvatarButtonText}>
            {isUpdatingAvatar ? 'Mise à jour...' : 'Modifier photo de profil'}
          </Text>
        </TouchableOpacity>
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
