import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Contact from "./Contact";
import userEvent from "@testing-library/user-event";
import axios from "axios";

// mock axios
jest.mock("axios");

describe("Contact Page Form", () => {
  test("renders all fields and submits successfully", async () => {
    render(<Contact />);

    // Use placeholder text to get form fields
    const nameInput = screen.getByPlaceholderText(/enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/abc@gmail.com/i);
    const subjectInput = screen.getByPlaceholderText(
      /let us know why you're reaching out/i
    );
    const messageInput = screen.getByPlaceholderText(/briefly describe../i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Simulate user typing
    await userEvent.type(nameInput, "Soham");
    await userEvent.type(emailInput, "test@abcgmail.com");
    await userEvent.type(subjectInput, "Subject of the Problem");
    await userEvent.type(messageInput, "this is the description of problem");

    //  Assert inputs received values before submission
    expect(nameInput).toHaveValue("Soham");
    expect(emailInput).toHaveValue("test@abcgmail.com");
    expect(subjectInput).toHaveValue("Subject of the Problem");
    expect(messageInput).toHaveValue("this is the description of problem");

    // Mock successful axios response
    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: "thankyou for reaching out",
      },
    });

    // Submit form
    await userEvent.click(submitButton);

    // Expect success message to appear-//WaitFor :Waits for an async update (like after an API call)
    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.includes("Thank you for reaching out")
        )
      ).toBeInTheDocument();
    });
    // ✅ Optional: Assert correct axios call
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/contact",
      {
        name: "Soham",
        email: "test@abcgmail.com",
        subject: "Subject of the Problem",
        message: "this is the description of problem",
      }
    );
  });
  test("matches snapshot", () => {
    const { asFragment } = render(<Contact />);
    expect(asFragment()).toMatchSnapshot();
  });
});
