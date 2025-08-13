import React, { lazy, Suspense, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { GiDress } from "react-icons/gi";
import "react-medium-image-zoom/dist/styles.css";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
const Zoom = lazy(() => import("react-medium-image-zoom"));

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");

  const cartItems = useSelector((state) => state.cart.cartItems);
  const quantity =
    cartItems.find((p) => p._id === id && p.size === selectedSize)?.quantity ||
    0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Auto-select first available size if not set
  useEffect(() => {
    if (product?.sizes?.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0].size);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-pink-700">
        <GiDress className="w-16 h-20 animate-bounce" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff7f5] to-[#fef2f2] px-4">
        <motion.div
          className="bg-white shadow-xl rounded-2xl p-6 max-w-md text-center border border-[#f3d1d1]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-pink-600 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-700 mb-3">
            The product you’re looking for doesn’t exist or couldn’t be loaded.
          </p>
          <p className="text-gray-500 text-sm italic">
            This may be due to a server issue or an incorrect product link.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
              ← Go Back Home
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Left Image */}
        <div className="bg-white p-6 rounded-xl shadow-md flex justify-center items-center">
          <Suspense fallback={<div>Loading Image Zoom...</div>}>
            <Zoom>
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-96 object-contain"
              />
            </Zoom>
          </Suspense>
        </div>

        {/* Right Details */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
            {product.title}
          </h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="mb-3 text-pink-600 font-bold text-xl">
            {product.singlePrice?.discountedPrice
              ? `₹${product.singlePrice.discountedPrice}`
              : product.sizes?.length > 0
              ? (() => {
                  const selected = product.sizes.find(
                    (s) => s.size === selectedSize
                  );
                  return selected ? `₹${selected.discountedPrice}` : "₹N/A";
                })()
              : "₹N/A"}
          </div>

          <div className="mb-4 text-sm text-pink-800 bg-pink-100 px-3 py-1 rounded-full inline-block">
            {product.category}
          </div>

          {/* Size Options */}
          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-medium">
                Select Size:
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    className={`px-3 py-1 rounded border text-sm ${
                      selectedSize === s.size
                        ? "bg-pink-600 text-white"
                        : "bg-white border-pink-300 text-pink-600 hover:bg-pink-50"
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cart Actions */}
          {quantity === 0 ? (
            <button
              disabled={product.sizes?.length > 0 && !selectedSize}
              onClick={() => {
                dispatch(addToCart({ ...product, size: selectedSize }));
                toast.success("Added to cart");
              }}
              className="w-full px-4 py-2 mt-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() =>
                    dispatch(
                      decreaseQuantity({ _id: product._id, size: selectedSize })
                    )
                  }
                  className="bg-pink-100 text-pink-800 px-3 py-1 rounded hover:bg-pink-200"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() =>
                    dispatch(
                      increaseQuantity({ _id: product._id, size: selectedSize })
                    )
                  }
                  className="bg-pink-100 text-pink-800 px-3 py-1 rounded hover:bg-pink-200"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => navigate("/cart")}
                className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition"
              >
                Go to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
