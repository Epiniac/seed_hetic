import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { searchPlants, getPlantDetails, PlantSpecies, PlantDetails } from '../services/unifiedPlantApi';
import { plantSearchStyles as styles } from '../app/styles/PlantSearch.styles';
import { 
  addToLibrary, 
  isInLibrary,
  removeFromLibrary,
  LibraryPlant 
} from '../services/userLibraryService';

// ========================================
// TYPES ET INTERFACES
// ========================================

interface PlantSearchProps {
  onPlantSelect?: (plant: PlantSpecies) => void;
  style?: any;
}

interface SearchResult {
  id: string | number; // Compatible avec les deux types d'API
  common_name: string;
  scientific_name: string[];
  default_image?: {
    thumbnail?: string;
    small_url?: string;
    regular_url?: string;
  } | null;
}

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export default function PlantSearch({ onPlantSelect, style }: PlantSearchProps) {
  // ========================================
  // ÉTATS DU COMPOSANT
  // ========================================
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantDetails | any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Référence pour le TextInput
  const searchInputRef = useRef<TextInput>(null);
  
  // États pour la bibliothèque
  const [isPlantInLibrary, setIsPlantInLibrary] = useState(false);

  // ========================================
  // LOGIQUE DE RECHERCHE (DEBOUNCE)
  // ========================================
  
  // Fonction de recherche avec debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500); // Attendre 500ms après la dernière saisie

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // ========================================
  // FONCTIONS DE RECHERCHE
  // ========================================

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchPlants(searchQuery, 1, 10);
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      Alert.alert('Erreur', 'Impossible de rechercher les plantes. Vérifiez votre connexion internet.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // GESTION DES DÉTAILS DE PLANTE
  // ========================================

  const handlePlantPress = async (plant: SearchResult) => {
    setSelectedPlant(null); // Reset previous plant
    setIsLoadingDetails(true);
    setShowDetails(true);
    
    try {
      const details = await getPlantDetails(plant.id);
      setSelectedPlant(details);
      
      // Vérifier si la plante est dans la bibliothèque
      const inLibrary = await isInLibrary(String(plant.id));
      setIsPlantInLibrary(inLibrary);
      
      if (onPlantSelect) {
        onPlantSelect(plant as PlantSpecies);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      // Ne pas fermer la modal, mais créer un objet de base avec les infos disponibles
      const basicDetails = {
        id: plant.id,
        common_name: plant.common_name,
        scientific_name: plant.scientific_name,
        default_image: plant.default_image ? {
          regular_url: plant.default_image.small_url || plant.default_image.thumbnail || ''
        } : null,
        type: 'Information non disponible',
        cycle: 'Information non disponible',
        watering: 'Information non disponible',
        maintenance: 'Information non disponible',
        description: 'Aucune description disponible pour cette plante.'
      } as PlantDetails;
      setSelectedPlant(basicDetails);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // ========================================
  // LOGIQUE DE RECHERCHE (DEBOUNCE)
  // ========================================  // ========================================
  // GESTION DE LA BIBLIOTHÈQUE
  // ========================================

  const handleAddToLibrary = async () => {
    if (!selectedPlant) return;

    try {
      const libraryPlant: Omit<LibraryPlant, 'addedAt'> = {
        id: String(selectedPlant.id),
        common_name: selectedPlant.common_name,
        scientific_name: selectedPlant.scientific_name,
        default_image: selectedPlant.default_image ? {
          thumbnail: selectedPlant.default_image.regular_url || selectedPlant.default_image.thumbnail || '',
          small_url: selectedPlant.default_image.regular_url || selectedPlant.default_image.small_url || '',
          regular_url: selectedPlant.default_image.regular_url || ''
        } : null,
        daysToHarvest: '5 days' // Valeur par défaut, peut être personnalisée plus tard
      };

      const success = await addToLibrary(libraryPlant);
      
      if (success) {
        setIsPlantInLibrary(true);
        Alert.alert(
          'Ajouté !',
          `"${selectedPlant.common_name}" est maintenant dans votre bibliothèque.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Fermer le modal après un délai pour que l'utilisateur voie le changement
                setTimeout(() => {
                  setShowDetails(false);
                }, 1000);
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Déjà dans la bibliothèque',
          `"${selectedPlant.common_name}" est déjà dans votre bibliothèque.`
        );
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la bibliothèque:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter la plante à la bibliothèque');
    }
  };

  const handleRemoveFromLibrary = async () => {
    if (!selectedPlant) return;

    Alert.alert(
      'Retirer de la bibliothèque',
      `Êtes-vous sûr de vouloir retirer "${selectedPlant.common_name}" de votre bibliothèque ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFromLibrary(String(selectedPlant.id));
              setIsPlantInLibrary(false);
              Alert.alert(
                'Retiré !',
                `"${selectedPlant.common_name}" a été retiré de votre bibliothèque.`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Fermer le modal après un délai
                      setTimeout(() => {
                        setShowDetails(false);
                      }, 1000);
                    }
                  }
                ]
              );
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

  // ========================================
  // RENDU DES RÉSULTATS DE RECHERCHE
  // ========================================

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    // Debug pour voir les données
    console.log('Rendu plante:', item.common_name, item.scientific_name);
    
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handlePlantPress(item)}
      >
        <View style={styles.resultRow}>
          <View style={styles.imageContainer}>
            {item.default_image?.thumbnail ? (
              <Image
                source={{ uri: item.default_image.thumbnail }}
                style={styles.resultImage}
                resizeMode="cover"
                onError={() => console.log('Erreur de chargement image:', item.common_name)}
                onLoad={() => console.log('Image chargée:', item.common_name)}
              />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.noImageText}>🌱</Text>
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.resultTitle}>
              {String(item.common_name || 'Nom inconnu')}
            </Text>
            <Text style={styles.resultScientific}>
              {String(item.scientific_name?.[0] || 'Scientific name unavailable')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ========================================
  // MODAL DE DÉTAILS DE PLANTE
  // ========================================

  const renderPlantDetails = () => {
    if (!selectedPlant) return null;

    // Helper pour afficher un objet ou une liste de paires clé/valeur
    const renderObject = (obj: any, label: string) => {
      if (!obj) return null;
      return (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.detailsLabel}>{label}</Text>
          {Object.entries(obj).map(([key, value]) => (
            <Text key={key} style={styles.detailsValue}>{key}: {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}</Text>
          ))}
        </View>
      );
    };

    return (
      <Modal
        visible={showDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDetails(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.detailsTitle}>Détails de la plante</Text>
            <View style={styles.headerSpacer} />
          </View>

          {isLoadingDetails ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#26CB66" />
              <Text style={styles.loadingText}>Chargement des détails...</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.detailsContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Image principale */}
              {selectedPlant.default_image && (
                <Image
                  source={{ uri: selectedPlant.default_image.regular_url }}
                  style={styles.detailsImage}
                  resizeMode="cover"
                />
              )}
              {/* Champs principaux */}
              <Text style={styles.detailsPlantName}>{String(selectedPlant.common_name || selectedPlant.name || 'Nom non disponible')}</Text>
              <Text style={styles.detailsScientificName}>
                {Array.isArray(selectedPlant.scientific_name) && selectedPlant.scientific_name.length > 0
                  ? String(selectedPlant.scientific_name[0])
                  : String(selectedPlant.scientific_name || selectedPlant.species || 'Nom scientifique non disponible')
                }
              </Text>
              {selectedPlant.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionLabel}>Description</Text>
                  <Text style={styles.descriptionText}>{String(selectedPlant.description)}</Text>
                </View>
              )}
              {/* Champs PlantCatalog supplémentaires */}
              {selectedPlant.owner && (
                <Text style={styles.detailsValue}>Propriétaire: {String(selectedPlant.owner)}</Text>
              )}
              {selectedPlant.plantingDate && (
                <Text style={styles.detailsValue}>Date de plantation: {String(selectedPlant.plantingDate)}</Text>
              )}
              {renderObject(selectedPlant.careInstructions, 'Instructions d\'entretien')}
              {renderObject(selectedPlant.currentStats, 'Statistiques actuelles')}
              {selectedPlant.status && (
                <Text style={styles.detailsValue}>Statut: {String(selectedPlant.status)}</Text>
              )}
              {selectedPlant.notes && Array.isArray(selectedPlant.notes) && selectedPlant.notes.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.detailsLabel}>Notes</Text>
                  {selectedPlant.notes.map((note: any, idx: number) => (
                    <Text key={idx} style={styles.detailsValue}>{note.content} ({note.date})</Text>
                  ))}
                </View>
              )}
              {selectedPlant.category && (
                <Text style={styles.detailsValue}>Catégorie: {String(selectedPlant.category)}</Text>
              )}
              {selectedPlant.difficulty && (
                <Text style={styles.detailsValue}>Difficulté: {String(selectedPlant.difficulty)}</Text>
              )}
              {selectedPlant.sunlight && (
                <Text style={styles.detailsValue}>Ensoleillement: {String(selectedPlant.sunlight)}</Text>
              )}
              {selectedPlant.growthRate && (
                <Text style={styles.detailsValue}>Vitesse de croissance: {String(selectedPlant.growthRate)}</Text>
              )}
              {typeof selectedPlant.isPublic !== 'undefined' && (
                <Text style={styles.detailsValue}>Publique: {selectedPlant.isPublic ? 'Oui' : 'Non'}</Text>
              )}
              {selectedPlant.tags && Array.isArray(selectedPlant.tags) && selectedPlant.tags.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.detailsLabel}>Tags</Text>
                  <Text style={styles.detailsValue}>{selectedPlant.tags.join(', ')}</Text>
                </View>
              )}
              {/* Champs type/cycle/watering/maintenance (compatibilité) */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsLabel}>Type</Text>
                  <Text style={styles.detailsValue}>{String(selectedPlant.type || 'N/A')}</Text>
                </View>
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsLabel}>Cycle</Text>
                  <Text style={styles.detailsValue}>{String(selectedPlant.cycle || 'N/A')}</Text>
                </View>
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsLabel}>Arrosage</Text>
                  <Text style={styles.detailsValue}>{String(selectedPlant.watering || 'N/A')}</Text>
                </View>
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsLabel}>Entretien</Text>
                  <Text style={styles.detailsValue}>{String(selectedPlant.maintenance || 'N/A')}</Text>
                </View>
              </View>
              {/* Bouton Ajouter/Retirer de la bibliothèque */}
              <View style={styles.libraryButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.libraryButton,
                    isPlantInLibrary && styles.libraryButtonDisabled
                  ]}
                  onPress={isPlantInLibrary ? handleRemoveFromLibrary : handleAddToLibrary}
                >
                  <Text style={[
                    styles.libraryButtonText,
                    isPlantInLibrary && styles.libraryButtonTextDisabled
                  ]}>
                    {isPlantInLibrary ? '✓ Dans la bibliothèque' : '+ Ajouter à la bibliothèque'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    );
  };

  // ========================================
  // RENDU PRINCIPAL DU COMPOSANT
  // ========================================

  return (
    <View style={[styles.container, style]}>
      {/* Barre de recherche */}
      <View style={styles.searchBarRow}>
        <TouchableOpacity 
          style={styles.searchInputContainer}
          activeOpacity={1}
          onPress={() => searchInputRef.current?.focus()}
        >
          <Image
            source={require('../assets/images/Search.png')}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Rechercher une plante..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setShowResults(true)}
          />
        </TouchableOpacity>
        
        {isLoading && (
          <ActivityIndicator size="small" color="#26CB66" style={styles.loadingIcon} />
        )}
      </View>

      {/* Résultats de recherche */}
      {showResults && (
        <View style={styles.resultsContainer}>
          {results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderSearchResult}
              keyExtractor={(item) => String(item.id)}
              style={styles.resultsList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            />
          ) : (
            !isLoading && (
              <Text style={styles.noResults}>
                {searchQuery.length > 2 ? 'Aucun résultat trouvé' : 'Tapez au moins 3 caractères pour rechercher'}
              </Text>
            )
          )}
        </View>
      )}

      {/* Modal avec détails de la plante */}
      {renderPlantDetails()}
    </View>
  );
}
