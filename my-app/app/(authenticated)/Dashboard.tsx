
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Animated, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import styles from '../styles/Dashboard.styles';
import PlantSearch from '../../components/PlantSearch';
import { PlantSpecies } from '../../services/perenualApi';
import { getDashboardPlants, removeDashboardPlant } from '../../services/dashboardPlantService';
import { useAuth } from '../../contexts/AuthContext';
import { getNotifications, markNotificationAsRead, getNotificationIcon, getNotificationColor, Notification } from '../../services/notificationService';
import { simulateStatusChange } from '../../services/simulationService';

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
      const unreadNotifications = await getNotifications(true); // Seulement les non lues
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
      // Marquer la notification comme lue
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

  // Fonction pour tester les notifications (à supprimer en production)
  const handleTestNotification = () => {
    if (userPlants.length === 0) {
      Alert.alert('Aucune plante', 'Vous devez avoir au moins une plante pour tester les notifications.');
      return;
    }
    
    const firstPlant = userPlants[0];
    const plantId = firstPlant._id || firstPlant.id;
    
    if (!plantId) {
      Alert.alert('Erreur', 'ID de plante introuvable.');
      return;
    }
    
    Alert.alert(
      'Test de notifications système',
      'Quel type de changement voulez-vous simuler ?',
      [
        {
          text: 'Besoin d\'eau urgent',
          onPress: async () => {
            try {
              await simulateStatusChange(plantId, 'drought');
              Alert.alert('✅ Simulation réussie', 'La plante a maintenant besoin d\'eau urgent. Actualisez dans quelques secondes.');
              setTimeout(() => {
                fetchNotifications();
              }, 2000);
            } catch (error) {
              console.error('Erreur simulation drought:', error);
              Alert.alert('Erreur', `Impossible de simuler le changement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
          }
        },
        {
          text: 'Légèrement sec',
          onPress: async () => {
            try {
              await simulateStatusChange(plantId, 'moderate-dry');
              Alert.alert('✅ Simulation réussie', 'La plante est légèrement sèche. Actualisez dans quelques secondes.');
              setTimeout(() => {
                fetchNotifications();
              }, 2000);
            } catch (error) {
              console.error('Erreur simulation moderate-dry:', error);
              Alert.alert('Erreur', `Impossible de simuler le changement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
          }
        },
        {
          text: 'Température trop élevée',
          onPress: async () => {
            try {
              await simulateStatusChange(plantId, 'temperature');
              Alert.alert('✅ Simulation réussie', 'La température est maintenant trop élevée. Actualisez dans quelques secondes.');
              setTimeout(() => {
                fetchNotifications();
              }, 2000);
            } catch (error) {
              console.error('Erreur simulation temperature:', error);
              Alert.alert('Erreur', `Impossible de simuler le changement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
          }
        },
        {
          text: 'Température trop basse',
          onPress: async () => {
            try {
              await simulateStatusChange(plantId, 'cold');
              Alert.alert('✅ Simulation réussie', 'La température est maintenant trop basse. Actualisez dans quelques secondes.');
              setTimeout(() => {
                fetchNotifications();
              }, 2000);
            } catch (error) {
              console.error('Erreur simulation cold:', error);
              Alert.alert('Erreur', `Impossible de simuler le changement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
          }
        },
        {
          text: 'Retour aux conditions normales',
          onPress: async () => {
            try {
              await simulateStatusChange(plantId, 'healthy');
              Alert.alert('✅ Simulation réussie', 'La plante est maintenant en bonne santé.');
              setTimeout(() => {
                fetchNotifications();
              }, 2000);
            } catch (error) {
              console.error('Erreur simulation healthy:', error);
              Alert.alert('Erreur', `Impossible de simuler le changement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            }
          }
        },
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };

  // Fonction pour obtenir les styles selon le type et la priorité de notification
  const getNotificationStyles = (type: string, priority: string) => {
    // Styles de base pour chaque type
    let cardStyle, iconBg, borderColor, titleColor, subtitleColor, shadowColor;

    switch (type) {
      case 'arrosage':
        cardStyle = { backgroundColor: '#F0F8FF' };
        iconBg = '#E6F3FF';
        borderColor = '#1E90FF';
        titleColor = '#1E90FF';
        subtitleColor = '#4682B4';
        shadowColor = '#1E90FF';
        break;
      case 'temperature':
        cardStyle = { backgroundColor: '#FFF5F5' };
        iconBg = '#FFE4E1';
        borderColor = '#FF6347';
        titleColor = '#DC143C';
        subtitleColor = '#B22222';
        shadowColor = '#FF6347';
        break;
      case 'humidité':
        cardStyle = { backgroundColor: '#F8F8FF' };
        iconBg = '#F0E6FF';
        borderColor = '#9370DB';
        titleColor = '#8A2BE2';
        subtitleColor = '#663399';
        shadowColor = '#9370DB';
        break;
      case 'generale':
        cardStyle = { backgroundColor: '#F0FFF0' };
        iconBg = '#E6FFE6';
        borderColor = '#32CD32';
        titleColor = '#228B22';
        subtitleColor = '#006400';
        shadowColor = '#32CD32';
        break;
      default:
        cardStyle = { backgroundColor: '#FFF' };
        iconBg = '#F5F5F5';
        borderColor = '#E0E0E0';
        titleColor = '#333';
        subtitleColor = '#666';
        shadowColor = '#000';
        break;
    }

    // Ajustements selon la priorité
    let borderWidth = 4;
    let shadowOpacity = 0.15;
    
    switch (priority) {
      case 'élevé':
      case 'high':
        borderWidth = 6;
        shadowOpacity = 0.25;
        break;
      case 'moyen':
      case 'medium':
        borderWidth = 4;
        shadowOpacity = 0.15;
        break;
      case 'faible':
      case 'low':
        borderWidth = 3;
        shadowOpacity = 0.1;
        break;
    }

    return {
      cardStyle: {
        ...cardStyle,
        borderLeftColor: borderColor,
        borderLeftWidth: borderWidth,
        shadowColor: shadowColor,
        shadowOpacity: shadowOpacity,
      },
      iconStyle: {
        backgroundColor: iconBg,
        borderWidth: 2,
        borderColor: borderColor + '80', // Ajout de transparence
      },
      titleColor,
      subtitleColor,
    };
  };

  // Fonction pour rendre une notification
  const renderNotification = (notification: Notification) => {
    const icon = getNotificationIcon(notification.type);
    const { cardStyle, iconStyle, titleColor, subtitleColor } = getNotificationStyles(notification.type, notification.priority);
    
    return (
      <TouchableOpacity
        key={notification._id}
        style={[styles.macetaCard, cardStyle]}
        onPress={() => handleNotificationPress(notification)}
      >
        <View style={[styles.macetaImage, iconStyle]}>
          <Text style={{ fontSize: 24 }}>{icon}</Text>
        </View>
        <View style={styles.macetaTextCol}>
          <Text style={[styles.macetaTitle, { color: titleColor }]}>
            {notification.title}
          </Text>
          <Text style={[styles.macetaSubtitle, { color: subtitleColor }]}>
            {notification.plant.name} - {notification.message}
          </Text>
        </View>
        <View style={{ marginLeft: 8 }}>
          <Text style={{ 
            fontSize: 12, 
            color: titleColor, 
            fontWeight: 'bold',
            opacity: 0.8
          }}>
            {notification.priority === 'élevé' || notification.priority === 'high' ? '⚡⚡⚡' : 
             notification.priority === 'moyen' || notification.priority === 'medium' ? '⚡⚡' : '⚡'}
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
        <TouchableOpacity 
          onPress={handleTestNotification}
          style={{ marginLeft: 8 }}
        >
          <Text style={{ fontSize: 16, color: '#26CB66' }}>🧪</Text>
        </TouchableOpacity>
        <Image source={require('../../assets/images/Notification.jpg')} resizeMode="contain" />
      </View>

      {/* Barre de recherche sous le header */}
      <PlantSearch onPlantSelect={handlePlantSelection} style={{ width: '100%' }} />

      {/* Notifications dynamiques */}
      {loadingNotifications ? (
        <View style={[styles.macetaCard, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="small" color="#26CB66" />
          <Text style={styles.macetaSubtitle}>Chargement des notifications...</Text>
        </View>
      ) : notifications.length > 0 ? (
        <ScrollView 
          style={{ maxHeight: 120 }} 
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {notifications.slice(0, 2).map((notification) => renderNotification(notification))}
        </ScrollView>
      ) : (
        <View style={[styles.macetaCard, { 
          backgroundColor: '#F0FFF0', 
          borderLeftColor: '#32CD32', 
          borderLeftWidth: 4,
          shadowColor: '#32CD32',
          shadowOpacity: 0.1 
        }]}>
          <View style={[styles.macetaImage, { 
            backgroundColor: '#E6FFE6',
            borderWidth: 2,
            borderColor: '#90EE90'
          }]}>
            <Text style={{ fontSize: 24 }}>✅</Text>
          </View>
          <View style={styles.macetaTextCol}>
            <Text style={[styles.macetaTitle, { color: '#228B22' }]}>
              Toutes vos plantes sont en bonne santé
            </Text>
            <Text style={[styles.macetaSubtitle, { color: '#006400' }]}>
              Vos plantes sont épanouies et bien entretenues. Continuez ce bon travail !
            </Text>
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={{ 
              fontSize: 12, 
              color: '#228B22', 
              fontWeight: 'bold',
              opacity: 0.8
            }}>
              💚
            </Text>
          </View>
        </View>
      )}

      {/* Plantes statiques + dynamiques */}
      <Text style={[styles.headerTitle, { marginTop: 20, marginBottom: 20 }]}>Votre sélection de plantes</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row' }}>
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
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
              <ActivityIndicator size="large" color="#26CB66" />
            </View>
          ) : userPlants.length === 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
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
