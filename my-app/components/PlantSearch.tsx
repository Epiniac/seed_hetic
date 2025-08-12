import React, { useState, useEffect } from 'react';
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
import { searchPlants, getPlantDetails, PlantSpecies, PlantDetails } from '../services/perenualApi';
import { plantSearchStyles as styles } from '../app/styles/PlantSearch.styles';
import { 
  toggleFavorite, 
  isFavorite, 
  getFavoritesCount,
  FavoritePlant 
} from '../services/favoritesService';
import FavoritesList from './FavoritesList';

// ========================================
// TYPES ET INTERFACES
// ========================================

interface PlantSearchProps {
  onPlantSelect?: (plant: PlantSpecies) => void;
  style?: any;
}

interface SearchResult {
  id: number;
  common_name: string;
  scientific_name: string[];
  default_image?: {
    thumbnail: string;
    small_url: string;
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
  const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // États pour les favoris
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [resultsFavoriteStatus, setResultsFavoriteStatus] = useState<{[key: number]: boolean}>({});

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
  // GESTION DES FAVORIS
  // ========================================

  // Charger le nombre de favoris au démarrage
  useEffect(() => {
    loadFavoritesCount();
  }, []);

  // Charger le statut favori des résultats quand ils changent
  useEffect(() => {
    if (results.length > 0) {
      checkResultsFavoriteStatus();
    }
  }, [results]);

  const loadFavoritesCount = async () => {
    try {
      const count = await getFavoritesCount();
      setFavoritesCount(count);
    } catch (error) {
      console.error('Erreur lors du chargement du nombre de favoris:', error);
    }
  };

  const checkResultsFavoriteStatus = async () => {
    const status: {[key: number]: boolean} = {};
    for (const plant of results) {
      try {
        status[plant.id] = await isFavorite(plant.id);
      } catch (error) {
        status[plant.id] = false;
      }
    }
    setResultsFavoriteStatus(status);
  };

  const handleToggleFavorite = async (plant: SearchResult) => {
    try {
      const favoritePlant: Omit<FavoritePlant, 'addedAt'> = {
        id: plant.id,
        common_name: plant.common_name,
        scientific_name: plant.scientific_name,
        default_image: plant.default_image,
      };

      const newStatus = await toggleFavorite(favoritePlant);
      
      // Mettre à jour le statut local
      setResultsFavoriteStatus(prev => ({
        ...prev,
        [plant.id]: newStatus
      }));

      // Recharger le compteur
      await loadFavoritesCount();

      // Afficher un message
      Alert.alert(
        newStatus ? 'Ajouté aux favoris' : 'Retiré des favoris',
        `"${plant.common_name}" ${newStatus ? 'a été ajouté à' : 'a été retiré de'} vos favoris.`
      );
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
      Alert.alert('Erreur', 'Impossible de modifier les favoris');
    }
  };

  const handleFavoritesPress = () => {
    setShowFavorites(true);
    setShowResults(false); // Fermer les résultats de recherche
  };

  const handleFavoriteSelect = (plant: FavoritePlant) => {
    // Convertir en SearchResult pour réutiliser la logique existante
    const searchResult: SearchResult = {
      id: plant.id,
      common_name: plant.common_name,
      scientific_name: plant.scientific_name,
      default_image: plant.default_image,
    };
    
    setShowFavorites(false);
    handlePlantPress(searchResult);
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
              {item.common_name || 'Nom inconnu'}
            </Text>
            <Text style={styles.resultScientific}>
              {item.scientific_name?.[0] || 'Scientific name unavailable'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite(item)}
          >
            <Text style={styles.favoriteButtonText}>
              {resultsFavoriteStatus[item.id] ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // ========================================
  // MODAL DE DÉTAILS DE PLANTE
  // ========================================

  const renderPlantDetails = () => {
    if (!selectedPlant) return null;

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
            {/* Bouton favori dans la modal */}
            {selectedPlant && (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => {
                  const searchResult: SearchResult = {
                    id: selectedPlant.id,
                    common_name: selectedPlant.common_name,
                    scientific_name: selectedPlant.scientific_name,
                    default_image: selectedPlant.default_image ? {
                      thumbnail: selectedPlant.default_image.regular_url || '',
                      small_url: selectedPlant.default_image.regular_url || ''
                    } : null,
                  };
                  handleToggleFavorite(searchResult);
                }}
              >
                <Text style={styles.favoriteButtonText}>
                  {selectedPlant && resultsFavoriteStatus[selectedPlant.id] ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            )}
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
              {selectedPlant.default_image && (
                <Image
                  source={{ uri: selectedPlant.default_image.regular_url }}
                  style={styles.detailsImage}
                  resizeMode="cover"
                />
              )}
              
              <Text style={styles.detailsPlantName}>{selectedPlant.common_name}</Text>
              <Text style={styles.detailsScientificName}>
                {selectedPlant.scientific_name[0]}
              </Text>
              
              <View style={styles.detailsGrid}>
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsLabel}>Type</Text>
                  <Text style={styles.detailsValue}>{selectedPlant.type || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsLabel}>Cycle</Text>
                  <Text style={styles.detailsValue}>{selectedPlant.cycle || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsLabel}>Arrosage</Text>
                  <Text style={styles.detailsValue}>{selectedPlant.watering || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsLabel}>Entretien</Text>
                  <Text style={styles.detailsValue}>{selectedPlant.maintenance || 'N/A'}</Text>
                </View>
              </View>

              {selectedPlant.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionLabel}>Description</Text>
                  <Text style={styles.descriptionText}>{selectedPlant.description}</Text>
                </View>
              )}
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
        <Image
          source={require('../assets/images/Search.png')}
          style={styles.searchIcon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une plante..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setShowResults(true)}
        />
        {isLoading && (
          <ActivityIndicator size="small" color="#26CB66" style={styles.loadingIcon} />
        )}
        {/* Bouton favoris */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritesPress}
        >
          <Text style={styles.favoriteButtonText}>❤️</Text>
          {favoritesCount > 0 && (
            <View style={styles.favoriteBadge}>
              <Text style={styles.favoriteBadgeText}>{favoritesCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Résultats de recherche */}
      {showResults && (
        <View style={styles.resultsContainer}>
          {results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id.toString()}
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

      {/* Modal des favoris */}
      <Modal
        visible={showFavorites}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFavorites(false)}
      >
        <FavoritesList
          onPlantSelect={handleFavoriteSelect}
          onClose={() => setShowFavorites(false)}
        />
      </Modal>
    </View>
  );
}
