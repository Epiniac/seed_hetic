const plantAnalysisService = require('../services/plantAnalysisService');

const analyzePlant = async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        error: 'Image requise' 
      });
    }
    
    // Analyser l'image avec le modèle
    const analysisResult = await plantAnalysisService.analyzePlant(image);
    
    if (analysisResult.error) {
      return res.status(500).json({ 
        error: 'Erreur lors de l\'analyse',
        details: analysisResult.error 
      });
    }
    
    res.json({
      success: true,
      analysis: analysisResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'analyse de la plante',
      details: error.message 
    });
  }
};

module.exports = {
  analyzePlant
};