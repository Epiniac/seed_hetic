const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  library: [{
    plantId: {
      type: String,
      required: true
    },
    plantData: {
      common_name: String,
      scientific_name: [String],
      default_image: {
        thumbnail: String,
        small_url: String,
        regular_url: String
      },
      care_info: {
        watering: String,
        temperature: mongoose.Schema.Types.Mixed,
        humidity: mongoose.Schema.Types.Mixed
      },
      status: String,
      daysToHarvest: String
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]

}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);