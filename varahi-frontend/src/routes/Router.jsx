import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { GiDress } from "react-icons/gi";

// Layout & Core
import Layout from "../MainLayout/Layout";
import Home from "../Pages/Home";
import SearchResults from "../Components/SearchResults";
import Login from "../Pages/Login";
const Cart = lazy(() => import("../Pages/Cart"));
const ProductDetail = lazy(() => import("../Pages/ProductDetail"));
// Lazy-loaded Pages (non-critical)
const Kurti = lazy(() => import("../Pages/Kurti"));
const Leggings = lazy(() => import("../Pages/Leggings"));
const Palazzo = lazy(() => import("../Pages/Palazzo"));
const Pants = lazy(() => import("../Pages/Pants"));
const Duppata = lazy(() => import("../Pages/Duppata"));
const Twopiecesuits = lazy(() => import("../Pages/Twopiecesuits"));
const Threepiecesuits = lazy(() => import("../Pages/Threepiecesuits"));
const NotFound = lazy(() => import("../Pages/NotFound"));
const FAQ = lazy(() => import("../Pages/FAQ"));
const Contact = lazy(() => import("../Pages/Contact"));
const ShippingPolicy = lazy(() => import("../Pages/ShippingPolicy"));
const ReturnsExchanges = lazy(() => import("../Pages/ReturnsExchanges"));

const AdminLogin = lazy(() => import("../Pages/AdminLogin"));
const AdminDashboard = lazy(() => import("../Pages/AdminDashboard"));
const AdminOrder = lazy(() => import("../Pages/AdminOrder"));

const CartCheckout = lazy(() => import("../Pages/CartCheckout"));
const MyOrders = lazy(() => import("../Pages/MyOrders"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense
        fallback={
          <div className="min-h-screen flex flex-col items-center justify-center space-y-4 text-pink-700">
            <GiDress className="w-16 h-20 animate-bounce" />
          </div>
        }
      >
        <Layout />
      </Suspense>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },
      { path: "/search", element: <SearchResults /> },

      // Lazy loaded pages
      { path: "/kurti", element: <Kurti /> },
      { path: "/leggings", element: <Leggings /> },
      { path: "/palazzo", element: <Palazzo /> },
      { path: "/pants", element: <Pants /> },
      { path: "/duppata", element: <Duppata /> },
      { path: "/two-piece-suits", element: <Twopiecesuits /> },
      { path: "/three-piece-suits", element: <Threepiecesuits /> },

      { path: "/faq", element: <FAQ /> },
      { path: "/contact", element: <Contact /> },
      { path: "/shipping-policy", element: <ShippingPolicy /> },
      { path: "/returns", element: <ReturnsExchanges /> },

      { path: "/cart-checkout", element: <CartCheckout /> },
      { path: "/my-orders", element: <MyOrders /> },

      { path: "/admin-login", element: <AdminLogin /> },
      { path: "/admin-dashboard", element: <AdminDashboard /> },
      { path: "/admin-orderr", element: <AdminOrder /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
