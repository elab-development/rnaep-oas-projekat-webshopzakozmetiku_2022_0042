const { sendMessage } = require('../kafka/producer');
const Review = require('../models/reviewModel');

const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product_id: req.params.productId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      user_id: req.user.id
    });
    await review.save();

    try {
      await sendMessage('review-submitted', {
        userId: req.user.id,
        productId: review.product_id,
        rating: review.rating
      });
      console.log('Review-submitted event sent');
    } catch (err) {
      console.error('Kafka error:', err.message);
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Recenzija nije pronadjena' });
    }
    res.json({ message: 'Recenzija obrisana' });
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

module.exports = { getReviewsByProduct, createReview, deleteReview };