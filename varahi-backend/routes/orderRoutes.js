const express = require("express");
const router = express.Router();
const { getUserOrders } = require("../controllers/getUserOrders")// ✅ FIXED
const Order = require("../models/Order");
const verifyToken = require("../middleware/verifyToken");
// Route to fetch orders by firebaseUID
router.get("/user/:firebaseUID", getUserOrders);

router.get("/test", (req, res) => {
  res.send("✅ Order routes working!");
});

// GET all orders (admin only)
router.get("/admin-orderr", async (req, res) => {
  try {
    const allOrders = await Order.find().sort({ createdAt: -1 }); // latest first
    res.json(allOrders);
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    res.status(500).json({ error: "Server error while fetching all orders" });
  }
});

module.exports = router;

