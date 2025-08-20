// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
// import { runAllTests, testAuthentication, testExistingAccount } from '../services/testAPI';

// export default function TestConnection() {
//   const [testResults, setTestResults] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleRunTests = async () => {
//     setIsLoading(true);
//     setTestResults('');
    
//     try {
//       // Capturer les logs de console
//       const originalLog = console.log;
//       const originalError = console.error;
//       const originalWarn = console.warn;
      
//       let logs = '';
//       console.log = (...args) => {
//         logs += args.join(' ') + '\n';
//         originalLog(...args);
//       };
//       console.error = (...args) => {
//         logs += 'ERROR: ' + args.join(' ') + '\n';
//         originalError(...args);
//       };
//       console.warn = (...args) => {
//         logs += 'WARN: ' + args.join(' ') + '\n';
//         originalWarn(...args);
//       };
      
//       await runAllTests();
      
//       // Restaurer console
//       console.log = originalLog;
//       console.error = originalError;
//       console.warn = originalWarn;
      
//       setTestResults(logs);
//     } catch (error) {
//       setTestResults('Erreur: ' + (error as Error).message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTestExistingAccount = async () => {
//     setIsLoading(true);
    
//     try {
//       const success = await testExistingAccount();
//       if (success) {
//         Alert.alert(
//           'Succès !', 
//           'Connexion avec le compte jimbarbot55@gmail.com réussie. Vérifiez les logs pour voir la bibliothèque MongoDB !'
//         );
//       } else {
//         Alert.alert('Erreur', 'Impossible de se connecter avec le compte existant');
//       }
//     } catch (error) {
//       Alert.alert('Erreur', (error as Error).message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateTestUser = async () => {
//     setIsLoading(true);
    
//     try {
//       const success = await testAuthentication();
//       if (success) {
//         Alert.alert(
//           'Succès !', 
//           'Utilisateur de test créé et connecté. Vous pouvez maintenant tester l\'ajout de plantes à la bibliothèque MongoDB !'
//         );
//       } else {
//         Alert.alert('Erreur', 'Impossible de créer l\'utilisateur de test');
//       }
//     } catch (error) {
//       Alert.alert('Erreur', (error as Error).message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>🧪 Tests de Connexion MongoDB</Text>
        
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Étape 1A: Tester votre compte existant</Text>
//           <TouchableOpacity 
//             style={[styles.button, styles.existingButton]}
//             onPress={handleTestExistingAccount}
//             disabled={isLoading}
//           >
//             <Text style={styles.buttonText}>
//               {isLoading ? 'Connexion...' : '🔑 Se connecter avec jimbarbot55@gmail.com'}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Étape 1B: Créer un utilisateur de test</Text>
//           <TouchableOpacity 
//             style={[styles.button, styles.primaryButton]}
//             onPress={handleCreateTestUser}
//             disabled={isLoading}
//           >
//             <Text style={styles.buttonText}>
//               {isLoading ? 'Création...' : '👤 Créer utilisateur de test'}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Étape 2: Tester l'API complète</Text>
//           <TouchableOpacity 
//             style={[styles.button, styles.secondaryButton]}
//             onPress={handleRunTests}
//             disabled={isLoading}
//           >
//             <Text style={styles.buttonText}>
//               {isLoading ? 'Tests en cours...' : '🧪 Lancer tous les tests'}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {testResults ? (
//           <View style={styles.resultsContainer}>
//             <Text style={styles.resultsTitle}>📊 Résultats des tests:</Text>
//             <ScrollView style={styles.resultsScroll}>
//               <Text style={styles.resultsText}>{testResults}</Text>
//             </ScrollView>
//           </View>
//         ) : null}

//         <View style={styles.instructionsContainer}>
//           <Text style={styles.instructionsTitle}>📝 Instructions:</Text>
//           <Text style={styles.instructionsText}>
//             1. Cliquez sur "Créer utilisateur de test" pour vous connecter automatiquement{'\n'}
//             2. Lancez les tests pour vérifier la connectivité{'\n'}
//             3. Utilisez ensuite la barre de recherche normalement{'\n'}
//             4. Les plantes seront sauvegardées dans MongoDB !
//           </Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   content: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#333',
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   button: {
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   primaryButton: {
//     backgroundColor: '#26CB66',
//   },
//   secondaryButton: {
//     backgroundColor: '#007AFF',
//   },
//   existingButton: {
//     backgroundColor: '#FF9500',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   resultsContainer: {
//     marginTop: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//   },
//   resultsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   resultsScroll: {
//     maxHeight: 300,
//   },
//   resultsText: {
//     fontFamily: 'Courier',
//     fontSize: 12,
//     color: '#666',
//   },
//   instructionsContainer: {
//     marginTop: 20,
//     backgroundColor: '#e3f2fd',
//     borderRadius: 10,
//     padding: 15,
//   },
//   instructionsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#1976d2',
//   },
//   instructionsText: {
//     fontSize: 14,
//     color: '#333',
//     lineHeight: 20,
//   },
// });
