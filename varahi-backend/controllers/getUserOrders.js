// controllers/orderController.js
const Order = require("../models/Order");

const getUserOrders = async (req, res) => {
  try {
    const { firebaseUID } = req.params;

    const orders = await Order.find({ firebaseUID }).sort({ createdAt: -1 });

    res.status(200).json(orders); // ✅ Returns orders from MongoDB           
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};
module.exports = { getUserOrders };
