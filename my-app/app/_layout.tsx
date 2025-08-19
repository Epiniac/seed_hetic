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
