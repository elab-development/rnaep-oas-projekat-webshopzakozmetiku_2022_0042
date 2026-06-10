const { PersonalizedRecommendation, GeneralRecommendation } = require('../models/recommendationModel');

const getPersonalizedRecommendations = async (req, res) => {
  try {
    const recommendations = await PersonalizedRecommendation.findOne({ userId: req.params.userId });
    if (!recommendations) {
      return res.status(404).json({ message: 'Preporuke nisu pronadjene' });
    }
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const getGeneralRecommendations = async (req, res) => {
  try {
    const recommendations = await GeneralRecommendation.find();
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const updateAfterPurchase = async (req, res) => {
  try {
    const { userId, productId, category, skinType } = req.body;

    let recommendation = await PersonalizedRecommendation.findOne({ userId });

    if (!recommendation) {
      recommendation = new PersonalizedRecommendation({
        userId,
        purchaseHistory: [],
        recommendedProducts: []
      });
    }

    recommendation.purchaseHistory.push({ productId, purchasedAt: new Date() });

    let score = 1.0;
    if (recommendation.beautyProfile?.skinType === skinType) score += 0.5;
    const purchaseCount = recommendation.purchaseHistory.filter(
      p => p.productId.toString() === productId
    ).length;
    if (purchaseCount > 1) score += 0.3;

    recommendation.recommendedProducts.push({
      productId,
      score,
      reason: `Preporuka na osnovu kupovine i beauty profila (tip koze: ${skinType})`
    });

    recommendation.generatedAt = new Date();
    await recommendation.save();

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const updateAfterReview = async (req, res) => {
  try {
    const { userId, productId, rating } = req.body;

    let recommendation = await PersonalizedRecommendation.findOne({ userId });
    if (!recommendation) {
      return res.status(404).json({ message: 'Korisnik nije pronadjen' });
    }

    const score = rating / 5.0;

    recommendation.recommendedProducts.push({
      productId,
      score,
      reason: `Preporuka na osnovu ocene ${rating}/5`
    });

    recommendation.generatedAt = new Date();
    await recommendation.save();

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const updateGeneralRecommendations = async (req, res) => {
  try {
    const { context, products } = req.body;

    let general = await GeneralRecommendation.findOne({ context });
    if (!general) {
      general = new GeneralRecommendation({ context, recommendedProducts: [] });
    }

    general.recommendedProducts = products.map(p => ({
      productId: p.productId,
      score: p.score,
      reason: context === 'bestsellers' ? 'Najprodavaniji proizvod' : 'Najbolje ocenjen proizvod'
    }));

    general.generatedAt = new Date();
    await general.save();

    res.json(general);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

module.exports = {
  getPersonalizedRecommendations,
  getGeneralRecommendations,
  updateAfterPurchase,
  updateAfterReview,
  updateGeneralRecommendations
};