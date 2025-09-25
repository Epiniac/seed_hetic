import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getFavorites, removeFromFavorites, FavoritePlant } from '../services/favoritesService';
import { getPlantDetails, PlantDetails } from '../services/perenualApi';
import { plantSearchStyles as styles } from '../app/styles/PlantSearch.styles';

// ========================================
// TYPES ET INTERFACES
// ========================================

interface FavoritesListProps {
  onPlantSelect?: (plant: FavoritePlant) => void;
  onClose?: () => void;
}

// ========================================
// COMPOSANT FAVORIS
// ========================================

export default function FavoritesList({ onPlantSelect, onClose }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoritePlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ========================================
  // CHARGEMENT DES FAVORIS
  // ========================================

  const loadFavorites = async () => {
    try {
      const favoritesData = await getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      Alert.alert('Erreur', 'Impossible de charger les favoris');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // ========================================
  // GESTION DES ACTIONS
  // ========================================

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadFavorites();
  };

  const handleRemoveFavorite = async (plantId: number, plantName: string) => {
    Alert.alert(
      'Retirer des favoris',
      `Voulez-vous retirer "${plantName}" de vos favoris ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFromFavorites(plantId);
              await loadFavorites(); // Recharger la liste
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de retirer la plante des favoris');
            }
          },
        },
      ]
    );
  };

  const handlePlantPress = (plant: FavoritePlant) => {
    if (onPlantSelect) {
      onPlantSelect(plant);
    }
  };

  // ========================================
  // RENDU D'UN FAVORI
  // ========================================

  const renderFavoriteItem = ({ item }: { item: FavoritePlant }) => (
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
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>🌱</Text>
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.resultTitle}>{item.common_name}</Text>
          <Text style={styles.resultScientific}>
            {item.scientific_name[0]}
          </Text>
          <Text style={styles.favoriteDate}>
            Ajouté le {new Date(item.addedAt).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleRemoveFavorite(item.id, item.common_name)}
        >
          <Text style={styles.favoriteButtonText}>❤️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // ========================================
  // RENDU PRINCIPAL
  // ========================================

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#26CB66" />
        <Text style={styles.loadingText}>Chargement des favoris...</Text>
      </View>
    );
  }

  return (
    <View style={styles.favoritesContainer}>
      {/* Header */}
      <View style={styles.favoritesHeader}>
        <Text style={styles.favoritesTitle}>
          ❤️ Mes favoris ({favorites.length})
        </Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Liste des favoris */}
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.favoritesList}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyFavoritesContainer}>
          <Text style={styles.emptyFavoritesIcon}>💔</Text>
          <Text style={styles.emptyFavoritesText}>
            Aucune plante en favoris
          </Text>
          <Text style={styles.emptyFavoritesSubtext}>
            Recherchez des plantes et ajoutez-les à vos favoris !
          </Text>
        </View>
      )}
    </View>
  );
}
