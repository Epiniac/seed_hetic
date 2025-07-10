import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/Dashboard.styles';

export default function DashboardScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('house');
  const router = useRouter();

  // Animation pour la barre verte
  const barAnim = useRef(new Animated.Value(0)).current;
  const categories = [
    { key: 'house', label: 'House Plants' },
    { key: 'garden', label: 'Garden Plants' },
    { key: 'office', label: 'Office Plants' },
  ];

  // Largeur d'une colonne (on suppose 3 colonnes égales)
  const screenWidth = Dimensions.get('window').width;
  const colWidth = (screenWidth - 40) / 3; // 40 = marginHorizontal total

  useEffect(() => {
    const idx = categories.findIndex(cat => cat.key === selectedCategory);
    Animated.spring(barAnim, {
      toValue: idx * colWidth,
      useNativeDriver: false,
    }).start();
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      {/* Header personnalisé */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.circle} />
          <View style={styles.textCol}>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>The best activity to do</Text>
          </View>
        </View>
        <Image source={require('../../assets/images/Notification.jpg')} resizeMode="contain" />
      </View>

      {/* Barre de recherche sous le header */}
      <View style={styles.searchBarRow}>
        <Image source={require('../../assets/images/Search.png')} style={styles.searchIcon} resizeMode="contain" />
        <TextInput
          style={styles.searchInputFake}
          placeholder="Search"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
        {/* <Image source={require('../../assets/images/Microo.png')} style={styles.microIcon} resizeMode="contain" /> */}
      </View>

      {/* Carte Maceta sous la SearchBar */}
      <View style={styles.macetaCard}>
        <View style={styles.macetaTextCol}>
          <Text style={styles.macetaTitle}>Your daisy is dehydrated</Text>
          <Text style={styles.macetaSubtitle}>It's look like that daisy need more water</Text>
        </View>
        <Image source={require('../../assets/images/Maceta.jpg')} style={styles.macetaImage} resizeMode="cover" />
      </View>

      {/* Catégories de plantes */}
      <View style={styles.categoriesRow}>
        {categories.map((cat, idx) => (
          <TouchableOpacity
            key={cat.key}
            style={styles.categoryCol}
            activeOpacity={0.7}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text style={selectedCategory === cat.key ? styles.categorySelected : styles.categoryUnselected}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Barre animée */}
        <Animated.View
          style={[
            styles.categoryBar,
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              transform: [{ translateX: barAnim }],
              width:  colWidth,
            },
          ]}
        />
      </View>

      {/* Deux images avec titre en dessous */}
      <View style={styles.imagesRow}>

        <TouchableOpacity style={styles.imageCol} onPress={() => router.push('/(tabs)/Product')}>
          <Image source={require('../../assets/images/Fraises.png')} style={styles.plantImage} resizeMode="cover" />
          <Text style={styles.plantImageTitle}>Strawberry</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageCol} onPress={() => router.push('/(tabs)/Product')}>
          <Image source={require('../../assets/images/Fraises.png')} style={styles.plantImage} resizeMode="cover" />
          <Text style={styles.plantImageTitle}>Strawberry</Text>
        </TouchableOpacity>
        
      </View>

      {/* Le reste de l'écran */}
      {/* <Text style={styles.title}>Ceci est le 3ᵉ écran</Text> */}
    </View>
  );
}
