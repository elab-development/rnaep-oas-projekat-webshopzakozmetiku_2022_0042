const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Nema tokena, pristup odbijen' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Nevazeci token' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Pristup samo za administratore' });
    }
    next();
  });
};

const verifyMarketingManager = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'MARKETING_MANAGER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Pristup samo za marketing menadžere' });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin, verifyMarketingManager };