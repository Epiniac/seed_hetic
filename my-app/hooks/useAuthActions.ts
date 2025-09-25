import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export const useAuthActions = () => {
  const { login, register, logout, isLoading } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(email, password);
      Alert.alert('Succès', 'Connexion réussie !');
      router.replace('/(authenticated)/Dashboard');
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Erreur lors de la connexion');
    }
  };

  const handleRegister = async (name: string, email: string, password: string, confirmPassword: string) => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await register(name, email, password);
      Alert.alert('Succès', 'Inscription réussie !');
      router.replace('/(authenticated)/Dashboard');
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Erreur lors de l\'inscription');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la déconnexion');
    }
  };

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    isLoading,
  };
};
