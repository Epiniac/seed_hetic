import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './styles/PlantDetail.styles';

const { width } = require('react-native').Dimensions.get('window');
const IPHONE_16_WIDTH = 430; // iPhone 16 Pro Max width in pt
const SCALE = width / IPHONE_16_WIDTH;

// Données des plantes (même que dans Product.jsx)
const plantsData = [
  {
    id: '1',
    name: 'Plantain Lily',
    image: require('../assets/images/Fraises.png'),
    daysToHarvest: '5 days',
    temperature: '24°C',
    humidity: '80%',
    soil: 'Clay type',
    soilPercentage: '70%',
    description: 'A beautiful perennial plant with broad leaves and delicate flowers. Perfect for shady areas of your garden.',
    careInstructions: 'Water regularly, keep in partial shade, fertilize monthly during growing season.'
  },
  {
    id: '2',
    name: 'Strawberry Plant',
    image: require('../assets/images/Fraises.png'),
    daysToHarvest: '3 days',
    temperature: '22°C',
    humidity: '75%',
    soil: 'Sandy type',
    soilPercentage: '65%',
    description: 'Sweet and juicy strawberries growing in your own garden. Perfect for fresh eating or making preserves.',
    careInstructions: 'Full sun exposure, well-draining soil, regular watering, protect from birds.'
  },
  {
    id: '3',
    name: 'Flower Garden',
    image: require('../assets/images/Flower.png'),
    daysToHarvest: '7 days',
    temperature: '26°C',
    humidity: '85%',
    soil: 'Loamy type',
    soilPercentage: '80%',
    description: 'A vibrant mix of colorful flowers that will brighten up any space. Attracts pollinators and beneficial insects.',
    careInstructions: 'Deadhead regularly, water at base, provide good air circulation, fertilize every 2 weeks.'
  },
  {
    id: '4',
    name: 'Herb Garden',
    image: require('../assets/images/Maceta.jpg'),
    daysToHarvest: '4 days',
    temperature: '23°C',
    humidity: '70%',
    soil: 'Clay type',
    soilPercentage: '75%',
    description: 'A collection of aromatic herbs perfect for cooking and natural remedies. Includes basil, mint, and rosemary.',
    careInstructions: 'Prune regularly, harvest leaves frequently, keep soil moist but not soggy.'
  },
  {
    id: '5',
    name: 'Tomato Plant',
    image: require('../assets/images/Fraises.png'),
    daysToHarvest: '6 days',
    temperature: '25°C',
    humidity: '78%',
    soil: 'Sandy type',
    soilPercentage: '68%',
    description: 'Juicy, homegrown tomatoes that taste better than store-bought. Perfect for salads, sauces, and fresh eating.',
    careInstructions: 'Full sun, support with cages, remove suckers, consistent watering.'
  },
  {
    id: '6',
    name: 'Basil Plant',
    image: require('../assets/images/Maceta.jpg'),
    daysToHarvest: '2 days',
    temperature: '21°C',
    humidity: '72%',
    soil: 'Loamy type',
    soilPercentage: '82%',
    description: 'Aromatic basil with intense flavor. Essential for Italian cuisine and pesto making.',
    careInstructions: 'Pinch off flower buds, harvest from top down, keep soil consistently moist.'
  }
];

export default function PlantDetailScreen() {
  const router = useRouter();
  const { plantId } = useLocalSearchParams();
  
  // Trouver la plante correspondante
  const plant = plantsData.find(p => p.id === plantId);

  if (!plant) {
    return (
      <View style={styles.root}>
        <Text style={styles.errorText}>Plant not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* Header avec Return et Like */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('../assets/images/Return.png')} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{plant.name}</Text>
        <Image source={require('../assets/images/Like.png')} style={styles.headerIcon} resizeMode="contain" />
      </View>

      {/* Image de la plante */}
      <View style={styles.plantImageContainer}>
        <Image source={plant.image} style={styles.plantImage} resizeMode="cover" />
      </View>

      {/* Titre et sous-titre */}
      <Text style={styles.plantTitle}>{plant.name}</Text>
      <Text style={styles.plantSubtitle}>{plant.daysToHarvest} to harvest</Text>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>About this plant</Text>
        <Text style={styles.descriptionText}>{plant.description}</Text>
      </View>

      {/* Deux carrés sur la même ligne */}
      <View style={styles.statsRowTop}>
        {/* Carte 1 : Room Light */}
        <View style={[styles.statCardSquare, { backgroundColor: '#F5FFD1' }]}> 
          <View style={styles.squareIconRow}>
            <Image source={require('../assets/images/Sun.png')} style={styles.squareIcon} resizeMode="contain" />
          </View>
          <Text style={styles.squareLabel}>Room Light</Text>
          <Text style={styles.squareValue}>{plant.temperature}</Text>
        </View>

        {/* Carte 2 : Humidity */}
        <View style={[styles.statCardSquare, { backgroundColor: '#E4FFD4' }]}> 
          <View style={styles.squareIconRow}>
            <Image source={require('../assets/images/Humidity.png')} style={styles.squareIcon} resizeMode="contain" />
          </View>
          <Text style={styles.squareLabel}>Humidity</Text>
          <Text style={styles.squareValue}>{plant.humidity}</Text>
        </View>
      </View>

      {/* Rectangle en dessous, centré */}
      <View style={styles.statsRowBottom}>
        <View style={[styles.statCardRect, { backgroundColor: '#E9F5FE' }]}> 
          <View style={styles.rectContentRow}>
            <Image source={require('../assets/images/Soil.png')} style={styles.rectIcon} resizeMode="contain" />
            <View style={styles.rectTextCol}>
              <Text style={styles.rectTitle}>Soil</Text>
              <Text style={styles.rectSubtitle}>{plant.soil}</Text>
            </View>
            <View style={styles.rectValueCol}>
              <Text style={styles.rectValue}>{plant.soilPercentage}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Instructions de soin */}
      <View style={styles.careContainer}>
        <Text style={styles.careTitle}>Care Instructions</Text>
        <Text style={styles.careText}>{plant.careInstructions}</Text>
      </View>

      {/* CTA - Ajouter la plante au dashboard */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => {
            // Ici vous pourriez ajouter la logique pour sauvegarder la plante
            alert(`${plant.name} a été ajoutée à votre dashboard !`);
            router.back();
          }}
        >
          <Text style={styles.ctaButtonText}>Ajouter au dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 