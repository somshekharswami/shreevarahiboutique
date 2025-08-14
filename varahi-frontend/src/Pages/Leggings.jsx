import React, { useEffect, useState } from "react";
import api from "api";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ProductCardUI from "../Components/ProductCardUI";

const Leggings = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === "leggings"
  );
  return (
    <>
      <div className=" bg-gradient-to-br from-pink-100 to-purple-100">
        <div
          onClick={() => navigate("/")}
          className="md:hidden flex items-center gap-2 px-4 py-3 cursor-pointer hover:text-pink-600 transition-colors duration-200"
        >
          <FaArrowLeft className="text-lg text-pink-700" />
        </div>
        <ProductCardUI
          pageTitle="Leggings Collection"
          pageDesc="Explore the elegance of our handpicked Leggings"
          notFoundtitle="No Products Found"
          notFoundDesc="Looks like we are out of Leggings at the moment!"
          products={filteredProducts}
        />
      </div>
    </>
  );
};

export default Leggings;
