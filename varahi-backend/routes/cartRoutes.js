const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Get cart for a user
router.get("/:firebaseUID", async (req, res) => {
  try {
    const cart = await Cart.findOne({ firebaseUID: req.params.firebaseUID })
      .populate("items.productId");
    
    if (!cart) {
      return res.json({ items: [] });
    }
    
    // ✅ Filter out items with missing productId and structure properly
    const items = cart.items
      .filter(item => item.productId) // Remove items where productId is null/undefined
      .map(item => ({
        _id: item.productId._id,
        productId: item.productId, // Keep the full populated object
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.productId.price,
        title: item.productId.title,
        imageUrl: item.productId.imageUrl,
        category: item.productId.category,
      }));
    
   
    res.json({ items });
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Save/update cart for a user
router.post("/:firebaseUID", async (req, res) => {
  try {
    const { items } = req.body;
    
    // ✅ Filter out invalid items before saving
    const validItems = items.filter(item => item.productId);
    
  
    
    const cart = await Cart.findOneAndUpdate(
      { firebaseUID: req.params.firebaseUID },
      { items: validItems },
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (err) {
    console.error("Cart save error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Add DELETE route to clear cart
router.delete("/:firebaseUID", async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    
    // Clear cart items for the user
    await Cart.findOneAndUpdate(
      { firebaseUID },
      { items: [] },
      { new: true, upsert: true }
    );
    
   
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Cart clear error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;