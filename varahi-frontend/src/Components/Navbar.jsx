import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgShoppingBag } from "react-icons/cg";
import { GrCart } from "react-icons/gr";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = ({ searchItem, onSearchChange, onClearSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchItem.trim()) {
      navigate(`/search?q=${searchItem.trim()}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-pink-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-[32px] md:text-[40px] font-serif font-semibold tracking-normal leading-none hover:text-pink-200 transition"
          >
            VB
          </Link>

          {/* Desktop Search */}
          <div className=" md:flex flex-1 justify-center px-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                aria-label="searchBar"
                placeholder="kurti, dupatta, palazzo.."
                value={searchItem}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg outline-none text-black placeholder-gray-500 font-mono"
              />
              {searchItem && (
                <button
                  onClick={onClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 text-xl font-bold"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex space-x-6 items-center">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span>👗 {currentUser.name}</span>
                <button
                  aria-label="logout"
                  onClick={handleLogout}
                  className="hover:text-red-400 transition"
                  title="Logout"
                >
                  <FiLogOut size={28} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="login"
                className="hover:text-pink-200 transition"
                title="Login"
              >
                <FiUser size={28} />
              </Link>
            )}

            <Link
              to="/my-orders"
              aria-label="My Orders"
              className="block text-white px-2 py-2 hover:text-pink-300"
            >
              <CgShoppingBag
                data-testid="bagIcon"
                size={30}
                className="inline mr-1"
              />
            </Link>

            <Link
              to="/cart"
              aria-label="cart-icon"
              className="block text-white px-1 py-1 hover:text-pink-300"
            >
              <GrCart
                data-testid="cartIcon"
                size={29}
                className="inline mr-1"
              />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              aria-label="hamburgerbtn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <div className="md:hidden space-y-4 pb-4">
            {currentUser && (
              <div className="flex items-center gap-2 text-lg px-2">
                👗 {currentUser.name}
                <button
                  onClick={handleLogout}
                  className="hover:text-red-300 transition ml-auto"
                >
                  <FiLogOut size={24} />
                </button>
              </div>
            )}

            {!currentUser && (
              <Link
                to="/login"
                aria-label="login"
                onClick={closeMenu}
                className="block text-white px-2 hover:text-pink-300"
              >
                <FiUser className="inline mr-1" />
                Login
              </Link>
            )}
            <Link
              to="/my-orders"
              aria-label="my orders"
              onClick={closeMenu}
              className="block text-white px-2 hover:text-pink-300"
            >
              <CgShoppingBag className="inline mr-1" />
              My Orders
            </Link>

            <Link
              to="/cart"
              aria-label="cart-icon"
              onClick={closeMenu}
              className="block text-white px-2 hover:text-pink-300"
            >
              <GrCart className="inline mr-1" />
              Cart
            </Link>
            {/* Collections Dropdown - Mobile Only */}
            <div className="px-2">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-white hover:text-pink-300 py-1 transition">
                  <span className="font-medium">Collections</span>
                  <svg
                    className="w-5 h-5 transition-transform duration-300 ease-in-out group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <ul className="pl-2 mt-2 space-y-1 text-pink-100 max-h-64 overflow-y-auto scrollbar-hide">
                  <li>
                    <Link
                      to="/kurti"
                      aria-label="kurti"
                      onClick={closeMenu}
                      className="block px-2 py-1 rounded hover:bg-pink-600 active:scale-95 transition duration-200"
                    >
                      Kurti
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/duppata"
                      aria-label="duppata"
                      onClick={closeMenu}
                      className="block px-2 py-1 rounded hover:bg-pink-600 active:scale-95 transition duration-200"
                    >
                      Duppata
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/two-piece-suits"
                      aria-label="two-piece suits"
                      onClick={closeMenu}
                      className="block px-2 py-1 rounded hover:bg-pink-600 active:scale-95 transition duration-200"
                    >
                      Two-piece Suits
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/three-piece-suits"
                      onClick={closeMenu}
                      className="block px-2 py-1 rounded hover:bg-pink-600 active:scale-95 transition duration-200"
                    >
                      Three-piece Suits
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/leggings"
                      onClick={closeMenu}
                      className="block px-2 py-1 rounded hover:bg-pink-600 active:scale-95 transition duration-200"
                    >
                      Leggings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/palazzo"
                      onClick={closeMenu}
                      className="block px-2 py-1 rounded hover:bg-pink-600 active:scale-95 transition duration-200"
                    >
                      Palazzo
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/pants"
                      onClick={closeMenu}
                      className="block px-2 py-1 rounded hover:bg-pink-600 active:scale-95 transition duration-200"
                    >
                      Pants
                    </Link>
                  </li>
                </ul>
              </details>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
