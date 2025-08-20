
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Animated, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import styles from '../styles/Dashboard.styles';
import PlantSearch from '../../components/PlantSearch';
import { PlantSpecies } from '../../services/perenualApi';
import { getDashboardPlants, removeDashboardPlant } from '../../services/dashboardPlantService';
import { useAuth } from '../../contexts/AuthContext';

// Interface pour les plantes du dashboard
interface DashboardPlant {
  _id?: string;
  id?: string;
  name?: string;
  image?: string;
  [key: string]: any;
}

export default function DashboardScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('house');
  const [selectedPlant, setSelectedPlant] = useState<PlantSpecies | null>(null);
  const [userPlants, setUserPlants] = useState<DashboardPlant[]>([]);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // Animation pour la barre verte (si tu veux garder les catégories)
  const barAnim = useRef(new Animated.Value(0)).current;
  const categories = [
    { key: 'house', label: 'House Plants' },
    { key: 'garden', label: 'Garden Plants' },
    { key: 'office', label: 'Office Plants' },
  ];
  const screenWidth = Dimensions.get('window').width;
  const colWidth = (screenWidth - 40) / 3;

  useEffect(() => {
    const idx = categories.findIndex(cat => cat.key === selectedCategory);
    Animated.spring(barAnim, {
      toValue: idx * colWidth,
      useNativeDriver: false,
    }).start();
  }, [selectedCategory]);

  // Charger les plantes de l'utilisateur depuis l'API
  useFocusEffect(
    React.useCallback(() => {
      fetchUserPlants();
    }, [])
  );

  const fetchUserPlants = async () => {
    setLoadingPlants(true);
    try {
      const plants = await getDashboardPlants();
      setUserPlants(plants);
    } catch (e) {
      console.error('Erreur lors du chargement des plantes:', e);
      setUserPlants([]);
    } finally {
      setLoadingPlants(false);
    }
  };

  // Gestionnaire de sélection de plante
  const handlePlantSelection = (plant: PlantSpecies) => {
    setSelectedPlant(plant);
    // Tu peux ici naviguer vers une page de détails ou faire autre chose
  };

  // Fonction pour supprimer une plante du dashboard
  const handleRemoveDashboardPlant = async (plant: DashboardPlant) => {
    Alert.alert(
      'Supprimer du dashboard',
      `Êtes-vous sûr de vouloir supprimer "${plant.name}" du dashboard ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const plantId = plant._id || plant.id;
              if (!plantId) {
                Alert.alert('Erreur', 'Impossible de supprimer cette plante: ID manquant.');
                return;
              }
              
              await removeDashboardPlant(plantId);
              // Recharger les plantes après suppression
              await fetchUserPlants();
              Alert.alert('Succès', `"${plant.name}" a été supprimé du dashboard.`);
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Plantes statiques (fraises)
  const staticPlants = [
    {
      id: 'strawberry-1',
      name: 'Strawberry Plant',
      image: require('../../assets/images/Fraises.png'),
    },
    {
      id: 'strawberry-2',
      name: 'Strawberry Plant',
      image: require('../../assets/images/Fraises.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header personnalisé */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.circle} />
          <View style={styles.textCol}>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>The best activity to do</Text>
          </View>
        </View>
        <Image source={require('../../assets/images/Notification.jpg')} resizeMode="contain" />
      </View>

      {/* Barre de recherche sous le header */}
      <PlantSearch onPlantSelect={handlePlantSelection} style={{ width: '100%' }} />

      {/* Carte Maceta sous la SearchBar */}
      <View style={styles.macetaCard}>
        <View style={styles.macetaTextCol}>
          <Text style={styles.macetaTitle}>Your daisy is dehydrated</Text>
          <Text style={styles.macetaSubtitle}>It's look like that daisy need more water</Text>
        </View>
        <Image source={require('../../assets/images/Maceta.jpg')} style={styles.macetaImage} resizeMode="cover" />
      </View>

      {/* Plantes statiques + dynamiques */}
      <Text style={[styles.headerTitle, { marginTop: 20, marginBottom: 10 }]}>Mes plantes en pot</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          {/* Plantes statiques */}
          {staticPlants.map((plant) => (
            <TouchableOpacity
              key={plant.id}
              style={styles.imageCol}
              onPress={() => router.push(`/DashboardPlantDetail/${plant.id}`)}
            >
              <Image
                source={plant.image}
                style={styles.plantImage}
                resizeMode="cover"
              />
              <Text style={styles.plantImageTitle}>{plant.name}</Text>
            </TouchableOpacity>
          ))}
          {/* Plantes dynamiques */}
          {loadingPlants ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
              <ActivityIndicator size="large" color="#26CB66" />
            </View>
          ) : userPlants.length === 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
              <Text style={styles.headerSubtitle}>Aucune plante en pot</Text>
            </View>
          ) : (
            userPlants.map((plant, idx) => (
              <View key={plant._id || plant.id || idx} style={styles.imageCol}>
                {/* Bouton de suppression en haut à droite */}
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleRemoveDashboardPlant(plant)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>

                {/* Contenu cliquable de la plante */}
                <TouchableOpacity
                  style={styles.plantCardContent}
                  onPress={() => router.push(`/PlantDetail?plantId=${plant._id || plant.id}&source=dashboard`)}
                >
                  <Image
                    source={plant.image ? { uri: plant.image } : require('../../assets/images/Fraises.png')}
                    style={styles.plantImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.plantImageTitle}>{plant.name || 'Plante'}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
