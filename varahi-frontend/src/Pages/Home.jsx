import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCardUI from "../Components/ProductCardUI";
import { GiDress } from "react-icons/gi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase.js";
import { motion } from "framer-motion";
import api from "../api/api.js";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is not logged in
        setTimeout(() => {
          navigate("/login"); // Redirect after a short delay
        }, 10000);
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [navigate]);
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 text-pink-700">
        <GiDress className="w-16 h-20 animate-bounce" />
      </div>
    );
  }

  return (
    <>
      {/*  Collection Strip Bar */}
      <div className="bg-pink-200 shadow-sm border-y border-pink-200 py-3 px-4">
        <div
          className="flex gap-6 font-mono text-sm sm:text-base font-medium text-gray-700 mx-auto md:justify-center overflow-x-auto whitespace-nowrap scrollbar-hide"
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {[
            { name: "Kurti", path: "/kurti" },
            { name: "Dupatta", path: "/duppata" },
            { name: "2pc Suits", path: "/two-piece-suits" },
            { name: "3pc Suits", path: "/three-piece-suits" },
            { name: "Leggings", path: "/leggings" },
            { name: "Palazzo", path: "/palazzo" },
            { name: "Pants", path: "/pants" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="hover:text-pink-600 transition whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/*  Marquee Strip  */}
      <div className="relative overflow-hidden bg-pink-50 border-y border-pink-200 h-10 shadow-inner">
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-pink-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-pink-50 to-transparent z-10 pointer-events-none" />

        {/* Scrolling content */}

        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            duration: window.innerWidth > 768 ? 30 : 15,
            ease: "linear",
            repeat: Infinity,
          }}
          className="whitespace-nowrap text-rose-600 font-medium py-2 px-4 text-[15px] flex items-center gap-8"
        >
          <span>|| श्री वरही बुटीक ||</span>
          <span> 🔥 Hurry Up ! Free Delivery on All Orders</span>
          <span>🛍️ Shop Now & Celebrate in Style! 💃</span>
          <span>|| श्री वरही बुटीक ||</span>
        </motion.div>
      </div>
      {/* 🛍️ Product Section */}
      <ProductCardUI
        pageTitle="Shree Varahi Boutique"
        pageDesc="Explore the elegance of our handpicked Collections"
        notFoundtitle="Loading"
        notFoundDesc="Coming Soon....!"
        products={products}
      />
    </>
  );
};

export default Home;
