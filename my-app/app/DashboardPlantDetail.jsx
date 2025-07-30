import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from './styles/DashboardPlantDetail.styles';

const { width } = require('react-native').Dimensions.get('window');
const IPHONE_16_WIDTH = 430; // iPhone 16 Pro Max width in pt
const SCALE = width / IPHONE_16_WIDTH;

// Données des plantes du Dashboard (simulation des données de capteurs)
const dashboardPlantsData = [
  {
    id: 'strawberry-1',
    name: 'Strawberry Plant',
    image: require('../assets/images/Fraises.png'),
    status: 'dehydrated',
    statusColor: '#FF6B6B',
    daysToHarvest: '3 days',
    temperature: '24.5°C',
    humidity: '45%',
    soilMoisture: '30%',
    lightLevel: '850 lux',
    waterLevel: 'Low',
    lastWatered: '2 days ago',
    nextWatering: 'Today',
    healthScore: 65,
    description: 'Your strawberry plant needs immediate attention. The soil moisture is critically low and the plant is showing signs of dehydration.',
    recommendations: [
      'Water the plant immediately',
      'Move to a shadier location',
      'Check soil drainage',
      'Monitor humidity levels'
    ],
    sensorData: {
      temperature: 24.5,
      humidity: 45,
      soilMoisture: 30,
      lightLevel: 850,
      ph: 6.2
    }
  },
  {
    id: 'strawberry-2',
    name: 'Strawberry Plant',
    image: require('../assets/images/Fraises.png'),
    status: 'healthy',
    statusColor: '#26CB66',
    daysToHarvest: '5 days',
    temperature: '22.1°C',
    humidity: '72%',
    soilMoisture: '68%',
    lightLevel: '1200 lux',
    waterLevel: 'Optimal',
    lastWatered: '1 day ago',
    nextWatering: 'Tomorrow',
    healthScore: 92,
    description: 'Your strawberry plant is thriving! All parameters are within optimal ranges and the plant is growing well.',
    recommendations: [
      'Continue current care routine',
      'Harvest ripe strawberries',
      'Prune dead leaves',
      'Prepare for next growth cycle'
    ],
    sensorData: {
      temperature: 22.1,
      humidity: 72,
      soilMoisture: 68,
      lightLevel: 1200,
      ph: 6.5
    }
  }
];

export default function DashboardPlantDetailScreen() {
  const router = useRouter();
  const { plantId } = useLocalSearchParams();
  const [healthAnimation] = useState(new Animated.Value(0));
  
  // Trouver la plante correspondante
  const plant = dashboardPlantsData.find(p => p.id === plantId);

  useEffect(() => {
    if (plant) {
      // Animation du score de santé
      Animated.timing(healthAnimation, {
        toValue: plant.healthScore,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }
  }, [plant]);

  if (!plant) {
    return (
      <View style={styles.root}>
        <Text style={styles.errorText}>Plant not found</Text>
      </View>
    );
  }

  const HealthBar = ({ score, color }) => (
    <View style={styles.healthBarContainer}>
      <View style={styles.healthBarBackground}>
        <Animated.View 
          style={[
            styles.healthBarFill,
            { 
              width: healthAnimation.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: color
            }
          ]} 
        />
      </View>
      <Text style={styles.healthScore}>{score}%</Text>
    </View>
  );

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* Header avec Return et Status */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('../assets/images/Return.png')} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{plant.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: plant.statusColor }]}>
            <Text style={styles.statusText}>{plant.status}</Text>
          </View>
        </View>
        <Image source={require('../assets/images/Notification.jpg')} style={styles.headerIcon} resizeMode="contain" />
      </View>

      {/* Image de la plante avec overlay de statut */}
      <View style={styles.plantImageContainer}>
        <Image source={plant.image} style={styles.plantImage} resizeMode="cover" />
        <View style={[styles.statusOverlay, { backgroundColor: plant.statusColor + '20' }]}>
          <Text style={[styles.statusOverlayText, { color: plant.statusColor }]}>
            {plant.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Score de santé */}
      <View style={styles.healthContainer}>
        <Text style={styles.healthTitle}>Plant Health Score</Text>
        <HealthBar score={plant.healthScore} color={plant.statusColor} />
      </View>

      {/* Informations principales */}
      <View style={styles.mainInfoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Days to Harvest</Text>
            <Text style={styles.infoValue}>{plant.daysToHarvest}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Water Level</Text>
            <Text style={[styles.infoValue, { color: plant.statusColor }]}>{plant.waterLevel}</Text>
          </View>
        </View>
      </View>

      {/* Données des capteurs */}
      <View style={styles.sensorsContainer}>
        <Text style={styles.sectionTitle}>Sensor Data</Text>
        <View style={styles.sensorsGrid}>
          <View style={styles.sensorCard}>
            <Image source={require('../assets/images/Sun.png')} style={styles.sensorIcon} />
            <Text style={styles.sensorLabel}>Temperature</Text>
            <Text style={styles.sensorValue}>{plant.temperature}</Text>
          </View>
          <View style={styles.sensorCard}>
            <Image source={require('../assets/images/Humidity.png')} style={styles.sensorIcon} />
            <Text style={styles.sensorLabel}>Humidity</Text>
            <Text style={styles.sensorValue}>{plant.humidity}</Text>
          </View>
          <View style={styles.sensorCard}>
            <Image source={require('../assets/images/Soil.png')} style={styles.sensorIcon} />
            <Text style={styles.sensorLabel}>Soil Moisture</Text>
            <Text style={styles.sensorValue}>{plant.soilMoisture}</Text>
          </View>
          <View style={styles.sensorCard}>
            <Image source={require('../assets/images/Sun.png')} style={styles.sensorIcon} />
            <Text style={styles.sensorLabel}>Light Level</Text>
            <Text style={styles.sensorValue}>{plant.lightLevel}</Text>
          </View>
        </View>
      </View>

      {/* Informations d'arrosage */}
      <View style={styles.wateringContainer}>
        <Text style={styles.sectionTitle}>Watering Schedule</Text>
        <View style={styles.wateringInfo}>
          <View style={styles.wateringItem}>
            <Text style={styles.wateringLabel}>Last Watered</Text>
            <Text style={styles.wateringValue}>{plant.lastWatered}</Text>
          </View>
          <View style={styles.wateringItem}>
            <Text style={styles.wateringLabel}>Next Watering</Text>
            <Text style={[styles.wateringValue, { color: plant.statusColor }]}>{plant.nextWatering}</Text>
          </View>
        </View>
      </View>

      {/* Description et recommandations */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Plant Status</Text>
        <Text style={styles.descriptionText}>{plant.description}</Text>
      </View>

      {/* Recommandations */}
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {plant.recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationItem}>
            <View style={[styles.recommendationDot, { backgroundColor: plant.statusColor }]} />
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
} 