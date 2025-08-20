// Ce fichier gère l'affichage des détails d'une plante
// Il récupère les données de la plante depuis l'API unifiée ou le dashboard
// et affiche les informations pertinentes à l'utilisateur.
// Il permet également de mettre en pot une plante depuis le dashboard.
// Utilise React Native pour l'interface utilisateur et Expo Router pour la navigation.

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getPlantDetails } from '../services/unifiedPlantApi';
import { plantSearchStyles as styles } from '../app/styles/PlantSearch.styles';

const { width } = require('react-native').Dimensions.get('window');
const IPHONE_16_WIDTH = 430; // iPhone 16 Pro Max width in pt
const SCALE = width / IPHONE_16_WIDTH;

export default function PlantDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // S'assurer que plantId est une chaîne
  const plantId = Array.isArray(params.plantId) ? params.plantId[0] : params.plantId;
  const source = Array.isArray(params.source) ? params.source[0] : params.source;
  
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
        
        let details;
        if (source === 'dashboard') {
          // Charger depuis l'API des plantes du dashboard
          const { getDashboardPlant } = require('../services/dashboardPlantService');
          details = await getDashboardPlant(plantId);
        } else {
          // Charger depuis l'API unifiée (PlantCatalog)
          details = await getPlantDetails(plantId);
        }
        
        if (!details) {
          setError('Plante non trouvée');
          setIsLoading(false);
          return;
        }
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
  }, [plantId, source]);

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

  // Helper pour afficher un objet ou une liste de paires clé/valeur
  const renderObject = (obj, label) => {
    if (!obj) return null;
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>{label}</Text>
        {Object.entries(obj).map(([key, value]) => (
          <Text key={key} style={styles.detailsValue}>{key}: {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}</Text>
        ))}
      </View>
    );
  };

  // Helper pour afficher les statistiques de capteurs avec une meilleure présentation
  const renderSensorStats = (stats) => {
    if (!stats) return null;
    
    return (
      <View style={styles.sensorContainer}>
        <Text style={styles.sectionTitle}>📊 Données des capteurs</Text>
        <View style={styles.sensorGrid}>
          {stats.temperature && (
            <View style={styles.sensorCard}>
              <View style={styles.sensorHeader}>
                <Text style={styles.sensorIcon}>🌡️</Text>
                <Text style={styles.sensorLabel}>Température</Text>
              </View>
              <Text style={styles.sensorValue}>
                {stats.temperature.value}°{stats.temperature.unit || 'C'}
              </Text>
              {stats.temperature.lastUpdated && (
                <Text style={styles.sensorDate}>
                  Mis à jour: {new Date(stats.temperature.lastUpdated).toLocaleString()}
                </Text>
              )}
            </View>
          )}
          
          {stats.humidity && (
            <View style={styles.sensorCard}>
              <View style={styles.sensorHeader}>
                <Text style={styles.sensorIcon}>💧</Text>
                <Text style={styles.sensorLabel}>Humidité</Text>
              </View>
              <Text style={styles.sensorValue}>
                {stats.humidity.value}{stats.humidity.unit || '%'}
              </Text>
              {stats.humidity.lastUpdated && (
                <Text style={styles.sensorDate}>
                  Mis à jour: {new Date(stats.humidity.lastUpdated).toLocaleString()}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  // Helper pour afficher les instructions d'entretien avec une meilleure présentation
  const renderCareInstructions = (care) => {
    if (!care) return null;
    
    return (
      <View style={styles.careContainer}>
        <Text style={styles.sectionTitle}>🌱 Instructions d'entretien</Text>
        
        {care.temperature && (
          <View style={styles.careCard}>
            <View style={styles.careHeader}>
              <Text style={styles.careIcon}>🌡️</Text>
              <Text style={styles.careLabel}>Température recommandée</Text>
            </View>
            <View style={styles.rangeContainer}>
              {care.temperature.min && <Text style={styles.rangeText}>Min: {care.temperature.min}°C</Text>}
              {care.temperature.max && <Text style={styles.rangeText}>Max: {care.temperature.max}°C</Text>}
              {care.temperature.optimal && <Text style={styles.optimalText}>Optimal: {care.temperature.optimal}°C</Text>}
            </View>
          </View>
        )}
        
        {care.humidity && (
          <View style={styles.careCard}>
            <View style={styles.careHeader}>
              <Text style={styles.careIcon}>💧</Text>
              <Text style={styles.careLabel}>Humidité recommandée</Text>
            </View>
            <View style={styles.rangeContainer}>
              {care.humidity.min && <Text style={styles.rangeText}>Min: {care.humidity.min}%</Text>}
              {care.humidity.max && <Text style={styles.rangeText}>Max: {care.humidity.max}%</Text>}
              {care.humidity.optimal && <Text style={styles.optimalText}>Optimal: {care.humidity.optimal}%</Text>}
            </View>
          </View>
        )}
        
        {care.watering && (
          <View style={styles.careCard}>
            <View style={styles.careHeader}>
              <Text style={styles.careIcon}>🚿</Text>
              <Text style={styles.careLabel}>Arrosage</Text>
            </View>
            <View style={styles.wateringDetails}>
              {care.watering.frequency && <Text style={styles.detailsValue}>Fréquence: {care.watering.frequency}</Text>}
              {care.watering.amount && <Text style={styles.detailsValue}>Quantité: {care.watering.amount}</Text>}
              {care.watering.lastWatered && (
                <Text style={styles.lastWateredText}>
                  Dernier arrosage: {new Date(care.watering.lastWatered).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.detailsContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Header avec Return et titre */}
      <View style={styles.detailsHeader}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.detailsTitle}>Détails de la plante</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Image principale */}
      {(plant.default_image || plant.image) && (
        <Image
          source={{ 
            uri: plant.default_image?.regular_url || 
                 plant.default_image?.small_url || 
                 plant.default_image?.thumbnail || 
                 plant.image 
          }}
          style={styles.detailsImage}
          resizeMode="cover"
        />
      )}
      {/* Champs principaux */}
      <Text style={styles.detailsPlantName}>{String(plant.common_name || plant.name || 'Nom non disponible')}</Text>
      <Text style={styles.detailsScientificName}>
        {Array.isArray(plant.scientific_name) && plant.scientific_name.length > 0
          ? String(plant.scientific_name[0])
          : String(plant.scientific_name || plant.species || 'Nom scientifique non disponible')
        }
      </Text>
      {plant.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.descriptionText}>{String(plant.description)}</Text>
        </View>
      )}
      {/* Champs PlantCatalog supplémentaires */}
      {plant.owner && (
        <Text style={styles.detailsValue}>Propriétaire: {String(plant.owner)}</Text>
      )}
      {plant.plantingDate && (
        <Text style={styles.detailsValue}>Date de plantation: {String(plant.plantingDate)}</Text>
      )}

      {/* Nouvelles sections améliorées pour les capteurs */}
      {renderSensorStats(plant.currentStats)}
      {renderCareInstructions(plant.careInstructions)}

      {/* Statut de la plante avec indicateur visuel */}
      {plant.status && (
        <View style={styles.statusContainer}>
          <Text style={styles.sectionTitle}>📈 Statut de la plante</Text>
          <View style={[styles.statusBadge, 
            plant.status === 'bonne sante' && styles.statusGood,
            plant.status === 'besoin eau' && styles.statusWarning,
            plant.status === 'besoin attention' && styles.statusWarning,
            plant.status === 'critique' && styles.statusCritical
          ]}>
            <Text style={styles.statusText}>
              {plant.status === 'bonne sante' && '✅ '}
              {plant.status === 'besoin eau' && '💧 '}
              {plant.status === 'besoin attention' && '⚠️ '}
              {plant.status === 'critique' && '🚨 '}
              {String(plant.status)}
            </Text>
          </View>
        </View>
      )}
      {plant.notes && Array.isArray(plant.notes) && plant.notes.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.detailsLabel}>Notes</Text>
          {plant.notes.map((note, idx) => (
            <Text key={idx} style={styles.detailsValue}>{note.content} ({note.date})</Text>
          ))}
        </View>
      )}
      {plant.category && (
        <Text style={styles.detailsValue}>Catégorie: {String(plant.category)}</Text>
      )}
      {plant.difficulty && (
        <Text style={styles.detailsValue}>Difficulté: {String(plant.difficulty)}</Text>
      )}
      {plant.sunlight && (
        <Text style={styles.detailsValue}>Ensoleillement: {String(plant.sunlight)}</Text>
      )}
      {plant.growthRate && (
        <Text style={styles.detailsValue}>Vitesse de croissance: {String(plant.growthRate)}</Text>
      )}
      {typeof plant.isPublic !== 'undefined' && (
        <Text style={styles.detailsValue}>Publique: {plant.isPublic ? 'Oui' : 'Non'}</Text>
      )}
      {plant.tags && Array.isArray(plant.tags) && plant.tags.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.detailsLabel}>Tags</Text>
          <Text style={styles.detailsValue}>{plant.tags.join(', ')}</Text>
        </View>
      )}
      {/* Champs type/cycle/watering/maintenance (compatibilité) */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailsCard}>
          <Text style={styles.detailsLabel}>Type</Text>
          <Text style={styles.detailsValue}>{String(plant.type || 'N/A')}</Text>
        </View>
        <View style={styles.detailsCard}>
          <Text style={styles.detailsLabel}>Cycle</Text>
          <Text style={styles.detailsValue}>{String(plant.cycle || 'N/A')}</Text>
        </View>
        <View style={styles.detailsCard}>
          <Text style={styles.detailsLabel}>Arrosage</Text>
          <Text style={styles.detailsValue}>{String(plant.watering || 'N/A')}</Text>
        </View>
        <View style={styles.detailsCard}>
          <Text style={styles.detailsLabel}>Entretien</Text>
          <Text style={styles.detailsValue}>{String(plant.maintenance || 'N/A')}</Text>
        </View>
      </View>
      {/* CTA - Conditionnellement Mise en pot ou Retour */}
      <View style={styles.libraryButtonContainer}>
        {source === 'dashboard' ? (
          <TouchableOpacity
            style={styles.libraryButton}
            onPress={() => router.push('/(authenticated)/Dashboard')}
          >
            <Text style={styles.libraryButtonText}>Retour au dashboard</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.libraryButton}
            onPress={async () => {
              try {
                // Appel API pour créer la plante dans la collection Plant côté backend
                const token = await require('@react-native-async-storage/async-storage').default.getItem('token');
                const BACKEND_URL = require('../config/environment').BACKEND_URL;
                const res = await fetch(`${BACKEND_URL}/api/plants`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                  },
                  body: JSON.stringify({
                    name: plant.common_name || plant.name,
                    species: Array.isArray(plant.scientific_name) ? plant.scientific_name[0] : plant.scientific_name || plant.species,
                    description: plant.description,
                    image: plant.default_image?.regular_url || plant.default_image?.small_url || plant.default_image?.thumbnail || '',
                    careInstructions: plant.careInstructions || plant.care_instructions || {},
                    currentStats: plant.currentStats || {},
                    status: plant.status || 'bonne sante',
                    notes: plant.notes || [],
                    plantingDate: plant.plantingDate || new Date(),
                  })
                });
                if (!res.ok) throw new Error('Erreur lors de la mise en pot');
                
                // Confirmer le succès
                alert(`✅ "${plant.common_name || plant.name}" a été mise en pot avec succès ! La plante reste disponible dans votre bibliothèque.`);
                
                // Rediriger vers le dashboard
                router.push('/(authenticated)/Dashboard');
              } catch (e) {
                alert('Erreur lors de la mise en pot : ' + (e?.message || e));
              }
            }}
          >
            <Text style={styles.libraryButtonText}>Mise en pot</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
} 