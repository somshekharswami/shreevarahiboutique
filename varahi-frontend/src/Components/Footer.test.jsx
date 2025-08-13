import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  });

  test("renders location info", () => {
    expect(
      screen.getByText(/Shop No. 6, Navratna Society/i)
    ).toBeInTheDocument();
  });

  test("renders all shop links", () => {
    [
      "Kurtis",
      "Dupattas",
      "Palazzo Pants",
      "3-Piece Suits",
      "2-Piece Suits",
    ].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  test("renders all customer service links", () => {
    ["Contact Us", "Shipping Policy", "Returns & Exchanges", "FAQ"].forEach(
      (label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      }
    );
  });

  test("prevents default on form submit", async () => {
    const button = screen.getByRole("button", { name: /subscribe/i });
    await userEvent.click(button);
  });

  test("renders social media links", () => {
    expect(screen.getByLabelText(/instagram/i)).toHaveAttribute(
      "href",
      expect.stringContaining("instagram.com")
    );
    expect(screen.getByLabelText(/whatsapp/i)).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me")
    );
    expect(screen.getByLabelText(/facebook/i)).toHaveAttribute(
      "href",
      expect.stringContaining("facebook.com")
    );
  });

  test("renders copyright", () => {
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${year}`, "i"))).toBeInTheDocument();
  });
  test("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
