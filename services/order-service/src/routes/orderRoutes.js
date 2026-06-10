const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.get('/:id', verifyToken, getOrderById);
router.put('/:id/status', verifyAdmin, updateOrderStatus);

module.exports = router;