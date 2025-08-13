import React from "react";

const ReturnsExchanges = () => {
  return (
    <section className="min-h-screen bg-purple-50 px-6 py-12 md:px-20">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-[#e8d6f0]">
        <h1 className="text-3xl font-serif text-[#B19A99] mb-6 border-b pb-2">
          Returns & Exchanges
        </h1>

        <p className="mb-4">
          We want you to love your purchase. Here's how returns & exchanges work
          at <strong>Varahi Boutique</strong>:
        </p>

        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            🔄 Returns accepted within <strong>7 days</strong> of delivery.
          </li>
          <li>👗 Items must be unused, unwashed, and with original tags.</li>
          <li>
            ✨ Exchanges allowed for sizing issues or damaged pieces only.
          </li>
          <li>🚫 No returns on sale or custom-stitched items.</li>
          <li>
            💰 Refunds processed to original payment method within 5–7 days.
          </li>
        </ul>

        <p className="mt-6 text-sm italic text-gray-500">
          Need help? Email us at{" "}
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

export default ReturnsExchanges;
