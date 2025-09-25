const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const authController = {
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      const user = new User({ email, password, name });
      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Identifiants invalides' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Identifiants invalides' });
      }

      const token = generateToken(user._id);

      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  updateAvatar: async (req, res) => {
    try {
      console.log('📸 Début mise à jour avatar pour utilisateur:', req.user.id);
      const { avatar } = req.body;
      
      if (!avatar) {
        console.log('❌ Avatar manquant dans la requête');
        return res.status(400).json({ message: 'URL de l\'avatar requis' });
      }

      console.log('📸 Taille de l\'avatar reçu:', avatar.length, 'caractères');

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatar },
        { new: true }
      ).select('-password');

      if (!user) {
        console.log('❌ Utilisateur non trouvé:', req.user.id);
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      console.log('✅ Avatar mis à jour avec succès pour:', user.email);

      res.json({
        message: 'Avatar mis à jour avec succès',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        }
      });
    } catch (error) {
      console.error('❌ Erreur mise à jour avatar:', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = authController;