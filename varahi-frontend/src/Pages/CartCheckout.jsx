import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart, clearCart } from "../redux/slices/cartSlice";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CartCheckout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartStatus = useSelector((state) => state.cart.status);
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false); // ✅ Add payment progress state
  const [form, setForm] = useState({
    name: user?.name || currentUser?.name || "",
    phone: user?.phone || "",
    email: user?.email || currentUser?.email || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Debug logging
  useEffect(() => {}, [
    currentUser,
    cartItems,
    cartStatus,
    authLoading,
    paymentInProgress,
  ]);

  // ✅ Modified: Don't redirect if payment is in progress
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
      return;
    }

    // ✅ Don't redirect to cart if payment is in progress
    if (
      !authLoading &&
      currentUser &&
      cartItems.length === 0 &&
      cartStatus !== "loading" &&
      !paymentInProgress
    ) {
      navigate("/cart");
    }
  }, [
    authLoading,
    currentUser,
    cartItems,
    cartStatus,
    navigate,
    paymentInProgress,
  ]);

  // Refresh cart when component mounts
  useEffect(() => {
    if (
      currentUser &&
      cartItems.length === 0 &&
      cartStatus === "idle" &&
      !paymentInProgress
    ) {
      dispatch(fetchCart(currentUser.uid));
    }
  }, [currentUser, dispatch, cartItems.length, cartStatus, paymentInProgress]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const allFieldsFilled = Object.values(form).every((val) => val.trim() !== "");

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = item.productId || item;
      return total + (product.price || 0) * item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!allFieldsFilled) {
      toast.error("Please fill all shipping details.");
      return;
    }

    if (!currentUser) {
      toast.error("User not logged in");
      return;
    }

    try {
      setLoading(true);

      // Call backend to validate cart and create Razorpay order
      const res = await fetch("http://localhost:5000/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUID: currentUser.uid,
          address: form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message && data.message.includes("Price")) {
          toast.error("Product prices have changed. Please review your cart.");
          navigate("/cart");
          return;
        }
        if (data.message && data.message.includes("not found")) {
          toast.error(
            "Some items are no longer available. Please review your cart."
          );
          navigate("/cart");
          return;
        }
        throw new Error(data.message || "Checkout failed.");
      }

      if (!data.orderId) {
        throw new Error("Failed to create order. Please try again.");
      }

      // ✅ Set payment in progress BEFORE opening Razorpay modal
      setPaymentInProgress(true);

      // Open Razorpay modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Varahi Boutique",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(
              "http://localhost:5000/payment/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  firebaseUID: currentUser.uid,
                  cartItems: cartItems.map((item) => {
                    const product = item.productId || item;
                    return {
                      productId: product._id,
                      title: product.title,
                      imageUrl: product.imageUrl,
                      size: item.size || "",
                      price: product.price,
                      quantity: item.quantity,
                    };
                  }),
                  shippingAddress: form,
                }),
              }
            );

            const verifyJson = await verifyRes.json();
            if (verifyJson.status === "success") {
              toast.success("✅ Payment verified!");
              dispatch(clearCart());

              // Clear backend cart
              await fetch(`http://localhost:5000/cart/${currentUser.uid}`, {
                method: "DELETE",
              });

              navigate(`/my-orders`, {
                replace: true,
              });
            } else {
              toast.error("❌ Payment verification failed");
              setPaymentInProgress(false);
            }
          } catch (verifyError) {
            console.error("❌ Payment verification error:", verifyError);
            toast.error("Payment verification failed. Please contact support.");
            setPaymentInProgress(false);
          }
        },

        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          address: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
        },
        theme: {
          color: "#B19A99",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentInProgress(false); // ✅ Reset payment state on dismiss
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("❌ Payment failed:", response.error);
        toast.error(
          `Payment failed: ${response.error.description || "Please try again."}`
        );
        setLoading(false);
        setPaymentInProgress(false); // ✅ Reset payment state on failure
      });

      rzp.open();
    } catch (err) {
      console.error("💥 Error during checkout:", err);
      toast.error(err.message || "Something went wrong during checkout");
      setLoading(false);
      setPaymentInProgress(false); // ✅ Reset payment state on error
    }
  };

  // Show loading while auth is loading or cart is loading
  if (authLoading || cartStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center bg-gradient-to-br from-pink-100 to-purple-100 justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show message if no user
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Please log in to continue</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-pink-600 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ Show payment processing message if payment is in progress and cart is empty
  if (paymentInProgress && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Processing payment...</p>
          <p className="text-sm text-gray-600 mt-2">
            Please wait while we complete your order
          </p>
        </div>
      </div>
    );
  }

  // ✅ Show message if cart is empty and payment is not in progress
  if (cartItems.length === 0 && !paymentInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  const currentTotal = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            🧾 Order Summary
          </h2>
          {cartItems.map((item) => {
            const product = item.productId || item;
            return (
              <div
                key={item._id || product._id}
                className="flex justify-between mb-2"
              >
                <span className="text-gray-700">
                  {product.title}
                  <span className="text-sm text-gray-500">
                    {" "}
                    (x{item.quantity})
                  </span>
                  {item.size && (
                    <span className="text-sm text-gray-500">
                      {" "}
                      - {item.size}
                    </span>
                  )}
                </span>
                <span className="text-pink-600 font-medium">
                  ₹{(product.price || 0) * item.quantity}
                </span>
              </div>
            );
          })}
          <div className="border-t pt-2 mt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-pink-600">₹{currentTotal}</span>
            </div>
            <p className="bg-blue-50 text-blue-800 border border-blue-200 px-4 py-3 rounded-lg text-sm sm:text-base font-medium shadow-sm w-full max-w-md mx-auto mt-4 text-center">
              💳 Currently accepting prepaid payments only
              <br /> Cash on Delivery will be available soon!
            </p>
          </div>
        </section>

        {/* Shipping Form */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📬 Shipping Information
          </h2>
          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: "name", type: "text", required: true },
                { name: "phone", type: "tel", required: true },
                { name: "email", type: "email", required: true },
              ].map(({ name, type, required }) => (
                <input
                  key={name}
                  name={name}
                  type={type}
                  placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                  value={form[name]}
                  onChange={handleChange}
                  required={required}
                  disabled={loading || paymentInProgress}
                  className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                />
              ))}
              <textarea
                name="address"
                placeholder="Complete Address"
                value={form.address}
                onChange={handleChange}
                required
                disabled={loading || paymentInProgress}
                rows="3"
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
              />
              <div className="grid grid-cols-2 gap-4">
                {["city", "state"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={handleChange}
                    required
                    disabled={loading || paymentInProgress}
                    className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                  />
                ))}
              </div>
              <input
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                required
                disabled={loading || paymentInProgress}
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="text-gray-600 hover:underline"
                disabled={loading || paymentInProgress}
              >
                ← Back to Cart
              </button>
              <button
                type="submit"
                disabled={!allFieldsFilled || loading || paymentInProgress}
                className={`${
                  !allFieldsFilled || loading || paymentInProgress
                    ? "bg-pink-200 text-white cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700"
                } text-white px-6 py-2 rounded-lg transition duration-300 ease-in-out font-medium tracking-wide shadow-sm hover:shadow-md`}
              >
                {loading || paymentInProgress ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${currentTotal}`
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CartCheckout;
