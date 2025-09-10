import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { BACKEND_URL } from '@/config/environment';

// Interface pour le résultat d'analyse
interface AnalysisResult {
  is_healthy: boolean;
  status: string;
  confidence: number;
  confidence_percentage: number;
}

// Interface pour la réponse de l'API
interface ApiResponse {
  success: boolean;
  analysis: AnalysisResult;
  timestamp: string;
  error?: string;
}

export default function AiDetect() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Nous avons besoin de votre permission pour afficher la caméra</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const startCamera = () => {
    setShowCamera(true);
  };

  const goBack = () => {
    setShowCamera(false);
    setAnalysisResult(null);
  };

  const takePictureAndAnalyze = async () => {
    if (cameraRef.current) {
      try {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        
        // Prendre la photo
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
        });
        
        // Envoyer au backend pour analyse
        const response = await fetch(`${BACKEND_URL}/api/plant-analysis/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: photo.base64,
          }),
        });
        
        const result: ApiResponse = await response.json();
        
        if (result.success) {
          setAnalysisResult(result.analysis);
          
          // Afficher une alerte avec le résultat
          const status = result.analysis.is_healthy ? 'En bonne santé' : 'Malade';
          Alert.alert(
            'Résultat de l\'analyse',
            `${status}\nConfiance: ${result.analysis.confidence_percentage}%`
          );
        } else {
          Alert.alert('Erreur', result.error || 'Impossible d\'analyser la plante');
        }
        
      } catch (error) {
        console.error('Erreur:', error);
        Alert.alert('Erreur', 'Impossible de prendre la photo ou d\'analyser');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  // Écran d'accueil
  if (!showCamera) {
    return (
      <View style={styles.homeContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Analyse IA des Plantes</Text>
          <Text style={styles.subtitle}>
            Prenez une photo de votre plante pour analyser sa santé avec l'intelligence artificielle
          </Text>
          
          <TouchableOpacity style={styles.ctaButton} onPress={startCamera}>
            <Text style={styles.ctaButtonText}>Prendre une photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Écran caméra
  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing} 
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.captureButton, isAnalyzing && styles.disabledButton]} 
          onPress={takePictureAndAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.captureText}>Analyser</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {analysisResult && (
        <View style={[
          styles.resultContainer, 
          analysisResult.is_healthy ? styles.healthyResult : styles.unhealthyResult
        ]}>
          <Text style={styles.resultText}>
            {analysisResult.is_healthy ? '✅ Plante en bonne santé' : '⚠️ Plante malade'}
          </Text>
          <Text style={styles.confidenceText}>
            Confiance: {analysisResult.confidence_percentage}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Styles pour l'écran d'accueil
  homeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  ctaButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Styles pour l'écran caméra
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureButton: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  captureText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  resultContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
  },
  healthyResult: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  unhealthyResult: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confidenceText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});