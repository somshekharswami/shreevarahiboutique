const Product = require("../models/Product");
const mongoose = require("mongoose");

module.exports = async function validateCart(items) {
  let total = 0;
  const validItems = items.filter(item => item.productId);

  if (validItems.length === 0) {
    return { valid: false, message: "No valid items in cart." };
  }

  console.log("Validating items:", validItems.length);

  for (const item of validItems) {
    const productId = item.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error("Invalid productId format:", productId);
      return { valid: false, message: "Invalid product ID format in cart." };
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      console.error("Product not found for ID:", productId);
      return { valid: false, message: `Product not found in catalogue.` };
    }

    let priceToUse = null;

    if (product.singlePrice?.discountedPrice != null) {
      priceToUse = product.singlePrice.discountedPrice;
    } else if (item.size && product.sizes && Array.isArray(product.sizes)) {
      const sizeInfo = product.sizes.find(s => s.size === item.size);
      if (!sizeInfo) {
        return {
          valid: false,
          message: `Size "${item.size}" for "${product.title}" is unavailable.`,
        };
      }
      priceToUse = sizeInfo.discountedPrice;
    }

    if (priceToUse == null) {
      return {
        valid: false,
        message: `Could not determine price for "${product.title}".`,
      };
    }

    total += priceToUse * item.quantity;

    console.log(`✅ ${product.title} | Qty: ${item.quantity} | ₹${priceToUse}`);
  }

  console.log("Total calculated:", total);
  return { valid: true, total };
};
