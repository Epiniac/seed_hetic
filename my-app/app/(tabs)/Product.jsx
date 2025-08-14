import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import styles from '../styles/Product.styles';
import { useRouter } from 'expo-router';

const { width } = require('react-native').Dimensions.get('window');
const IPHONE_16_WIDTH = 430;
const SCALE = width / IPHONE_16_WIDTH;

// Données des plantes
const plantsData = [
  {
    id: '1',
    name: 'Plantain Lily',
    image: require('../../assets/images/Fraises.png'),
    daysToHarvest: '5 days'
  },
  {
    id: '2',
    name: 'Strawberry Plant',
    image: require('../../assets/images/Fraises.png'),
    daysToHarvest: '3 days'
  },
];

export default function ProductScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlants, setFilteredPlants] = useState(plantsData);

  // Fonction de filtrage des plantes
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredPlants(plantsData);
    } else {
      const filtered = plantsData.filter(plant =>
        plant.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPlants(filtered);
    }
  };

  // Composant pour chaque card de plante
  const PlantCard = ({ plant }) => (
    <TouchableOpacity 
      style={styles.plantCard}
      onPress={() => router.push(`/PlantDetail?plantId=${plant.id}`)}
    >
      <View style={styles.plantCardImageContainer}>
        <Image source={plant.image} style={styles.plantCardImage} resizeMode="cover" />
      </View>
      <View style={styles.plantCardContent}>
        <Text style={styles.plantCardTitle}>{plant.name}</Text>
        <Text style={styles.plantCardSubtitle}>{plant.daysToHarvest} to harvest</Text>

      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* Header avec titre */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/Dashboard')}>
          <Image source={require('../../assets/images/Return.png')} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bibliothèque</Text>
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
      <FlatList
        data={filteredPlants}
        renderItem={({ item }) => <PlantCard plant={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.plantGrid}
        contentContainerStyle={styles.plantList}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}
