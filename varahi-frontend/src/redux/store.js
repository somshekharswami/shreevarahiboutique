import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice"; 

// Load cart from localStorage
const loadCart = () => {
  try {
    const saved = localStorage.getItem("cartState");
    return saved ? JSON.parse(saved) : undefined;
  } catch {
    return undefined;
  }
};

// Save cart to localStorage
const saveCart = (cartSlice) => {
  try {
    localStorage.setItem("cartState", JSON.stringify(cartSlice));
  } catch {
    /* ignore write errors */
  }
};

const preloadedState = loadCart() ? { cart: loadCart() } : undefined;

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveCart(store.getState().cart); // persist only cart
});

export default store;
