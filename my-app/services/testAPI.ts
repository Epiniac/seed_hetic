/**
 * Script de test pour l'API interne de plantes
 * À utiliser pour vérifier que le frontend peut communiquer avec le backend
 */

import { testApiConnection, searchPlants, getPlantDetails } from '../services/unifiedPlantApi';
import { BACKEND_URL } from '../config/environment';

export const testInternalAPI = async () => {
  console.log('🧪 Test de l\'API interne de plantes');
  console.log('📍 URL du backend:', BACKEND_URL);
  
  try {
    // Test 1: Connectivité
    console.log('\n1️⃣ Test de connectivité...');
    const connectivity = await testApiConnection();
    console.log('✅ Résultats de connectivité:', connectivity);
    
    if (!connectivity.internal) {
      console.log('❌ L\'API interne n\'est pas accessible');
      return false;
    }
    
    // Test 2: Recherche générale
    console.log('\n2️⃣ Test de recherche générale...');
    const searchResponse = await searchPlants('', 1, 5);
    console.log('✅ Recherche réussie');
    console.log('   Nombre de plantes:', searchResponse.data.length);
    if (searchResponse.data.length > 0) {
      console.log('   Première plante:', searchResponse.data[0].common_name);
    }
    
    // Test 3: Recherche spécifique
    console.log('\n3️⃣ Test de recherche spécifique (basilic)...');
    const basilicResponse = await searchPlants('basilic', 1, 5);
    console.log('✅ Recherche basilic réussie');
    console.log('   Résultats trouvés:', basilicResponse.data.length);
    
    // Test 4: Détails d'une plante
    if (basilicResponse.data.length > 0) {
      console.log('\n4️⃣ Test des détails d\'une plante...');
      const plantId = basilicResponse.data[0].id;
      const details = await getPlantDetails(plantId);
      console.log('✅ Détails récupérés');
      console.log('   Nom:', details.common_name);
      console.log('   Catégorie:', (details as any).category || 'Non définie');
      console.log('   Difficulté:', (details as any).difficulty || 'Non définie');
    }
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('💡 Votre frontend peut maintenant utiliser votre propre API de plantes');
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    return false;
  }
};

export const testLibraryAPI = async () => {
  console.log('\n📚 Test des fonctionnalités de bibliothèque...');
  
  try {
    // Import des services de bibliothèque et d'authentification
    const { getLibrary, getLibraryCount } = await import('../services/userLibraryService');
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    
    // Vérifier si l'utilisateur est connecté
    const token = await AsyncStorage.default.getItem('@auth_token');
    console.log('🔐 État de connexion:', token ? 'Connecté ✅' : 'Non connecté ❌');
    
    if (!token) {
      console.log('⚠️  Pour sauvegarder dans MongoDB, connectez-vous d\'abord !');
      console.log('   → Allez sur l\'onglet "Connect" pour créer un compte');
    }
    
    // Test de récupération de la bibliothèque
    const library = await getLibrary();
    const count = await getLibraryCount();
    
    console.log('✅ Bibliothèque accessible');
    console.log('   Mode:', token ? 'MongoDB (utilisateur connecté)' : 'Stockage local (non connecté)');
    console.log('   Nombre de plantes dans la bibliothèque:', count);
    console.log('   Plantes:', library.map(p => p.common_name).join(', ') || 'Aucune');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test de la bibliothèque:', error);
    return false;
  }
};

// Fonction principale de test
export const runAllTests = async () => {
  console.log('🚀 Démarrage des tests complets...\n');
  
  const apiTest = await testInternalAPI();
  const libraryTest = await testLibraryAPI();
  
  console.log('\n📊 Résumé des tests:');
  console.log('   API interne:', apiTest ? '✅ OK' : '❌ Échec');
  console.log('   Bibliothèque:', libraryTest ? '✅ OK' : '❌ Échec');
  
  if (apiTest && libraryTest) {
    console.log('\n🎉 Système prêt ! Vous pouvez maintenant:');
    console.log('   • Rechercher des plantes dans votre propre catalogue');
    console.log('   • Ajouter/supprimer des plantes de la bibliothèque utilisateur');
    console.log('   • Utiliser votre API au lieu de l\'API externe');
    
    // Vérifier si l'utilisateur est connecté
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    const token = await AsyncStorage.default.getItem('@auth_token');
    
    if (!token) {
      console.log('\n💡 IMPORTANT: Pour sauvegarder dans MongoDB:');
      console.log('   1. Allez sur l\'onglet "Connect" (icône profil)');
      console.log('   2. Créez un compte ou connectez-vous');
      console.log('   3. Puis utilisez la recherche de plantes');
      console.log('   4. Les plantes seront sauvegardées dans votre BDD users !');
    }
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez la configuration.');
  }
  
  return apiTest && libraryTest;
};

// Fonction utilitaire pour tester l'authentification
export const testAuthentication = async () => {
  console.log('\n🔐 Test de l\'authentification...');
  
  try {
    const { BACKEND_URL } = await import('../config/environment');
    
    // Créer un utilisateur de test
    const testUser = {
      name: 'Test User Plant',
      email: `test.plant.${Date.now()}@example.com`,
      password: '123456'
    };
    
    console.log('   📝 Création d\'un utilisateur de test...');
    const registerResponse = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });
    
    if (registerResponse.ok) {
      const data = await registerResponse.json();
      console.log('   ✅ Utilisateur créé avec succès');
      console.log('   🔑 Token reçu:', data.token ? 'Oui' : 'Non');
      
      // Sauvegarder le token
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.setItem('@auth_token', data.token);
      await AsyncStorage.default.setItem('@user_data', JSON.stringify(data.user));
      
      console.log('   💾 Token sauvegardé localement');
      return true;
    } else {
      console.log('   ❌ Erreur lors de la création:', registerResponse.status);
      return false;
    }
  } catch (error) {
    console.error('   ❌ Erreur lors du test d\'authentification:', error);
    return false;
  }
};

// Fonction pour tester un compte existant
export const testExistingAccount = async () => {
  console.log('\n🔐 Test du compte existant...');
  
  try {
    const { BACKEND_URL } = await import('../config/environment');
    
    // Connexion avec le compte existant
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'jimbarbot55@gmail.com',
        password: 'moimoi79'
      }),
    });
    
    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('   ✅ Connexion réussie');
      console.log('   👤 Utilisateur:', data.user.name, '(' + data.user.email + ')');
      
      // Sauvegarder le token
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.default.setItem('@auth_token', data.token);
      await AsyncStorage.default.setItem('@user_data', JSON.stringify(data.user));
      
      console.log('   💾 Token sauvegardé localement');
      
      // Tester la bibliothèque
      const libraryResponse = await fetch(`${BACKEND_URL}/api/users/library`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`,
        },
      });
      
      if (libraryResponse.ok) {
        const libraryData = await libraryResponse.json();
        console.log('   📚 Bibliothèque MongoDB:', libraryData.library.length, 'plantes');
        if (libraryData.library.length > 0) {
          console.log('   🌱 Plantes:', libraryData.library.map((p: any) => p.common_name).join(', '));
        }
      }
      
      return true;
    } else {
      console.log('   ❌ Erreur de connexion:', loginResponse.status);
      return false;
    }
  } catch (error) {
    console.error('   ❌ Erreur lors du test du compte existant:', error);
    return false;
  }
};
