const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:3001';

// Test pour récupérer les notifications
async function testNotifications() {
  try {
    console.log('🔍 Test de récupération des notifications...');
    
    // D'abord, on teste la route sans authentification pour voir ce qui se passe
    const response = await fetch(`${BACKEND_URL}/api/notifications?unreadOnly=true`);
    
    console.log('📋 Status de la réponse:', response.status);
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const notifications = await response.json();
      console.log('✅ Notifications reçues:', JSON.stringify(notifications, null, 2));
    } else {
      const error = await response.text();
      console.log('❌ Erreur:', error);
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error.message);
  }
}

// Test pour créer une notification de test
async function createTestNotification() {
  try {
    console.log('🔧 Création d\'une notification de test...');
    
    // Données d'une notification de test
    const testNotification = {
      user: '66eecce69cc2b4a8bf26ade9', // ID d'utilisateur de test (à ajuster)
      plant: '66eecce69cc2b4a8bf26adea', // ID de plante de test (à ajuster)
      type: 'arrosage',
      title: 'Test de notification - Arrosage urgent',
      message: 'Votre plante de test a besoin d\'eau immédiatement ! Humidité : 15%',
      priority: 'élevé',
      actionRequired: true
    };
    
    const response = await fetch(`${BACKEND_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testNotification)
    });
    
    console.log('📋 Status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Notification créée:', JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log('❌ Erreur:', error);
    }
    
  } catch (error) {
    console.error('💥 Erreur lors de la création:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests de notifications...\n');
  
  await testNotifications();
  console.log('\n' + '='.repeat(50) + '\n');
  await createTestNotification();
  
  console.log('\n✨ Tests terminés !');
}

runTests();
