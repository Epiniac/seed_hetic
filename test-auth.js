#!/usr/bin/env node

const https = require('http');

const API_BASE_URL = 'http://localhost:3001';

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Test de base - Health check
async function testHealth() {
  return new Promise((resolve) => {
    const req = https.request(`${API_BASE_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('green', '✅ Health check: OK');
          resolve(true);
        } else {
          log('red', '❌ Health check: Failed');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      log('red', '❌ Serveur non accessible sur http://localhost:3001');
      resolve(false);
    });
    
    req.end();
  });
}

// Test d'inscription
async function testRegister() {
  return new Promise((resolve) => {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@test.com`,
      password: '123456'
    };

    const postData = JSON.stringify(testUser);
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          log('green', '✅ Inscription: OK');
          const response = JSON.parse(data);
          resolve({ success: true, data: response });
        } else {
          log('red', `❌ Inscription: Failed (${res.statusCode})`);
          console.log('Response:', data);
          resolve({ success: false });
        }
      });
    });
    
    req.on('error', (error) => {
      log('red', '❌ Erreur lors de l\'inscription:', error.message);
      resolve({ success: false });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test de connexion
async function testLogin(email, password) {
  return new Promise((resolve) => {
    const loginData = JSON.stringify({ email, password });
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('green', '✅ Connexion: OK');
          const response = JSON.parse(data);
          resolve({ success: true, token: response.token });
        } else {
          log('red', `❌ Connexion: Failed (${res.statusCode})`);
          resolve({ success: false });
        }
      });
    });
    
    req.on('error', (error) => {
      log('red', '❌ Erreur lors de la connexion:', error.message);
      resolve({ success: false });
    });
    
    req.write(loginData);
    req.end();
  });
}

// Test du profil
async function testProfile(token) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/profile',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          log('green', '✅ Récupération du profil: OK');
          resolve(true);
        } else {
          log('red', `❌ Récupération du profil: Failed (${res.statusCode})`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      log('red', '❌ Erreur lors de la récupération du profil:', error.message);
      resolve(false);
    });
    
    req.end();
  });
}

// Exécution des tests
async function runTests() {
  log('blue', '🧪 Test de l\'API d\'authentification...\n');
  
  // Test 1: Health check
  const healthOk = await testHealth();
  if (!healthOk) {
    log('red', '\n❌ Le serveur n\'est pas accessible. Assurez-vous qu\'il fonctionne sur le port 3001.');
    return;
  }
  
  // Test 2: Inscription
  const registerResult = await testRegister();
  if (!registerResult.success) {
    log('red', '\n❌ L\'inscription a échoué.');
    return;
  }
  
  // Extraire l'email et mot de passe du test
  const testEmail = registerResult.data.user.email;
  const testPassword = '123456';
  
  // Test 3: Connexion
  const loginResult = await testLogin(testEmail, testPassword);
  if (!loginResult.success) {
    log('red', '\n❌ La connexion a échoué.');
    return;
  }
  
  // Test 4: Profil
  await testProfile(loginResult.token);
  
  log('green', '\n🎉 Tous les tests sont passés avec succès !');
  log('yellow', '\n📱 Votre backend est prêt pour votre app React Native.');
}

runTests().catch(console.error);
