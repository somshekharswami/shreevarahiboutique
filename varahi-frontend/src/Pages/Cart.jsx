import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  saveCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const firebaseUID = useSelector((state) => state.auth.currentUser?.uid);
  const cartItems = useSelector((state) => state.cart.cartItems);

  // ✅ Helper function to get correct price from schema
  const getEffectivePrice = (product, size) => {
    if (product.singlePrice?.discountedPrice) {
      return product.singlePrice.discountedPrice;
    }
    if (product.sizes?.length) {
      const sizeObj = product.sizes.find((s) => s.size === size);
      return sizeObj?.discountedPrice || 0;
    }
    return 0;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const product = item.productId || item;
    const price = getEffectivePrice(product, item.size);
    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (firebaseUID) {
      dispatch(saveCart({ firebaseUID, cartItems }));
    }
  }, [cartItems, firebaseUID, dispatch]);

  const handleCheckout = () => {
    navigate("/cart-checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen m-1 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="w-80 h-96 m-1">
          <img src="/empty-cart.svg" alt="Empty cart" />
          <br />
          <h2 className="text-2xl font-mono font-semibold text-gray-600 mb-2">
            Your Cart is Empty
          </h2>
          <br />
          <button
            onClick={() => navigate("/")}
            className="bg-pink-600 font-semibold text-white px-6 py-2 rounded-lg transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-medium font-mono text-gray-800 mb-8">
          Your Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const product = item.productId || item;
              if (!product) return null;
              const price = getEffectivePrice(product, item.size);
              return (
                <div
                  key={`${product._id}-${item.size || product.title}`}
                  className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-24 h-24 object-contain border rounded"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {product.title}
                    </h2>
                    <p className="text-gray-500 text-sm capitalize">
                      {product.category}
                    </p>
                    <p className="text-pink-600 font-bold text-md">₹{price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() =>
                          dispatch(
                            decreaseQuantity({
                              _id: product._id,
                              size: item.size,
                            })
                          )
                        }
                        className="bg-pink-100 text-pink-800 px-2 py-1 rounded hover:bg-pink-200"
                      >
                        -
                      </button>
                      <span className="text-md font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            increaseQuantity({
                              _id: product._id,
                              size: item.size,
                            })
                          )
                        }
                        className="bg-pink-100 text-pink-950 px-2 py-1 rounded hover:bg-pink-200"
                      >
                        +
                      </button>
                      <button
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              _id: product._id,
                              size: item.size,
                            })
                          )
                        }
                        className="ml-4 text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {item.size && <span>Size: {item.size} </span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  <div className="text-md font-semibold text-gray-700">
                    ₹{price * item.quantity}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Cart Summary
            </h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Total Price:</span>
              <span className="font-semibold text-pink-600">₹{totalPrice}</span>
            </div>
            <button
              className="bg-pink-600 w-full text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
