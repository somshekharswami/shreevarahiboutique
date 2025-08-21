import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

export default function ProductCardUI({
  pageTitle,
  pageDesc,
  notFoundtitle,
  notFoundDesc,
  products = [],
}) {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const getQuantity = (_id) => {
    const item = cartItems.find((p) => p._id === _id);
    return item ? item.quantity : 0;
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <h1
          className="text-3xl font-serif text-gray-700 mb-4"
          aria-label="notfoundtitle"
        >
          {notFoundtitle || "No Products Found"}
        </h1>
        <p
          className="text-md text-gray-600 font-light"
          aria-label="notfounddesc"
        >
          {notFoundDesc ||
            "Please check back later or explore other categories."}
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 py-12 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-serif font-semibold text-[#b11257] text-center mt-1">
              {pageTitle || "Shree Varahi Boutique"}
            </h1>
            <p className="text-md sm:text-lg text-gray-700 font-light font-serif max-w-2xl mx-auto leading-relaxed">
              {pageDesc ||
                "Explore our handpicked collection of ethnic fashion. Elegance and tradition woven into every thread."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <motion.div
                key={product._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src={optimizeCloudinaryUrl(product.imageUrl, 256)}
                    alt={product.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/fallback.jpg";
                    }}
                    className="w-full h-48 sm:h-56 object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                  />
                </div>

                <div className="p-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors font-serif">
                    {product.title}
                  </h2>
                  <p className="text-gray-700 text-sm sm:text-base font-normal font-serif line-clamp-2 mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xl font-sans">
                      {/* Original Price - Strikethrough */}
                      <span className="line-through text-pink-700 mr-2">
                        ₹
                        {product.singlePrice?.originalPrice
                          ? product.singlePrice.originalPrice
                          : product.sizes?.length > 0
                          ? Math.min(
                              ...product.sizes.map((s) => s.originalPrice)
                            )
                          : "N/A"}
                      </span>

                      {/* Discounted Price - Highlighted */}
                      <span className="font-bold text-green-700">
                        ₹
                        {product.singlePrice?.discountedPrice
                          ? product.singlePrice.discountedPrice
                          : product.sizes?.length > 0
                          ? Math.min(
                              ...product.sizes.map((s) => s.discountedPrice)
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product._id}`);
                    }}
                    className="w-full font-sans px-4 py-2 mt-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl shadow-md transition-all duration-200"
                  >
                    View Item
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
