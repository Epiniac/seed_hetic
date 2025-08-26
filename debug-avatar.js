const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Données de test
const testUser = {
  name: 'Avatar Test User',
  email: 'avatar-test@example.com',
  password: 'password123'
};

// Image de test en base64 (petit pixel transparent)
const testAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function testAvatarWithDebugging() {
  try {
    console.log('🧪 Test de débogage avatar...\n');

    // 1. Inscription
    console.log('1. Inscription...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      console.log('❌ Inscription échouée:', error);
      return;
    }

    const { token, user } = await registerResponse.json();
    console.log('✅ Inscription réussie:', user.name);
    console.log('🔑 Token reçu:', token.substring(0, 20) + '...');

    // 2. Test de l'authentification
    console.log('\n2. Test authentification...');
    const profileTest = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!profileTest.ok) {
      const error = await profileTest.json();
      console.log('❌ Test authentification échoué:', error);
      return;
    }

    console.log('✅ Authentification OK');

    // 3. Mise à jour de l'avatar
    console.log('\n3. Mise à jour de l\'avatar...');
    const avatarResponse = await fetch(`${API_BASE_URL}/auth/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ avatar: testAvatar })
    });

    console.log('📊 Statut de la réponse:', avatarResponse.status);

    if (!avatarResponse.ok) {
      const error = await avatarResponse.json();
      console.log('❌ Mise à jour avatar échouée:', error);
      return;
    }

    const { user: updatedUser } = await avatarResponse.json();
    console.log('✅ Avatar mis à jour avec succès');
    console.log('📸 Avatar URL présent:', !!updatedUser.avatar);

    console.log('\n🎉 Test réussi !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

testAvatarWithDebugging();
