import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getPlantDetails } from '../services/perenualApi';
import styles from './styles/PlantDetail.styles';

const { width } = require('react-native').Dimensions.get('window');
const IPHONE_16_WIDTH = 430; // iPhone 16 Pro Max width in pt
const SCALE = width / IPHONE_16_WIDTH;

export default function PlantDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // S'assurer que plantId est une chaîne
  const plantId = Array.isArray(params.plantId) ? params.plantId[0] : params.plantId;
  
  // États pour gérer les données de la plante
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les détails de la plante au montage du composant
  useEffect(() => {
    const loadPlantDetails = async () => {
      if (!plantId) {
        setError('ID de plante manquant');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const plantIdNumber = parseInt(String(plantId), 10);
        if (isNaN(plantIdNumber)) {
          setError('ID de plante invalide');
          setIsLoading(false);
          return;
        }
        
        const details = await getPlantDetails(plantIdNumber);
        setPlant(details);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des détails:', err);
        setError('Impossible de charger les détails de la plante');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlantDetails();
  }, [plantId]);

  // Affichage de l'état de chargement
  if (isLoading) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#26CB66" />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    );
  }

  // Affichage d'erreur
  if (error || !plant) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>{error || 'Plante non trouvée'}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* Header avec Return et titre */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('../assets/images/Return.png')} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{String(plant.common_name || 'Détails plante')}</Text>
        <View style={[styles.headerIcon, { opacity: 0 }]} /> {/* Spacer invisible pour centrer le titre */}
      </View>

      {/* Image de la plante */}
      <View style={styles.plantImageContainer}>
        {plant.default_image?.regular_url ? (
          <Image source={{ uri: String(plant.default_image.regular_url) }} style={styles.plantImage} resizeMode="cover" />
        ) : (
          <View style={[styles.plantImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 60 }}>🌱</Text>
          </View>
        )}
      </View>

      {/* Titre et sous-titre */}
      <Text style={styles.plantTitle}>{String(plant.common_name || 'Nom de plante non disponible')}</Text>
      <Text style={styles.plantSubtitle}>
        {(() => {
          if (Array.isArray(plant.scientific_name) && plant.scientific_name.length > 0) {
            return String(plant.scientific_name[0]);
          } else if (plant.scientific_name) {
            return String(plant.scientific_name);
          } else {
            return 'Nom scientifique non disponible';
          }
        })()}
      </Text>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>À propos de cette plante</Text>
        <Text style={styles.descriptionText}>
          {String(plant.description || 'Aucune description disponible pour cette plante.')}
        </Text>
      </View>

      {/* Grille d'informations sur la plante */}
      <View style={styles.statsRowTop}>
        {/* Carte 1 : Type */}
        <View style={[styles.statCardSquare, { backgroundColor: '#F5FFD1' }]}> 
          <View style={styles.squareIconRow}>
            <Image source={require('../assets/images/Sun.png')} style={styles.squareIcon} resizeMode="contain" />
          </View>
          <Text style={styles.squareLabel}>Type</Text>
          <Text style={styles.squareValue}>{String(plant.type || 'N/A')}</Text>
        </View>

        {/* Carte 2 : Cycle */}
        <View style={[styles.statCardSquare, { backgroundColor: '#E4FFD4' }]}> 
          <View style={styles.squareIconRow}>
            <Image source={require('../assets/images/Humidity.png')} style={styles.squareIcon} resizeMode="contain" />
          </View>
          <Text style={styles.squareLabel}>Cycle</Text>
          <Text style={styles.squareValue}>{String(plant.cycle || 'N/A')}</Text>
        </View>
      </View>

      {/* Rectangle en dessous, centré */}
      <View style={styles.statsRowBottom}>
        <View style={[styles.statCardRect, { backgroundColor: '#E9F5FE' }]}> 
          <View style={styles.rectContentRow}>
            <Image source={require('../assets/images/Soil.png')} style={styles.rectIcon} resizeMode="contain" />
            <View style={styles.rectTextCol}>
              <Text style={styles.rectTitle}>Arrosage</Text>
              <Text style={styles.rectSubtitle}>{String(plant.watering || 'N/A')}</Text>
            </View>
            <View style={styles.rectValueCol}>
              <Text style={styles.rectValue}>{String(plant.maintenance || 'N/A')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Instructions de soin supplémentaires si disponibles */}
      {plant.maintenance && plant.maintenance !== 'N/A' && (
        <View style={styles.careContainer}>
          <Text style={styles.careTitle}>Instructions d'entretien</Text>
          <Text style={styles.careText}>{plant.maintenance}</Text>
        </View>
      )}

      {/* CTA - Retour à la bibliothèque */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => router.back()}
        >
          <Text style={styles.ctaButtonText}>Retour à ma bibliothèque</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 