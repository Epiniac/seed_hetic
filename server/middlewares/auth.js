const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant, accès refusé' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Assurer que req.user a bien un id
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar
    };
    
    next();
  } catch (error) {
    console.error('❌ Erreur authentification:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = auth