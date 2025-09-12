
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Animated, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import styles from '../styles/Dashboard.styles';
import PlantSearch from '../../components/PlantSearch';
import { PlantSpecies } from '../../services/perenualApi';
import { getDashboardPlants, removeDashboardPlant } from '../../services/dashboardPlantService';
import { useAuth } from '../../contexts/AuthContext';
import { getNotifications, markNotificationAsRead, getNotificationIcon, getNotificationColor, Notification } from '../../services/notificationService';

// Interface pour les plantes du dashboard
interface DashboardPlant {
  _id?: string;
  id?: string;
  name?: string;
  image?: string;
  [key: string]: any;
}

export default function DashboardScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('house');
  const [selectedPlant, setSelectedPlant] = useState<PlantSpecies | null>(null);
  const [userPlants, setUserPlants] = useState<DashboardPlant[]>([]);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // Animation pour la barre verte (si tu veux garder les catégories)
  const barAnim = useRef(new Animated.Value(0)).current;
  const categories = [
    { key: 'house', label: 'House Plants' },
    { key: 'garden', label: 'Garden Plants' },
    { key: 'office', label: 'Office Plants' },
  ];
  const screenWidth = Dimensions.get('window').width;
  const colWidth = (screenWidth - 40) / 3;

  useEffect(() => {
    const idx = categories.findIndex(cat => cat.key === selectedCategory);
    Animated.spring(barAnim, {
      toValue: idx * colWidth,
      useNativeDriver: false,
    }).start();
  }, [selectedCategory]);

  // Charger les plantes de l'utilisateur depuis l'API
  useFocusEffect(
    React.useCallback(() => {
      fetchUserPlants();
      fetchNotifications();
    }, [])
  );

  const fetchUserPlants = async () => {
    setLoadingPlants(true);
    try {
      const plants = await getDashboardPlants();
      setUserPlants(plants);
    } catch (e) {
      console.error('Erreur lors du chargement des plantes:', e);
      setUserPlants([]);
    } finally {
      setLoadingPlants(false);
    }
  };

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const unreadNotifications = await getNotifications(true);
      console.log('📱 NOTIFICATIONS:', JSON.stringify(unreadNotifications, null, 2));
      setNotifications(unreadNotifications);
    } catch (e) {
      console.error('Erreur lors du chargement des notifications:', e);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Gestionnaire de sélection de plante
  const handlePlantSelection = (plant: PlantSpecies) => {
    setSelectedPlant(plant);
    // Tu peux ici naviguer vers une page de détails ou faire autre chose
  };

  // Gestionnaire pour les notifications
  const handleNotificationPress = async (notification: Notification) => {
    try {
      await markNotificationAsRead(notification._id);
      
      // Afficher les détails de la notification
      Alert.alert(
        `${getNotificationIcon(notification.type)} ${notification.title}`,
        notification.message,
        [
          { text: "OK", style: "default" },
          {
            text: "Voir la plante",
            style: "default",
            onPress: () => {
              router.push(`/PlantDetail?plantId=${notification.plant._id}&source=dashboard`);
            }
          }
        ]
      );
      
      // Recharger les notifications pour mettre à jour l'affichage
      await fetchNotifications();
    } catch (error) {
      console.error('Erreur lors du traitement de la notification:', error);
      Alert.alert('Erreur', 'Impossible de traiter la notification.');
    }
  };

  // Fonction pour obtenir les styles selon le type et la priorité de notification
  const getNotificationStyles = (type: string, priority: string) => {
    // Couleurs selon le type
    let borderColor = '#32CD32';
    let iconBg = '#E6FFE6';
    let titleColor = '#228B22';
    let subtitleColor = '#006400';
    
    switch (type) {
      case 'arrosage':
        borderColor = '#1E90FF';
        iconBg = '#E6F3FF';
        titleColor = '#1E90FF';
        subtitleColor = '#4682B4';
        break;
      case 'temperature':
        borderColor = '#FF6347';
        iconBg = '#FFE4E1';
        titleColor = '#DC143C';
        subtitleColor = '#B22222';
        break;
      case 'humidité':
        borderColor = '#9370DB';
        iconBg = '#F0E6FF';
        titleColor = '#8A2BE2';
        subtitleColor = '#663399';
        break;
      case 'generale':
      default:
        borderColor = '#32CD32';
        iconBg = '#E6FFE6';
        titleColor = '#228B22';
        subtitleColor = '#006400';
        break;
    }

    // Largeur de bordure selon la priorité
    let borderWidth = 4;
    switch (priority) {
      case 'élevé':
      case 'high':
        borderWidth = 6;
        break;
      case 'moyen':
      case 'medium':
        borderWidth = 4;
        break;
      case 'faible':
      case 'low':
        borderWidth = 3;
        break;
    }

    return {
      additionalCardStyle: {
        borderLeftColor: borderColor,
        borderLeftWidth: borderWidth,
        shadowColor: borderColor,
      },
      iconStyle: {
        backgroundColor: iconBg,
        borderWidth: 2,
        borderColor: borderColor,
      },
      titleStyle: {
        color: titleColor,
      },
      subtitleStyle: {
        color: subtitleColor,
      },
    };
  };

  // Fonction pour rendre une notification
  const renderNotification = (notification: Notification) => {
    console.log('🎨 RENDU DE NOTIFICATION:', {
      id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority
    });
    
    const icon = getNotificationIcon(notification.type);
    const { additionalCardStyle, iconStyle, titleStyle, subtitleStyle } = getNotificationStyles(notification.type, notification.priority);
    
    return (
      <TouchableOpacity
        key={notification._id}
        style={[styles.dynamicNotificationCard, additionalCardStyle]}
        onPress={() => handleNotificationPress(notification)}
      >
        <View style={[styles.dynamicNotificationIcon, iconStyle]}>
          <Text style={styles.notificationIcon}>{icon}</Text>
        </View>
        <View style={styles.dynamicNotificationTextCol}>
          <Text style={[styles.dynamicNotificationTitle, titleStyle]}>
            {notification.title}
          </Text>
          <Text style={[styles.dynamicNotificationSubtitle, subtitleStyle]}>
            {notification.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Fonction pour supprimer une plante du dashboard
  const handleRemoveDashboardPlant = async (plant: DashboardPlant) => {
    Alert.alert(
      'Supprimer du dashboard',
      `Êtes-vous sûr de vouloir supprimer "${plant.name}" du dashboard ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const plantId = plant._id || plant.id;
              if (!plantId) {
                Alert.alert('Erreur', 'Impossible de supprimer cette plante: ID manquant.');
                return;
              }
              
              await removeDashboardPlant(plantId);
              // Recharger les plantes après suppression
              await fetchUserPlants();
              Alert.alert('Succès', `"${plant.name}" a été supprimé du dashboard.`);
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

  // Plantes statiques (fraises)
  const staticPlants = [
    {
      id: 'strawberry-1',
      name: 'Strawberry Plant',
      image: require('../../assets/images/Fraises.png'),
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header personnalisé */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Image 
            source={
              user?.avatar 
                ? { uri: user.avatar }
                : require('../../assets/images/Profil.png')
            } 
            style={styles.circle}
            resizeMode="cover"
          />
          <View style={styles.textCol}>
            <Text style={styles.headerTitle}>Bienvenue !</Text>
            <Text style={styles.headerSubtitle}>La meilleure activité à faire</Text>
          </View>
        </View>
        <Image source={require('../../assets/images/Notification.jpg')} resizeMode="contain" />
      </View>

      {/* Barre de recherche sous le header */}
      <PlantSearch onPlantSelect={handlePlantSelection} style={{ width: '100%' }} />

      {/* Notifications dynamiques */}
      {loadingNotifications ? (
        <View style={[styles.macetaCard, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="#26CB66" />
          <Text style={styles.macetaSubtitle}>Chargement des notifications...</Text>
        </View>
      ) : notifications.length > 0 ? (
        <ScrollView 
          style={styles.notificationsScrollView} 
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {notifications.slice(0, 2).map((notification) => renderNotification(notification))}
        </ScrollView>
      ) : (
        <View style={styles.staticNotificationContainer}>
          <View style={styles.staticNotificationCard}>
            <View style={[styles.macetaImage, styles.noNotificationIcon]}>
              <Text style={styles.notificationIcon}>✅</Text>
            </View>
            <View style={styles.macetaTextCol}>
              <Text style={[styles.macetaTitle, styles.noNotificationTitle]}>
                Toutes vos plantes sont en bonne santé
              </Text>
              <Text style={[styles.macetaSubtitle, styles.noNotificationSubtitle]}>
                Vos plantes sont épanouies et bien entretenues. Continuez ce bon travail !
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Plantes statiques + dynamiques */}
      <Text style={[styles.headerTitle, styles.sectionTitle]}>Votre sélection de plantes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plantsScrollContainer}>
        <View style={styles.plantsRow}>
          {/* Plantes statiques */}
          {staticPlants.map((plant) => (
            <TouchableOpacity
              key={plant.id}
              style={styles.imageCol}
              onPress={() => router.push(`/DashboardPlantDetail/${plant.id}`)}
            >
              <Image
                source={plant.image}
                style={styles.plantImage}
                resizeMode="cover"
              />
              <Text style={styles.plantImageTitle}>{plant.name}</Text>
            </TouchableOpacity>
          ))}


          {/* Plantes dynamiques */}
          {loadingPlants ? (
            <View style={styles.loadingContainerPlants}>
              <ActivityIndicator size="large" color="#26CB66" />
            </View>
          ) : userPlants.length === 0 ? (
            <View style={styles.loadingContainerPlants}>
              <Text style={styles.headerSubtitle}>Aucune plante en pot</Text>
            </View>
          ) : (
            userPlants.map((plant, idx) => (
              <View key={plant._id || plant.id || idx} style={styles.imageCol}>
                {/* Bouton de suppression en haut à droite */}
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleRemoveDashboardPlant(plant)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>

                {/* Contenu cliquable de la plante */}
                <TouchableOpacity
                  style={styles.plantCardContent}
                  onPress={() => router.push(`/PlantDetail?plantId=${plant._id || plant.id}&source=dashboard`)}
                >
                  <Image
                    source={plant.image ? { uri: plant.image } : require('../../assets/images/Fraises.png')}
                    style={styles.plantImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.plantImageTitle}>{plant.name || 'Plante'}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
