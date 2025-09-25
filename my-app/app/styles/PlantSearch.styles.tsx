import { StyleSheet, Platform } from 'react-native';

// ========================================
// STYLES POUR PLANTSEARCH COMPONENT
// ========================================

export const plantSearchStyles = StyleSheet.create({
  // --- Conteneur principal ---
  container: {
    position: 'relative',
    paddingTop: 16,
    paddingBottom: 16,
  },
  
  // --- Barre de recherche ---
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    marginTop: 8,
    ...Platform.select({
      ios: {
        minHeight: 64,
        paddingHorizontal: 20,
        paddingVertical: 18,
      },
      android: {
        minHeight: 64,
        paddingHorizontal: 20,
        paddingVertical: 18,
      },
      web: {
        minHeight: 48,
        paddingHorizontal: 20,
        paddingVertical: 14,
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
    borderRadius: 16,
    marginHorizontal: 24,
    maxHeight: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'visible',
  },
  resultsList: {
    maxHeight: 320,
    paddingHorizontal: 0, // Enlever le padding horizontal
  },
  resultItem: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 8,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 110,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    marginRight: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    padding: 20,
  },
  
  // --- Contenu des détails ---
  detailsImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  detailsPlantName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailsScientificName: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 28,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 8,
  },
  detailsCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
  },
  detailsLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailsValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  descriptionContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
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
  
  // --- Styles pour la bibliothèque ---
  libraryButtonContainer: {
    marginTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  libraryButton: {
    backgroundColor: '#26CB66',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  libraryButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  libraryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  libraryButtonTextDisabled: {
    color: '#888888',
  },
  headerSpacer: {
    width: 40, // Pour équilibrer avec le bouton de fermeture
  },

  // --- Nouveaux styles pour les capteurs et l'entretien ---
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 20,
  },
  
  sensorContainer: {
    marginBottom: 24,
  },
  
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  sensorCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  sensorIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  
  sensorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    flex: 1,
  },
  
  sensorValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#26CB66',
    marginBottom: 4,
  },
  
  sensorDate: {
    fontSize: 11,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  
  careContainer: {
    marginBottom: 24,
  },
  
  careCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  careHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  careIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  
  careLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    flex: 1,
  },
  
  rangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  rangeText: {
    fontSize: 14,
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  optimalText: {
    fontSize: 14,
    color: '#26CB66',
    backgroundColor: '#d4edda',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '600',
  },
  
  wateringDetails: {
    gap: 6,
  },
  
  lastWateredText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 4,
  },
  
  statusContainer: {
    marginBottom: 24,
  },
  
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  
  statusGood: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  
  statusWarning: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
  },
  
  statusCritical: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
