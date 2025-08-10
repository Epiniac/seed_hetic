const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
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
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Plant', plantSchema);