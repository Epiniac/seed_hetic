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
  
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plantingDate: {
    type: Date,
    default: Date.now
  },
  careInstructions: {
    watering: {
      frequency: String,
      amount: String,
      lastWatered: Date
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
  currentStats: {
    temperature: {
      value: Number,
      unit: { type: String, default: '°C' },
      lastUpdated: Date
    },
    humidity: {
      value: Number,
      unit: { type: String, default: '%' },
      lastUpdated: Date
    },
  },
  status: {
    type: String,
    enum: ['bonne sante', 'besoin eau', 'besoin attention', 'critique'],
    default: 'bonne sante'
  },
  notes: [{
    content: String,
    date: { type: Date, default: Date.now }
  }],
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
