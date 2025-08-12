import { StyleSheet, Platform } from 'react-native';

// ========================================
// STYLES POUR PLANTSEARCH COMPONENT
// ========================================

export const plantSearchStyles = StyleSheet.create({
  // --- Conteneur principal ---
  container: {
    position: 'relative',
  },
  
  // --- Barre de recherche ---
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        minHeight: 64,
        paddingHorizontal: 16,
        paddingVertical: 16,
      },
      android: {
        minHeight: 64,
        paddingHorizontal: 16,
        paddingVertical: 16,
      },
      web: {
        minHeight: 48,
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
    }),
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent', 
    ...Platform.select({
      ios: {
        height: 48, 
        paddingVertical: 12,
        paddingHorizontal: 4,
      },
      android: {
        height: 48, 
        paddingVertical: 12,
        paddingHorizontal: 4,
      },
      web: {
        height: 40, 
        paddingVertical: 0,
        paddingHorizontal: 0,
      },
    }),
  },
  loadingIcon: {
    marginLeft: 8,
  },
  
  // --- Liste des résultats ---
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    maxHeight: 350, // Plus de hauteur pour voir plus de résultats
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0', // Bordure légère pour mieux voir le conteneur
    overflow: 'visible', // S'assurer que le contenu est visible
  },
  resultsList: {
    maxHeight: 320,
    paddingHorizontal: 0, // Enlever le padding horizontal
  },
  resultItem: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 4,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    minHeight: 100, // PLUS de hauteur pour la ligne entière
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: 50, // Plus petit pour laisser plus de place au texte
    height: 50,
    borderRadius: 12,
    marginRight: 12, // Moins de margin
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  noImageText: {
    fontSize: 24,
    color: '#26CB66',
    textAlign: 'center',
  },
  textContainer: {
    ...Platform.select({
      ios: {
        width: 180,
        height: 60,
      },
      android: {
        width: 180,
        height: 60,
      },
      web: {
        flex: 1,
      },
    }),
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 8,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  resultScientific: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: 20,
  },
  
  // --- Modal de détails ---
  detailsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  detailsContent: {
    flex: 1,
    padding: 16,
  },
  
  // --- Contenu des détails ---
  detailsImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailsPlantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailsScientificName: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailsCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  
  // --- Styles pour les favoris ---
  favoritesContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  favoritesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  favoritesList: {
    flex: 1,
  },
  favoriteButton: {
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        padding: 10,
        marginLeft: 12,
        minWidth: 44,
        minHeight: 44,
      },
      android: {
        padding: 10,
        marginLeft: 12,
        minWidth: 44,
        minHeight: 44,
      },
      web: {
        padding: 12,
        marginLeft: 4,
        minWidth: 40,
        minHeight: 40,
      },
    }),
  },
  favoriteButtonText: {
    fontSize: 18,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyFavoritesIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyFavoritesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyFavoritesSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
