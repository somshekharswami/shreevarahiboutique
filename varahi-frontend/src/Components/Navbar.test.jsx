import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";

// ✅ Mock AuthContext — use dynamic value for currentUser
const mockSetCurrentUser = jest.fn();

let mockAuthValue = {
  currentUser: null,
  setCurrentUser: mockSetCurrentUser,
  logout: jest.fn(),
};

jest.mock("../../src/context/AuthContext", () => ({
  useAuth: () => mockAuthValue,
}));

// ✅ Helper: Renders Navbar with React Router
const renderWithRouter = (initialRoute = "/") => {
  const mockOnSearchChange = jest.fn();
 return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="/"
          element={<Navbar onSearchChange={mockOnSearchChange} />}
        />
        <Route path="/my-orders" element={<div>My Orders Page</div>} />
        <Route path="/cart" element={<div>Contact Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/kurti" element={<div>kurti page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Navbar Component", () => {
  test("renders logo and is visible", () => {
    renderWithRouter();
    const logo = screen.getByRole("link", { name: /vb/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toBeVisible();
  });

  test("renders searchBar, visibility, allows typing input", async () => {
    renderWithRouter();
    const searchBar = screen.getByLabelText(/searchBar/i);
    expect(searchBar).toBeInTheDocument();
    expect(searchBar).toBeVisible();
    await userEvent.type(searchBar, "kurti");
    expect(searchBar).toHaveValue("kurti");
  });

  test("shows login icon when user is logged out", () => {
    mockAuthValue.currentUser = null;
    renderWithRouter();
    const login = screen.getByLabelText(/login/i);
    expect(login).toBeInTheDocument();
    expect(login).toBeVisible();
  });

  test("renders shopping bag icon and navigates correctly", async () => {
    renderWithRouter();
    const shoppingBag = screen.getByLabelText(/my orders/i);
    const bagIcon = screen.getByTestId(/bagicon/i);

    expect(shoppingBag).toBeInTheDocument();
    expect(bagIcon).toBeVisible();

    await userEvent.click(shoppingBag);
    expect(screen.getByText(/my orders page/i)).toBeInTheDocument();
  });

  test("renders cart icon and is visible", async () => {
    renderWithRouter();
    const cartLink = screen.getByLabelText(/cart-icon/i);
    const cartIcon = screen.getByTestId(/carticon/i);

    expect(cartLink).toBeInTheDocument();
    expect(cartIcon).toBeVisible();

    await userEvent.click(cartLink);
    expect(screen.getByText(/contact page/i)).toBeInTheDocument();
  });

  test("shows user name and logout icon when user is logged in", () => {
    // ✅ Set up mock user BEFORE rendering
    mockAuthValue.currentUser = {
      name: "Somshekhar",
      uid: "123",
      email: "somshekhar@example.com",
    };

    renderWithRouter();
    //47 31 33
    expect(screen.getByText(/👗 Somshekhar/i)).toBeInTheDocument();
    expect(screen.getByLabelText("logout")).toBeVisible();
    expect(screen.queryByLabelText("login")).not.toBeInTheDocument(); // ✅ This will now pass
  });

  // for Mobile menu Collection DropDown Tests
  test("Mobile menu 'Collections' All prodcuts link renders and navigates", async () => {
    renderWithRouter();

    // Opens the hamburger menu
    const hamburgerBtn = screen.getByLabelText(/hamburgerbtn/i);
    await userEvent.click(hamburgerBtn);

    const collectionsSummary = screen.getByText(/collections/i);
    await userEvent.click(collectionsSummary);

    //1. check for kurti
    const kurtiLink = screen.getByRole("link", { name: /kurti/i });
    expect(kurtiLink).toBeInTheDocument();
    expect(kurtiLink).toBeVisible();

    await userEvent.click(kurtiLink);
    expect(screen.getByText(/kurti page/i)).toBeInTheDocument();
  });
  test("matches snapshot", () => {
    const { asFragment } = renderWithRouter();
    expect(asFragment()).toMatchSnapshot();
  });
});
