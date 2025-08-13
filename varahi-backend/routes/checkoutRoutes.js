const express = require("express");
const Razorpay = require("razorpay");
const Cart = require("../models/Cart");
const validateCart = require("../utils/validatecart");
const Order = require("../models/Order");
require("dotenv").config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/start", async (req, res) => {
  try {
    const { firebaseUID, address } = req.body;
    if (!firebaseUID || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }
//Retrieves the user's cart using the Firebase UID.
    const cart = await Cart.findOne({ firebaseUID });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }
  

    const { valid, total, message } = await validateCart(cart.items);
    if (!valid) { console.error("Cart validation failed:", message);
      return res.status(400).json({ message });
    }
 
    const amountPaise = total * 100;

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { firebaseUID },
    });

    res.json({ //: Send Response to Frontend
      orderId: razorpayOrder.id,
      amount: amountPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Checkout Error:", err);
    res.status(500).json({ message: "Server error during checkout" });
  }
});

module.exports = router;