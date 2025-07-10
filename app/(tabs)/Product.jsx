import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/Product.styles';
import { useRouter } from 'expo-router';

const { width } = require('react-native').Dimensions.get('window');
const IPHONE_16_WIDTH = 430; // iPhone 16 Pro Max width in pt
const SCALE = width / IPHONE_16_WIDTH;

export default function ProductScreen() {
  const router = useRouter();
  return (
    <View style={styles.root}>
      {/* Header avec Return, Statistique, Like */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/Dashboard')}>
          <Image source={require('@/assets/images/Return.png')} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistique</Text>
        <Image source={require('@/assets/images/Like.png')} style={styles.headerIcon} resizeMode="contain" />
      </View>
      {/* Image de la plante (Fraises.png) */}
      <View style={styles.plantImageContainer}>
        <Image source={require('@/assets/images/Fraises.png')} style={styles.plantImage} resizeMode="cover" />
      </View>
      {/* Titre et sous-titre */}
      <Text style={styles.plantTitle}>Plantain Lily</Text>
      <Text style={styles.plantSubtitle}>5 days to harvest</Text>

      {/* Deux carrés sur la même ligne */}
      <View style={styles.statsRowTop}>

        {/* Carte 1 : Room Light */}
        <View style={[styles.statCardSquare, { backgroundColor: '#F5FFD1' }]}> 
          <View style={styles.squareIconRow}>
            <Image source={require('@/assets/images/Sun.png')} style={styles.squareIcon} resizeMode="contain" />
          </View>
          <Text style={styles.squareLabel}>Room Light</Text>
          <Text style={styles.squareValue}>24° C</Text>
        </View>

        {/* Carte 2 : Humidity */}
        <View style={[styles.statCardSquare, { backgroundColor: '#E4FFD4' }]}> 
          <View style={styles.squareIconRow}>
            <Image source={require('@/assets/images/Humidity.png')} style={styles.squareIcon} resizeMode="contain" />
          </View>
          <Text style={styles.squareLabel}>Humidity</Text>
          <Text style={styles.squareValue}>80 %</Text>
        </View>
      </View>


      {/* Rectangle en dessous, centré */}
      <View style={styles.statsRowBottom}>
        <View style={[styles.statCardRect, { backgroundColor: '#E9F5FE' }]}> 
          <View style={styles.rectContentRow}>
            <Image source={require('@/assets/images/Soil.png')} style={styles.rectIcon} resizeMode="contain" />
            <View style={styles.rectTextCol}>
              <Text style={styles.rectTitle}>Soil</Text>
              <Text style={styles.rectSubtitle}>Clay type</Text>
            </View>
            <View style={styles.rectValueCol}>
              <Text style={styles.rectValue}>70 %</Text>
            </View>
          </View>
        </View>
      </View>

      
      {/* Le reste du contenu viendra après, à compléter selon la maquette */}
    </View>
  );
}
