const mongoose = require('mongoose');

const plantCatalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  // Informations d'entretien par défaut pour le catalogue
  careInstructions: {
    watering: {
      frequency: String,
      amount: String
    },
    temperature: {
      min: Number,
      max: Number,
      optimal: Number
    },
    humidity: {
      min: Number,
      max: Number,
      optimal: Number
    },
  },
  // Métadonnées pour le catalogue
  category: {
    type: String,
    enum: ['intérieur', 'extérieur', 'aromatique', 'légume', 'fruit', 'fleur'],
    default: 'intérieur'
  },
  difficulty: {
    type: String,
    enum: ['facile', 'moyen', 'difficile'],
    default: 'facile'
  },
  sunlight: {
    type: String,
    enum: ['faible', 'moyenne', 'forte'],
    default: 'moyenne'
  },
  growthRate: {
    type: String,
    enum: ['lente', 'moyenne', 'rapide'],
    default: 'moyenne'
  },
  // Indique si cette plante est disponible dans le catalogue public
  isPublic: {
    type: Boolean,
    default: true
  },
  // Tags pour faciliter la recherche
  tags: [String]
}, {
  timestamps: true
});

// Index pour la recherche
plantCatalogSchema.index({ name: 'text', species: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('PlantCatalog', plantCatalogSchema);
