import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/Product.styles';
import { useRouter, useFocusEffect } from 'expo-router';
import { getLibrary, removeFromLibrary } from '../../services/userLibraryService';

const { width } = require('react-native').Dimensions.get('window');
const IPHONE_16_WIDTH = 430;
const SCALE = width / IPHONE_16_WIDTH;

export default function ProductScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryPlants, setLibraryPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);

  // Charger les plantes de la bibliothèque à chaque fois que l'écran est focus
  useFocusEffect(
    useCallback(() => {
      loadLibraryPlants();
    }, [])
  );

  // Mettre à jour les plantes filtrées quand la recherche change
  useEffect(() => {
    filterPlants();
  }, [searchQuery, libraryPlants]);

  const loadLibraryPlants = async () => {
    try {
      console.log('🔄 Chargement de la bibliothèque...');
      
      // Vérifier l'état de l'authentification
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      console.log('🔐 Token présent:', token ? 'Oui' : 'Non');
      console.log('👤 Données utilisateur:', userData ? JSON.parse(userData).name : 'Aucune');
      
      const plants = await getLibrary();
      console.log('📚 Plantes récupérées:', plants.length, 'plantes');
      if (plants.length > 0) {
        console.log('🌱 Noms des plantes:', plants.map(p => p.common_name).join(', '));
      }
      setLibraryPlants(plants);
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la bibliothèque:', error);
    }
  };

  // Fonction de filtrage des plantes
  const filterPlants = () => {
    if (searchQuery.trim() === '') {
      setFilteredPlants(libraryPlants);
    } else {
      const filtered = libraryPlants.filter(plant =>
        plant.common_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlants(filtered);
    }
  };

  // Fonction de gestion de la recherche
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Fonction pour supprimer une plante de la bibliothèque
  const handleRemovePlant = async (plant) => {
    Alert.alert(
      'Supprimer de la bibliothèque',
      `Êtes-vous sûr de vouloir supprimer "${plant.common_name}" de votre bibliothèque ?`,
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
              await removeFromLibrary(plant.id);
              // Recharger la bibliothèque après suppression
              await loadLibraryPlants();
              Alert.alert('Succès', `"${plant.common_name}" a été supprimé de votre bibliothèque.`);
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

  // Composant pour chaque card de plante
  const PlantCard = ({ plant }) => (
    <View style={styles.plantCard}>
      {/* Bouton de suppression en haut à droite */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleRemovePlant(plant)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>

      {/* Contenu cliquable de la card */}
      <TouchableOpacity 
        style={styles.plantCardContent}
        onPress={() => router.push(`/PlantDetail?plantId=${plant.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.plantCardImageContainer}>
          {plant.default_image?.thumbnail || plant.default_image?.small_url || plant.default_image?.regular_url ? (
            <Image 
              source={{ 
                uri: plant.default_image.thumbnail || 
                     plant.default_image.small_url || 
                     plant.default_image.regular_url 
              }} 
              style={styles.plantCardImage} 
              resizeMode="cover" 
            />
          ) : (
            <View style={[styles.plantCardImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 30 }}>🌱</Text>
            </View>
          )}
        </View>
        <View style={styles.plantCardTextContent}>
          <Text style={styles.plantCardTitle}>{plant.common_name}</Text>
          <Text style={styles.plantCardSubtitle}>{plant.daysToHarvest} to harvest</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.root}>
      {/* Header avec titre */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/(authenticated)/Dashboard')}>
          <Image source={require('../../assets/images/Return.png')} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ma Bibliothèque</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Image source={require('../../assets/images/Search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search plants..."
          placeholderTextColor="#717171"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Liste des plantes */}
      {filteredPlants.length > 0 ? (
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => <PlantCard plant={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.plantGrid}
          contentContainerStyle={styles.plantList}
          showsVerticalScrollIndicator={true}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'Aucune plante trouvée' : 'Votre bibliothèque est vide'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery 
              ? 'Essayez de modifier votre recherche'
              : 'Recherchez des plantes et ajoutez-les à votre bibliothèque pour les voir ici'
            }
          </Text>
        </View>
      )}
    </View>
  );
}
