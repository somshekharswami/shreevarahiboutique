import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCardUI from "./ProductCardUI";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../redux/store";

describe("Testing the ProductCard Component", () => {
  test("Test Case 1: Renders fallback UI when no products", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCardUI
            products={[]}
            notFoundtitle="No Products Found"
            notFoundDesc="Try searching again"
            pageTitle="Test Title"
            pageDesc="Test Desc"
          />
        </BrowserRouter>
      </Provider>
    );

    const notFoundtitle = screen.getByLabelText(/notfoundtitle/i);
    const notFounddesc = screen.getByLabelText(/notfounddesc/i);

    expect(notFoundtitle).toBeInTheDocument();
    expect(notFounddesc).toBeInTheDocument();
    expect(notFoundtitle).toHaveTextContent("No Products Found");
    expect(notFounddesc).toHaveTextContent("Try searching again");
  });

  test(" Test Case 2: Renders correct number of products.", () => {
    const mockProducts = [
      {
        _id: "1",
        title: "Product 1",
        description: "Description 1",
        imageUrl: "/image1.jpg",
        category: "Dupatta",
        singlePrice: { discountedPrice: 500 },
      },
      {
        _id: "2",
        title: "Product 2",
        description: "Description 2",
        imageUrl: "/image2.jpg",
        category: "Dress",
        singlePrice: { discountedPrice: 800 },
      },
    ];
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCardUI
            products={mockProducts}
            pageTitle="Our Products"
            pageDesc="Best styles available"
            notFoundtitle="No Products"
            notFoundDesc="Try again"
          />
        </BrowserRouter>
      </Provider>
    );
    const productTitles = screen.getAllByRole("heading", { level: 2 }); // to find all product <h2> tags.
    expect(productTitles.length).toBe(mockProducts.length);
    // displays correct product title
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  test("Displays the correct price", () => {
    const mockProducts = [
      {
        _id: "1",
        title: "Product With Single Price",
        description: "heyy",
        imageUrl: "https://via.placeholder.com/150",
        category: "Dress",
        singlePrice: { discountedPrice: 999 },
      },
      {
        _id: "2",
        title: "Product With Sizes",
        description: "descc",
        imageUrl: "https://via.placeholder.com/150",
        category: "Kurti",
        sizes: [
          { label: "S", discountedPrice: 500 },
          { label: "M", discountedPrice: 450 },
        ],
      },
    ];
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCardUI
            products={mockProducts}
            pageTitle="Price Check"
            pageDesc="Testing price logic"
            notFoundtitle="No Products"
            notFoundDesc="Try again"
          />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText("₹999")).toBeInTheDocument(); // from singlePrice
    expect(screen.getByText("₹450")).toBeInTheDocument(); // min from sizes
  });
  test("Match Snapshots", () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCardUI
            pageTitle="Snapshot Title"
            pageDesc="This is a snapshot test"
            notFoundtitle="No Products Found"
            notFoundDesc="Try again later"
            products={[]}
          />
        </BrowserRouter>
      </Provider>
    );
    expect(asFragment).toMatchSnapshot();
  });
});
