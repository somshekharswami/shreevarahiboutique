import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import api from "../api/api";
import debounce from "lodash/debounce";
import ProductCardUI from "../Components/ProductCardUI";
import Home from "../Pages/Home";
import { useAuth } from "../context/AuthContext"; // added for future usage

const Layout = () => {
  const location = useLocation();
  const { currentUser } = useAuth(); //  optional, useful if cart/wishlist/user-based features needed
  const [products, setProducts] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch all products once
  useEffect(() => {
    api
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Debounced search logic
  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value.trim() === "") {
        setFilteredProducts([]);
        return;
      }

      const filtered = products.filter((product) =>
        product.category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 400),
    [products]
  );

  const handleSearchChange = (value) => {
    setSearchItem(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchItem("");
    setFilteredProducts([]);
  };

  return (
    <>
      <Navbar
        searchItem={searchItem}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
      />

      {searchItem.trim() !== "" ? (
        <ProductCardUI
          pageTitle="Search Results"
          pageDesc={`Showing results for: ${searchItem}`}
          notFoundtitle="No Products Found"
          notFoundDesc="Try 'Kurti', 'Palazzo', 'Dupatta' or similar keywords"
          products={filteredProducts}
        />
      ) : location.pathname === "/" ? (
        <Home products={products} />
      ) : (
        <Outlet />
      )}

      <Footer />
    </>
  );
};

export default Layout;
