import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

// ✅ Fetch cart from backend
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (firebaseUID) => {
   
    const res = await api.get(`/cart/${firebaseUID}`);
   
    return res.data.items || [];
  }
);

// ✅ Save cart to backend
export const saveCart = createAsyncThunk(
  "cart/saveCart",
  async ({ firebaseUID, cartItems }) => {
    const items = cartItems
      .filter((item) => item._id || (item.productId && item.productId._id))
      .map((item) => {
        const product = item.productId || item;
        return {
          productId: product._id,
          quantity: item.quantity,
         size: item.size || "", // force size to empty string if undefined
          color: item.color,
          price: product.price, // already resolved and stored
          title: product.title,
          imageUrl: product.imageUrl,
        };
      });

   
    await api.post(`/cart/${firebaseUID}`, { items });
    return cartItems;
  }
);

// ✅ Initial state
const initialState = {
  cartItems: [],
  status: "idle",
  error: null,
};

// ✅ Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },

    addToCart: (state, action) => {
      const {
        _id,
        productId,
        size,
        singlePrice,
        sizes,
        title,
        imageUrl,
        color,
      } = action.payload;

      const existingItem = state.cartItems.find((item) => {
        const itemId = item._id || item.productId?._id;
        const payloadId = _id || productId?._id;
        return itemId === payloadId && (item.size || "") === (size || "");

      });

      // ✅ Resolve price
      let resolvedPrice = null;
      if (singlePrice && typeof singlePrice.discountedPrice === "number") {
        resolvedPrice = singlePrice.discountedPrice;
      } else if (sizes?.length > 0) {
        const sizeObj = sizes.find((s) => s.size === size);
        if (sizeObj && typeof sizeObj.discountedPrice === "number") {
          resolvedPrice = sizeObj.discountedPrice;
        }
      }

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: 1,
          price: resolvedPrice,
          title,
          color,
          imageUrl,
        });
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.cartItems.find((i) => {
        const itemId = i._id || i.productId?._id;
        return itemId === action.payload._id && i.size === action.payload.size;
      });
      if (item) item.quantity += 1;
    },

    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find((i) => {
        const itemId = i._id || i.productId?._id;
        return itemId === action.payload._id && i.size === action.payload.size;
      });
      if (item) {
        if (item.quantity === 1) {
          state.cartItems = state.cartItems.filter((i) => {
            const itemId = i._id || i.productId?._id;
            return !(itemId === action.payload._id && i.size === action.payload.size);
          });
        } else {
          item.quantity -= 1;
        }
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => {
        const itemId = i._id || i.productId?._id;
        return !(itemId === action.payload._id && i.size === action.payload.size);
      });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
     
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload;
      
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.error("Cart fetch failed:", action.error.message);
      })
      .addCase(saveCart.pending, () => {
       
      })
      .addCase(saveCart.fulfilled, () => {
       
      })
      .addCase(saveCart.rejected, (state, action) => {
        console.error("Cart save failed:", action.error.message);
      });
  },
});

// ✅ Export actions
export const {
  setCart,
  clearCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} = cartSlice.actions;

// ✅ Export reducer
export default cartSlice.reducer;
