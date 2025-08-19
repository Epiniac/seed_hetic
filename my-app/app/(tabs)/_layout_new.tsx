import React from 'react';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Masquer la tab bar pour la page d'accueil
        tabBarStyle: { display: 'none' },
        headerShown: false,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          tabBarButton: () => null, // Masquer complètement l'onglet
        }}
      />
      
    </Tabs>
  );
}
