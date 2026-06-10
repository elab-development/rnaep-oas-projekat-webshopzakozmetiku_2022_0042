const express = require('express');
const router = express.Router();
const {
  getPersonalizedRecommendations,
  getGeneralRecommendations,
  updateAfterPurchase,
  updateAfterReview,
  updateGeneralRecommendations
} = require('../controllers/recommendationController');

router.get('/personalized/:userId', getPersonalizedRecommendations);
router.get('/general', getGeneralRecommendations);
router.post('/update/purchase', updateAfterPurchase);
router.post('/update/review', updateAfterReview);
router.post('/update/general', updateGeneralRecommendations);

module.exports = router;