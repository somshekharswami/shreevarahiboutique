import React from "react";

const ShippingPolicy = () => {
  return (
    <section className="min-h-screen bg-pink-50 px-6 py-12 md:px-20">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-[#f3d4d0]">
        <h1 className="text-3xl font-serif text-[#B19A99] mb-6 border-b pb-2">
          Shipping Policy
        </h1>
        <p className="mb-4">
          At <strong>Varahi Boutique</strong>, we take pride in carefully
          packaging and shipping your handcrafted pieces.
        </p>

        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            📦 Orders are processed within <strong>2–4 business days</strong>.
          </li>
          <li>
            🚚 Shipping across India is{" "}
            <strong>free on orders above ₹999</strong>.
          </li>
          <li>
            🛫 We ship via trusted logistics partners: Bluedart, Delhivery, and
            Shiprocket.
          </li>
          <li>
            ⏰ Delivery timelines: <strong>5–8 days for metros</strong>,{" "}
            <strong>7–12 days for others</strong>.
          </li>
        </ul>

        <p className="mt-6 text-sm italic text-gray-500">
          Questions? Reach out at{" "}
          <a
            href="mailto:shreevarahiboutique@gmail.com"
            className="text-[#B19A99] underline"
          >
            shreevarahiboutique@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
};

export default ShippingPolicy;
