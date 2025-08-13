// models/Order.js
const mongoose = require("mongoose");


const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

  // “flattened” fields so future product edits do not corrupt past orders
  title:    { type: String,  required: true },
  imageUrl: { type: String,  required: true },
  size:     { type: String  },               // may be undefined (e.g. free‑size)
  price:    { type: Number,  required: true },  // unit price at purchase time
  quantity: { type: Number,  required: true, min: 1 }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, sparse: true },
    firebaseUID: { type: String, required: true, index: true },

    items: [orderItemSchema],

    shippingAddress: {
      name:     { type: String, required: true },
      phone:    { type: String, required: true },
      email:    { type: String, required: true },
      address:  { type: String, required: true },
      city:     { type: String, required: true },
      state:    { type: String, required: true },
      pincode:  { type: String, required: true }
    },

    payment: {
      razorpay_order_id:   String,
      razorpay_payment_id: String,
      status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created"
      },
      amount: Number  // in paise for exact matching
    }
  },
  { timestamps: true }  // adds createdAt / updatedAt
);

module.exports = mongoose.model("Order", orderSchema);
