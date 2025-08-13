const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  //  Basic details
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },

  //  For products like dupatta (no sizes)
  singlePrice: {
    originalPrice: { type: Number },
    discountedPrice: { type: Number }
  },

  // For products with size-based pricing
  sizes: [
    {
      size: { type: String, required: true },
      originalPrice: { type: Number, required: true },
      discountedPrice: { type: Number, required: true },
      inStock: { type: Boolean, default: true } // optional per-size stock
    }
  ],

  // 📦 Optional general stock tracking
  stockCount: { type: Number, default: 0 },

  // 🏷️ Optional tags for filtering or search
  tags: [{ type: String }], // e.g. ["new", "2-piece", "cotton"]

  // 👁️ To toggle product visibility
  isActive: { type: Boolean, default: true }

}, { timestamps: true }); // 📅 adds createdAt & updatedAt

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

