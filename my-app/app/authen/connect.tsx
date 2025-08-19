import React, { useState, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Animated, Easing } from 'react-native';
import styles from '../styles/Connect.styles';
import { router } from 'expo-router';
import { useAuthActions } from '../../hooks/useAuthActions';

const { width } = require('react-native').Dimensions.get('window');

export default function AuthConnectScreen() {
  const [activeTab, setActiveTab] = useState('login');
  const animValue = useRef(new Animated.Value(0)).current;
  const { handleLogin, handleRegister, isLoading } = useAuthActions();
  
  // États pour les formulaires
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

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

  // Gestion des formulaires
  const onLoginPress = () => {
    handleLogin(loginForm.email, loginForm.password);
  };

  const onRegisterPress = () => {
    handleRegister(registerForm.name, registerForm.email, registerForm.password, registerForm.confirmPassword);
  };

  return (
    <View style={styles.root}>
      {/* Header avec Microphone */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/authen/authen')}>
          <Image source={require('../../assets/images/Return.png')} style={styles.headerIcon} resizeMode="contain" />
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
          <Text style={styles.introText}>Connectez-vous à votre compte pour accéder à vos plantes.</Text>
          <View style={styles.inputGroupCustom}>
            {/* Email */}
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWithButton}>
              <TextInput 
                style={styles.inputCustom} 
                placeholder="test@test.fr" 
                placeholderTextColor="#aaa"
                value={loginForm.email}
                onChangeText={(text) => setLoginForm(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            <Text style={styles.inputHelp}>Entrez votre adresse email</Text>
            {/* Password */}
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={styles.inputWithButton}>
              <TextInput 
                style={styles.inputCustom} 
                placeholder="********" 
                placeholderTextColor="#aaa" 
                secureTextEntry
                value={loginForm.password}
                onChangeText={(text) => setLoginForm(prev => ({ ...prev, password: text }))}
                editable={!isLoading}
              />
            </View>
            <Text style={styles.inputHelp}>Entrez votre mot de passe</Text>
          </View>
          <View style={styles.buttonContainerCustom}>
            <TouchableOpacity 
              style={[styles.loginButtonCustom, isLoading && { opacity: 0.6 }]} 
              onPress={onLoginPress}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Connexion...' : 'Connexion'}
              </Text>
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
              <TextInput 
                style={styles.inputCustom} 
                placeholder="Votre nom" 
                placeholderTextColor="#aaa"
                value={registerForm.name}
                onChangeText={(text) => setRegisterForm(prev => ({ ...prev, name: text }))}
                editable={!isLoading}
              />
            </View>
            {/* Email */}
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWithButton}>
              <TextInput 
                style={styles.inputCustom} 
                placeholder="test@test.fr" 
                placeholderTextColor="#aaa"
                value={registerForm.email}
                onChangeText={(text) => setRegisterForm(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {/* Mot de passe */}
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={styles.inputWithButton}>
              <TextInput 
                style={styles.inputCustom} 
                placeholder="********" 
                placeholderTextColor="#aaa" 
                secureTextEntry
                value={registerForm.password}
                onChangeText={(text) => setRegisterForm(prev => ({ ...prev, password: text }))}
                editable={!isLoading}
              />
            </View>
            {/* Confirmation mot de passe */}
            <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
            <View style={styles.inputWithButton}>
              <TextInput 
                style={styles.inputCustom} 
                placeholder="********" 
                placeholderTextColor="#aaa" 
                secureTextEntry
                value={registerForm.confirmPassword}
                onChangeText={(text) => setRegisterForm(prev => ({ ...prev, confirmPassword: text }))}
                editable={!isLoading}
              />
            </View>
          </View>
          <View style={styles.buttonContainerCustom}>
            <TouchableOpacity 
              style={[styles.loginButtonCustom, isLoading && { opacity: 0.6 }]} 
              onPress={onRegisterPress}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Inscription...' : 'Inscription'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
