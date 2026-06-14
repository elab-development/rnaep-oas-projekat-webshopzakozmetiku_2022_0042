const express = require('express');
const router = express.Router();
const { getAllCampaigns, getCampaign, addCampaign, validatePromoCode, addPromoCode } = require('../controllers/campaignController');
const { verifyToken, verifyMarketingManager } = require('../middleware/authMiddleware');

router.get('/', getAllCampaigns);
router.get('/:id', getCampaign);
router.post('/', verifyMarketingManager, addCampaign);
router.post('/promo/validate', validatePromoCode);
router.post('/promo', verifyMarketingManager, addPromoCode);

module.exports = router;