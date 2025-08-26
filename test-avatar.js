const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Données de test
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Image de test en base64 (petit pixel transparent)
const testAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function testAvatarFunctionality() {
  try {
    console.log('🧪 Test de la fonctionnalité avatar...\n');

    // 1. Inscription
    console.log('1. Inscription...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      console.log('❌ Inscription échouée:', error.message);
      return;
    }

    const { token, user } = await registerResponse.json();
    console.log('✅ Inscription réussie:', user.name);

    // 2. Mise à jour de l'avatar
    console.log('\n2. Mise à jour de l\'avatar...');
    const avatarResponse = await fetch(`${API_BASE_URL}/auth/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ avatar: testAvatar })
    });

    if (!avatarResponse.ok) {
      const error = await avatarResponse.json();
      console.log('❌ Mise à jour avatar échouée:', error.message);
      return;
    }

    const { user: updatedUser } = await avatarResponse.json();
    console.log('✅ Avatar mis à jour avec succès');
    console.log('📸 Avatar URL présent:', !!updatedUser.avatar);

    // 3. Vérification du profil
    console.log('\n3. Vérification du profil...');
    const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!profileResponse.ok) {
      const error = await profileResponse.json();
      console.log('❌ Récupération profil échouée:', error.message);
      return;
    }

    const profile = await profileResponse.json();
    console.log('✅ Profil récupéré avec succès');
    console.log('📸 Avatar dans le profil:', !!profile.avatar);
    console.log('📧 Email:', profile.email);
    console.log('👤 Nom:', profile.name);

    console.log('\n🎉 Tous les tests ont réussi !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test seulement si le serveur est en marche
testAvatarFunctionality();
