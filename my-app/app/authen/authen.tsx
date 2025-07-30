import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../styles/authen.styles';
import { useRouter } from 'expo-router';

export default function AuthenScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      
      {/* Header Row: Return icon + Title */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <Image source={require('../../assets/images/Return.png')} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Authentification</Text>
        <View style={styles.headerIcon} />
      </View>

      {/* Illustration avec les images de la maquette */}
      <View style={styles.illustrationContainer}>
        <Image source={require('../../assets/images/Authen.jpg')} style={styles.illustration} />
      </View>
      {/* Headline */}
      <Text style={styles.headline}>Gardez le contrôle</Text>
      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Petit blabla pour faire comprendre à l’utilisateur qu’en se connectant, il aura accès à toutes ses plantes de n’importe où.
      </Text>
      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/Connect')}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      {/* Bottom Bar (if needed) */}
      <View style={styles.bottomBar}>
        {/* Add icons or images as needed */}
      </View>
    </View>
  );
} 