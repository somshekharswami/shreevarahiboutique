import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api"

export const saveCart = createAsyncThunk(
  "cart/saveCart",
  async ({ firebaseUID, cartItems }) => {
    // ✅ Better item mapping with validation
    const items = cartItems
      .filter(item => item._id || (item.productId && item.productId._id)) // Filter valid items
      .map(item => {
        const product = item.productId || item;
        return {
          productId: product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          // Optional: store current price for reference
          price: product.price,
          title: product.title,
          imageUrl: product.imageUrl,
        };
      });

   
    
    await api.post(`/cart/${firebaseUID}`, { items });
    return cartItems;
  }
);

export const syncCartToDB = createAsyncThunk(
  "cart/syncToDB",
  async (_, { getState }) => {
    const { cart } = getState();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const firebaseUID = currentUser?.uid;
    if (!firebaseUID) return;

    // ✅ Same validation as above
    const items = cart.cartItems
      .filter(item => item._id || (item.productId && item.productId._id))
      .map(item => {
        const product = item.productId || item;
        return {
          productId: product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: product.price,
          title: product.title,
          imageUrl: product.imageUrl,
        };
      });

    await api.post(`/cart/${firebaseUID}`, { items });
  }
);