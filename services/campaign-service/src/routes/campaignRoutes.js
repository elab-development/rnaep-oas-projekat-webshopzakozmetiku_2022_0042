const express = require('express');
const router = express.Router();
const { getAllCampaigns, getCampaign, addCampaign, validatePromoCode, addPromoCode } = require('../controllers/campaignController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllCampaigns);
router.get('/:id', verifyToken, getCampaign);
router.post('/', verifyAdmin, addCampaign);
router.post('/promo/validate', verifyToken, validatePromoCode);
router.post('/promo', verifyAdmin, addPromoCode);

module.exports = router;