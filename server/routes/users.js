const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');

router.get('/library', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('library');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const library = user.library.map(item => ({
      id: item.plantId,
      common_name: item.plantData.common_name,
      scientific_name: item.plantData.scientific_name,
      default_image: item.plantData.default_image,
      care_info: item.plantData.care_info,
      status: item.plantData.status,
      daysToHarvest: item.plantData.daysToHarvest,
      addedAt: item.addedAt.toISOString()
    }));
    
    res.json({ library });
  } catch (error) {
    console.error('Erreur lors de la récupération de la bibliothèque:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/library', auth, async (req, res) => {
  try {
    const { plantId, plantData } = req.body;
    
    if (!plantId || !plantData) {
      return res.status(400).json({ message: 'plantId et plantData sont requis' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
 
    const existingPlant = user.library.find(item => item.plantId === plantId);
    if (existingPlant) {
      return res.status(409).json({ message: 'Plante déjà dans la bibliothèque' });
    }

    user.library.push({
      plantId,
      plantData: {
        common_name: plantData.common_name,
        scientific_name: plantData.scientific_name,
        default_image: plantData.default_image,
        care_info: plantData.care_info,
        status: plantData.status,
        daysToHarvest: plantData.daysToHarvest || '5 days'
      },
      addedAt: new Date()
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'Plante ajoutée à la bibliothèque avec succès',
      plant: {
        id: plantId,
        addedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la bibliothèque:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.delete('/library/:plantId', auth, async (req, res) => {
  try {
    const { plantId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const initialLength = user.library.length;
    user.library = user.library.filter(item => item.plantId !== plantId);
    
    if (user.library.length === initialLength) {
      return res.status(404).json({ message: 'Plante non trouvée dans la bibliothèque' });
    }
    
    await user.save();
    
    res.json({ message: 'Plante supprimée de la bibliothèque avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la bibliothèque:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.delete('/library', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    user.library = [];
    await user.save();
    
    res.json({ message: 'Bibliothèque vidée avec succès' });
  } catch (error) {
    console.error('Erreur lors du vidage de la bibliothèque:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/library/count', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('library');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({ count: user.library.length });
  } catch (error) {
    console.error('Erreur lors du comptage de la bibliothèque:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/library/check/:plantId', auth, async (req, res) => {
  try {
    const { plantId } = req.params;
    
    const user = await User.findById(req.user.id).select('library');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const isInLibrary = user.library.some(item => item.plantId === plantId);
    
    res.json({ isInLibrary });
  } catch (error) {
    console.error('Erreur lors de la vérification de la bibliothèque:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
