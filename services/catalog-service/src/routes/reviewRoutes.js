const express = require('express');
const router = express.Router();
const { getReviewsByProduct, createReview, deleteReview } = require('../controllers/reviewController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/:productId', getReviewsByProduct);
router.post('/', verifyToken, createReview);
router.delete('/:id', verifyAdmin, deleteReview);

module.exports = router;