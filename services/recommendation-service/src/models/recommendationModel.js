const mongoose = require('mongoose');

const personalizedRecommendationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  beautyProfile: {
    skinType: String,
    allergies: [String],
    preferredBrands: [String],
    preferredScents: [String]
  },
  purchaseHistory: [{
    productId: mongoose.Schema.Types.ObjectId,
    purchasedAt: Date
  }],
  recommendedProducts: [{
    productId: mongoose.Schema.Types.ObjectId,
    score: Number,
    reason: String
  }],
  generatedAt: { type: Date, default: Date.now }
});

const generalRecommendationSchema = new mongoose.Schema({
  context: { type: String, required: true },
  recommendedProducts: [{
    productId: mongoose.Schema.Types.ObjectId,
    score: Number,
    reason: String
  }],
  generatedAt: { type: Date, default: Date.now }
});

const PersonalizedRecommendation = mongoose.model('PersonalizedRecommendation', personalizedRecommendationSchema);
const GeneralRecommendation = mongoose.model('GeneralRecommendation', generalRecommendationSchema);

module.exports = { PersonalizedRecommendation, GeneralRecommendation };