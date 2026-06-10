const express = require('express');
const router = express.Router();
const { getProfile, getBeautyProfile, createOrUpdateBeautyProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/profile', verifyToken, getProfile);
router.get('/beauty-profile', verifyToken, getBeautyProfile);
router.post('/beauty-profile', verifyToken, createOrUpdateBeautyProfile);

module.exports = router;