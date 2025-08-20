// C'est un fichier de mise en page racine pour l'application
// Il utilise Expo Router pour gérer la navigation
// Il enveloppe l'application dans un fournisseur de contexte d'authentification
// pour gérer l'état d'authentification de l'utilisateur
// Les écrans sont définis pour les différentes parties de l'application, y compris les onglets, l'authentification et les détails des plantes

import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(authenticated)" />
        <Stack.Screen name="authen" />
        <Stack.Screen name="DashboardPlantDetail" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}
