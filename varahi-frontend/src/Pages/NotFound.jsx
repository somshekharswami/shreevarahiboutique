import React from "react";
import { Link } from "react-router-dom";
import { GiDress } from "react-icons/gi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex flex-col items-center justify-center px-4 text-center">
      <img
        src="/shopping-image.svg" // Keep this same or replace with a kurti image later
        alt="Page Not Found"
        className="w-56 h-56 mb-6 opacity-90 drop-shadow-xl"
      />

      <div className="flex items-center gap-2 text-pink-600 mb-3">
        <GiDress className="text-3xl" />
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide">
          Lost in Elegance?
        </h1>
      </div>

      <p className="text-gray-700 font-light font-serif text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
        The page you're looking for has stitched itself out of reach. But worry
        not — our finest pieces await your return.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-gradient-to-br from-pink-100 to-purple-100 font-medium rounded-full shadow-md transition duration-300 tracking-wider"
      >
        Browse Collections
      </Link>
    </div>
  );
};

export default NotFound;
