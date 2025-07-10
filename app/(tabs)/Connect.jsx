import React, { useState, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Animated, Easing } from 'react-native';
import styles from '../styles/Connect.styles';
import { router } from 'expo-router';

const { width } = require('react-native').Dimensions.get('window');
const IPHONE_16_WIDTH = 430; // iPhone 16 Pro Max width in pt
const SCALE = width / IPHONE_16_WIDTH;

export default function ConnectScreen() {
  const [activeTab, setActiveTab] = useState('login');
  const animValue = useRef(new Animated.Value(0)).current;

  // Animation lors du changement d'onglet
  const switchTab = (tab: 'login' | 'signup') => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    Animated.timing(animValue, {
      toValue: tab === 'login' ? 0 : 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  // Interpolation pour l'animation de translation
  const loginTranslate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });
  const signupTranslate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

  return (
    <View style={styles.root}>
      {/* Header avec Microphone */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/authen/authen')}>
          <Image source={require('@/assets/images/Return.png')} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Authentification</Text>
        <View style={styles.headerIcon} />
      </View>

      {/* Tabs Connexion / Inscription */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={activeTab === 'login' ? styles.tabActive : styles.tabInactive} onPress={() => switchTab('login')}>
          <Text style={activeTab === 'login' ? styles.tabActiveText : styles.tabInactiveText}>CONNEXION</Text>
        </TouchableOpacity>
        <TouchableOpacity style={activeTab === 'signup' ? styles.tabActive : styles.tabInactive} onPress={() => switchTab('signup')}>
          <Text style={activeTab === 'signup' ? styles.tabActiveText : styles.tabInactiveText}>INSCRIPTION</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabSeparator} />

      {/* Contenu animé */}
      <View style={{ width: '100%', height: 350 }}>
        <Animated.View style={{
          position: 'absolute',
          width: '100%',
          transform: [{ translateX: loginTranslate }],
        }}>
          {/* Formulaire Connexion */}
          <Text style={styles.introText}>Make changes to your account here. Click save when you're done.</Text>
          <View style={styles.inputGroupCustom}>
            {/* Email */}
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWithButton}>
              <TextInput style={styles.inputCustom} placeholder="test@test.fr" placeholderTextColor="#aaa" />
            </View>
            <Text style={styles.inputHelp}>Enter your email address</Text>
            {/* Password */}
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWithButton}>
              <TextInput style={styles.inputCustom} placeholder="********" placeholderTextColor="#aaa" secureTextEntry />
            </View>
            <Text style={styles.inputHelp}>Enter your password</Text>
          </View>
          <View style={styles.buttonContainerCustom}>
            <TouchableOpacity style={styles.loginButtonCustom}>
              <Text style={styles.loginButtonText}>Connexion</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View style={{
          position: 'absolute',
          width: '100%',
          transform: [{ translateX: signupTranslate }],
        }}>
          {/* Formulaire Inscription */}
          <Text style={styles.introText}>Créez un compte pour profiter de toutes les fonctionnalités !</Text>
          <View style={styles.inputGroupCustom}>
            {/* Nom */}
            <Text style={styles.inputLabel}>Nom</Text>
            <View style={styles.inputWithButton}>
              <TextInput style={styles.inputCustom} placeholder="Votre nom" placeholderTextColor="#aaa" />
            </View>
            {/* Email */}
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWithButton}>
              <TextInput style={styles.inputCustom} placeholder="test@test.fr" placeholderTextColor="#aaa" />
            </View>
            {/* Mot de passe */}
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={styles.inputWithButton}>
              <TextInput style={styles.inputCustom} placeholder="********" placeholderTextColor="#aaa" secureTextEntry />
            </View>
            {/* Confirmation mot de passe */}
            <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
            <View style={styles.inputWithButton}>
              <TextInput style={styles.inputCustom} placeholder="********" placeholderTextColor="#aaa" secureTextEntry />
            </View>
          </View>
          <View style={styles.buttonContainerCustom}>
            <TouchableOpacity style={styles.loginButtonCustom}>
              <Text style={styles.loginButtonText}>Inscription</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
