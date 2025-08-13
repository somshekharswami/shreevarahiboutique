import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ProductCardUI from "../Components/ProductCardUI";

const Threepiecesuits = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === "three-piece kurti"
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
          pageTitle="Three-Piece Kurti Collection"
          pageDesc="Explore the elegance of our handpicked Three-Piece Kurti"
          notFoundtitle="No Products Found"
          notFoundDesc="Looks like we are out of Three-Piece Kurti  at the moment!"
          products={filteredProducts}
        />
      </div>
    </>
  );
};

export default Threepiecesuits;
