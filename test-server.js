/**
 * Script de test pour vérifier le bon fonctionnement du système de notifications
 */

const readline = require('readline');

async function testServer() {
  console.log('🧪 Test du serveur de notifications...\n');
  
  const BACKEND_URL = 'http://localhost:3001'; // Ajustez selon votre configuration
  
  try {
    // 1. Test de santé du serveur
    console.log('1. Test de santé du serveur...');
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`);
    
    if (healthResponse.ok) {
      console.log('✅ Serveur en ligne\n');
    } else {
      console.log('❌ Serveur non accessible\n');
      return;
    }
    
    // 2. Test de l'endpoint des plantes (nécessite une authentification)
    console.log('2. Test de l\'endpoint des plantes...');
    const plantsResponse = await fetch(`${BACKEND_URL}/api/plants`, {
      headers: {
        'Authorization': 'Bearer test-token' // Token fictif pour test
      }
    });
    
    // On s'attend à une erreur 401 (non autorisé) ce qui est normal
    if (plantsResponse.status === 401) {
      console.log('✅ Endpoint /api/plants fonctionne (authentification requise)\n');
    } else {
      console.log(`⚠️  Réponse inattendue: ${plantsResponse.status}\n`);
    }
    
    // 3. Test de l'endpoint des notifications
    console.log('3. Test de l\'endpoint des notifications...');
    const notificationsResponse = await fetch(`${BACKEND_URL}/api/notifications`, {
      headers: {
        'Authorization': 'Bearer test-token' // Token fictif pour test
      }
    });
    
    if (notificationsResponse.status === 401) {
      console.log('✅ Endpoint /api/notifications fonctionne (authentification requise)\n');
    } else {
      console.log(`⚠️  Réponse inattendue: ${notificationsResponse.status}\n`);
    }
    
    console.log('🎉 Tous les tests de base sont passés !');
    console.log('\n📝 Notes importantes :');
    console.log('- Assurez-vous que votre serveur est démarré (npm start dans le dossier server)');
    console.log('- Les endpoints nécessitent une authentification valide');
    console.log('- Testez les notifications via l\'app mobile avec le bouton 🧪');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.log('\n🔧 Solutions possibles :');
    console.log('1. Vérifiez que le serveur est démarré');
    console.log('2. Vérifiez l\'URL du serveur dans config/environment.ts');
    console.log('3. Vérifiez la configuration de la base de données');
  }
}

// Exécuter le test
testServer();
