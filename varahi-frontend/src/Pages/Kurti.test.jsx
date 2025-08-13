import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Kurti from "./Kurti";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/store";
import axios from "axios";

jest.mock("axios");

describe("Testing Kurti Page", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          title: "Kurti A",
          category: "Kurti",
          singlePrice: { discountedPrice: 400 },
        },
        {
          _id: "2",
          title: "Lehenga B",
          category: "Lehenga",
          singlePrice: { discountedPrice: 800 },
        },
      ],
    });
  });

  test("renders only Kurti products", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Kurti />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Kurti A")).toBeInTheDocument();
      expect(screen.queryByText("Lehenga B")).not.toBeInTheDocument();
    });
  });

  test("matches snapshot", async () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BrowserRouter>
          <Kurti />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Kurti A")).toBeInTheDocument(); // ensures Axios finished
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
