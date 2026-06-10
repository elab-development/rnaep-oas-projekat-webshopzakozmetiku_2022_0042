const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getCart);
router.post('/', verifyToken, addToCart);
router.delete('/:id', verifyToken, removeFromCart);
router.delete('/', verifyToken, clearCart);

module.exports = router;