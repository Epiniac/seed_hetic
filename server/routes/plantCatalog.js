const express = require('express');
const router = express.Router();
const PlantCatalog = require('../models/PlantCatalog');
const auth = require('../middlewares/auth');


router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (q && q.trim()) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { species: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }
    
    query.isPublic = true;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const plants = await PlantCatalog.find(query)
      .select('name species description image careInstructions category difficulty sunlight tags')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    const total = await PlantCatalog.countDocuments(query);
    
    const formattedPlants = plants.map(plant => ({
      id: plant._id,
      common_name: plant.name,
      scientific_name: [plant.species],
      description: plant.description || 'Aucune description disponible',
      default_image: plant.image ? {
        thumbnail: plant.image,
        small_url: plant.image,
        regular_url: plant.image
      } : null,
      care_info: {
        watering: plant.careInstructions?.watering?.frequency || 'Non défini',
        temperature: plant.careInstructions?.temperature || {},
        humidity: plant.careInstructions?.humidity || {}
      },
      category: plant.category,
      difficulty: plant.difficulty,
      sunlight: plant.sunlight,
      tags: plant.tags || []
    }));
    
    res.json({
      data: formattedPlants,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total: total,
        last_page: Math.ceil(total / limitNum),
        from: skip + 1,
        to: Math.min(skip + limitNum, total)
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la recherche de plantes:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la recherche', 
      error: error.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const plant = await PlantCatalog.findById(req.params.id);
    
    if (!plant) {
      return res.status(404).json({ message: 'Plante non trouvée dans le catalogue' });
    }

    const formattedPlant = {
      id: plant._id,
      common_name: plant.name,
      scientific_name: [plant.species],
      description: plant.description || 'Aucune description disponible',
      default_image: plant.image ? {
        thumbnail: plant.image,
        small_url: plant.image,
        regular_url: plant.image
      } : null,

      type: plant.category || 'Plante personnalisée',
      cycle: plant.growthRate || 'Variable selon l\'espèce',
      watering: plant.careInstructions?.watering?.frequency || 'Non défini',
      maintenance: plant.difficulty || 'Personnalisé',

      care_instructions: {
        watering: plant.careInstructions?.watering || {},
        temperature: plant.careInstructions?.temperature || {},
        humidity: plant.careInstructions?.humidity || {}
      },

      category: plant.category,
      difficulty: plant.difficulty,
      sunlight: plant.sunlight,
      growth_rate: plant.growthRate,
      tags: plant.tags || []
    };
    
    res.json(formattedPlant);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des détails:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération des détails', 
      error: error.message 
    });
  }
});


router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const plants = await PlantCatalog.find({ isPublic: true })
      .select('name species description image careInstructions category difficulty')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    const formattedPlants = plants.map(plant => ({
      id: plant._id,
      common_name: plant.name,
      scientific_name: [plant.species],
      description: plant.description || 'Aucune description disponible',
      default_image: plant.image ? {
        thumbnail: plant.image,
        small_url: plant.image,
        regular_url: plant.image
      } : null
    }));
    
    res.json({
      data: formattedPlants
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des plantes populaires:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
});

module.exports = router;
