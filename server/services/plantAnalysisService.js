const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class PlantAnalysisService {
  constructor() {
    this.modelPath = path.join(__dirname, '../ai-models/best.pt');
    this.pythonScript = path.join(__dirname, '../ai-models/analyze_plant.py');
    this.venvPython = path.join(__dirname, '../ai-models/venv/bin/python');
  }

  async analyzePlant(imageBase64) {
    return new Promise((resolve, reject) => {
      try {
        // Convertir base64 en buffer
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        
        // Créer un fichier temporaire
        const tempImagePath = path.join(__dirname, '../temp', `temp_${Date.now()}.jpg`);
        
        // S'assurer que le dossier temp existe
        const tempDir = path.dirname(tempImagePath);
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Écrire l'image temporaire
        fs.writeFileSync(tempImagePath, imageBuffer);
        
        console.log('🐍 Exécution du script Python...');
        console.log('Script:', this.pythonScript);
        console.log('Image:', tempImagePath);
        console.log('Modèle:', this.modelPath);
        
        // Exécuter le script Python avec l'environnement virtuel
        const pythonProcess = spawn(this.venvPython, [
          this.pythonScript,
          tempImagePath,
          this.modelPath
        ]);
        
        let result = '';
        let error = '';
        
        pythonProcess.stdout.on('data', (data) => {
          result += data.toString();
          console.log('📤 Sortie Python:', data.toString());
        });
        
        pythonProcess.stderr.on('data', (data) => {
          error += data.toString();
          console.log('❌ Erreur Python:', data.toString());
        });
        
        pythonProcess.on('close', (code) => {
          console.log('🔚 Processus Python terminé avec le code:', code);
          console.log('📄 Résultat complet:', result);
          console.log('⚠️ Erreur complète:', error);
          
          // Nettoyer le fichier temporaire
          try {
            fs.unlinkSync(tempImagePath);
          } catch (cleanupError) {
            console.warn('Erreur lors du nettoyage:', cleanupError);
          }
          
          if (code === 0) {
            try {
              // Nettoyer le résultat (enlever les espaces, nouvelles lignes)
              const cleanResult = result.trim();
              console.log('🧹 Résultat nettoyé:', cleanResult);
              
              const analysisResult = JSON.parse(cleanResult);
              console.log('✅ JSON parsé avec succès:', analysisResult);
              resolve(analysisResult);
            } catch (parseError) {
              console.error('❌ Erreur de parsing JSON:', parseError);
              console.error('Résultat brut:', result);
              reject(new Error(`Erreur lors du parsing du résultat Python: ${parseError.message}`));
            }
          } else {
            reject(new Error(`Erreur Python (code ${code}): ${error}`));
          }
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new PlantAnalysisService();