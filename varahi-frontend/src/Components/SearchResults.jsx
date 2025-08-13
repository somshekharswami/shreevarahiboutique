import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios"; 
import ProductCardUI from "../Components/ProductCardUI";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`/api/products/search?q=${query}`);
        setResults(res.data);
      } catch (error) {
        console.error("Search failed", error);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <ProductCardUI
      pageTitle="Search Results"
      pageDesc={`Showing results for: ${query}`}
      notFoundtitle="No Matches Found"
      notFoundDesc="Try different keywords like 'kurti', 'pants', 'dupatta' etc."
      products={results}
    />
  );
};

export default SearchResults;
