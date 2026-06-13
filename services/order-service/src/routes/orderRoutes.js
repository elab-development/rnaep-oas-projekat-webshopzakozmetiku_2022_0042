const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
const {
  verifyToken,
  verifyAdmin,
  verifyAdminOrMarketing,
} = require("../middleware/authMiddleware");
const { optionalToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/admin/all", verifyAdminOrMarketing, getAllOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id/status", verifyAdmin, updateOrderStatus);
router.post("/guest", optionalToken, createOrder);

module.exports = router;
