import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/api";

const ContactPage = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const onSubmit = async (data) => {
    setButtonDisabled(true);

    try {
      const response = await api.post("/api/contact", data);
      if (response.data.success) {
        reset();
      } else {
        console.error("Email failed to send:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error sending email:",
        error.response?.data || error.message
      );
    } finally {
      setTimeout(() => setButtonDisabled(false), 3000);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 py-12 px-6 md:px-20">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        {isSubmitSuccessful && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-md text-center mb-6 shadow-sm animate-fade-in">
            <p className="font-semibold text-lg mb-1">
              Thank you for reaching out 💌
            </p>
            <p className="text-sm">
              Your message has been wrapped in silk and sent to our team. We'll
              get back to you within 2–3 business days.
            </p>
            <p className="text-xs mt-2 italic text-gray-500">
              – With love, Varahi Boutique
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter your full name"
            aria-label="name"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-[#B19A99] outline-none font-mono"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}

          {/* Email */}
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
            placeholder="abc@gmail.com"
            aria-label="email"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-[#B19A99] outline-none font-mono"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          {/* Subject */}
          <input
            type="text"
            {...register("subject")}
            aria-label="subject"
            placeholder="Let us know why you're reaching out"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-[#B19A99] outline-none font-mono"
          />

          {/* Message */}
          <textarea
            rows="5"
            {...register("message", { required: "Message is required" })}
            placeholder="Briefly describe.."
            aria-label="message"
            className="w-full border border-gray-300 px-4 py-2 rounded-md resize-none focus:ring-2 focus:ring-[#B19A99] outline-none font-mono"
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              aria-label="submit"
              disabled={buttonDisabled}
              className="bg-[#B19A99] text-white px-6 py-2 rounded-md hover:bg-[#a88a89] transition duration-300"
            >
              {buttonDisabled ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
