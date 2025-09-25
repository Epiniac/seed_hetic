import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E9F5FE',
    marginRight: 12,
  },
  textCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },

  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 24,
  },

  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },

  searchInputFake: {
    flex: 1,
    justifyContent: 'center',
    height: 32,
  },

  searchPlaceholder: {
    color: '#888',
    fontSize: 16,
  },
  
  microIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },

  // Notification Cards - Styles génériques et spécifiques

  macetaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '100%',
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0',
  },

  // Notifications d'arrosage - Thème bleu/eau
  notificationArrosage: {
    backgroundColor: '#F0F8FF', // Alice Blue très clair
    borderLeftColor: '#1E90FF', // Dodger Blue
    shadowColor: '#1E90FF',
    shadowOpacity: 0.15,
  },

  notificationArrosageIcon: {
    backgroundColor: '#E6F3FF', // Bleu très clair
    borderWidth: 2,
    borderColor: '#87CEEB', // Sky Blue
  },

  notificationArrosageTitle: {
    color: '#1E90FF', // Dodger Blue
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },

  notificationArrosageSubtitle: {
    color: '#4682B4', // Steel Blue
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Notifications de température - Thème rouge/orange
  notificationTemperature: {
    backgroundColor: '#FFF5F5', // Rouge très clair
    borderLeftColor: '#FF6347', // Tomato
    shadowColor: '#FF6347',
    shadowOpacity: 0.15,
  },

  notificationTemperatureIcon: {
    backgroundColor: '#FFE4E1', // Misty Rose
    borderWidth: 2,
    borderColor: '#FFA07A', // Light Salmon
  },

  notificationTemperatureTitle: {
    color: '#DC143C', // Crimson
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },

  notificationTemperatureSubtitle: {
    color: '#B22222', // Fire Brick
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Notifications générales/positives - Thème vert
  notificationGenerale: {
    backgroundColor: '#F0FFF0', // Honeydew
    borderLeftColor: '#32CD32', // Lime Green
    shadowColor: '#32CD32',
    shadowOpacity: 0.15,
  },

  notificationGeneraleIcon: {
    backgroundColor: '#E6FFE6', // Vert très clair
    borderWidth: 2,
    borderColor: '#90EE90', // Light Green
  },

  notificationGeneraleTitle: {
    color: '#228B22', // Forest Green
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },

  notificationGeneraleSubtitle: {
    color: '#006400', // Dark Green
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Notifications d'humidité - Thème violet/lavande
  notificationHumidite: {
    backgroundColor: '#F8F8FF', // Ghost White
    borderLeftColor: '#9370DB', // Medium Purple
    shadowColor: '#9370DB',
    shadowOpacity: 0.15,
  },

  notificationHumiditeIcon: {
    backgroundColor: '#F0E6FF', // Violet très clair
    borderWidth: 2,
    borderColor: '#DDA0DD', // Plum
  },

  notificationHumiditeTitle: {
    color: '#8A2BE2', // Blue Violet
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },

  notificationHumiditeSubtitle: {
    color: '#663399', // Rebecca Purple
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Styles par priorité
  priorityHigh: {
    borderLeftWidth: 6,
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },

  priorityMedium: {
    borderLeftWidth: 4,
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  priorityLow: {
    borderLeftWidth: 3,
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  // Style pour l'icône de notification
  macetaImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  macetaTextCol: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },

  // Styles génériques pour le texte (utilisés comme fallback)
  macetaTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    lineHeight: 22,
  },
  
  macetaSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    fontWeight: '400',
  },

  // Catégories Plantes 

  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 24,
    position: 'relative',
    height: 48, // hauteur fixe pour éviter le décalage
  },

  categoryCol: {
    alignItems: 'center',
    flex: 1,
  },

  categorySelected: {
    color: '#26CB66',
    fontSize: 15,
    marginBottom: 10,
  },

  categoryUnselected: {
    color: '#BDBDBD',
    fontSize: 15,
    marginBottom: 8,
  },

  categoryBar: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#26CB66',
  },

  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 24,
  },

  imageCol: {
    alignItems: 'center',
    flex: 1,
    marginRight: 20, // Ajoute un espacement horizontal entre chaque plante
  },

  plantImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 8,
  },
  
  plantImageTitle: {
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
  },

  // Styles pour les boutons de suppression
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 25,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  plantCardContent: {
    flex: 1,
    alignItems: 'center',
  },

  // Styles pour les états de chargement
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingContainerPlants: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Styles pour les notifications par défaut (aucune notification)
  noNotificationCard: {
    backgroundColor: '#F0FFF0',
    borderLeftColor: '#32CD32',
    borderLeftWidth: 4,
    shadowColor: '#32CD32',
    shadowOpacity: 0.1,
  },

  // Style pour la notification statique (pour matcher les dynamiques)
  staticNotificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FFF0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#32CD32',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#32CD32',
  },

  noNotificationIcon: {
    backgroundColor: '#E6FFE6',
    borderWidth: 2,
    borderColor: '#90EE90',
  },

  noNotificationTitle: {
    color: '#228B22',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 22,
  },

  noNotificationSubtitle: {
    color: '#006400',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
  },

  // Styles spécifiques pour les notifications dynamiques
  dynamicNotificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0',
  },

  dynamicNotificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dynamicNotificationTextCol: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },

  dynamicNotificationTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    lineHeight: 22,
  },
  
  dynamicNotificationSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    fontWeight: '400',
  },

  // Styles pour les priorités des notifications
  priorityIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.8,
    marginLeft: 8,
  },

  // Styles pour les icônes de notification
  notificationIcon: {
    fontSize: 24,
  },

  // Styles pour le scroll des notifications
  notificationsScrollView: {
    maxHeight: 200,
    width: '100%',
    paddingHorizontal: 20,
  },

  // Style pour le conteneur de la notification statique
  staticNotificationContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },

  // Style pour le titre des sections
  sectionTitle: {
    marginTop: 20,
    marginBottom: 20,
  },

  // Style pour le conteneur des plantes
  plantsScrollContainer: {
    marginBottom: 20,
  },

  plantsRow: {
    flexDirection: 'row',
  },

});
