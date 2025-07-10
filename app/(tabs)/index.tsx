import { ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import styles from '../styles/index.styles';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ImageBackground 
      source={require('@/assets/images/Background.jpg')}
      style={styles.backgroundFull}
    >
      <View style={[styles.centerContent, { backgroundColor: 'transparent' }]}>
        <Image
          source={require('@/assets/images/Logo.jpg')}
          style={styles.logo}
        />
        <Text style={styles.title}>
          Nurture <Text style={styles.boldGreen}>Your Garden</Text> Cultivate You Joy
        </Text>
        <Text style={styles.subtitle}>Make your gardening experience as easy and enjoyable as possible</Text>
      </View>


      {/* Bouton pour commencer l'inscription */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/authen/authen')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      
    </ImageBackground>
  );
}
