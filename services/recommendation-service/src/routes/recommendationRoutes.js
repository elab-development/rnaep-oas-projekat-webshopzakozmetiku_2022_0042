const express = require('express');
const router = express.Router();
const {
  getPersonalizedRecommendations,
  getGeneralRecommendations,
  updateAfterPurchase,
  updateAfterReview,
  updateGeneralRecommendations,
  updateAfterBeautyProfile
} = require('../controllers/recommendationController');

router.get('/personalized/:userId', getPersonalizedRecommendations);
router.get('/general', getGeneralRecommendations);
router.post('/update/purchase', updateAfterPurchase);
router.post('/update/review', updateAfterReview);
router.post('/update/general', updateGeneralRecommendations);
router.post('/update/beauty-profile', updateAfterBeautyProfile);

module.exports = router;