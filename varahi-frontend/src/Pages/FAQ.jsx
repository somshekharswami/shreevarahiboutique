import React from "react";

const FAQ = () => {
  const faqs = [
    {
      q: "How long will my order take to arrive?",
      a: "Typically, 5–8 working days for metro cities and 7–12 days for other regions.",
    },
    {
      q: "Can I return an outfit if it doesn't fit?",
      a: "Yes, you can request an exchange for size issues within 7 days of delivery.",
    },
    {
      q: "Do you offer COD (Cash on Delivery)?",
      a: "Yes! COD is available for select pin codes at a small additional charge.",
    },
    {
      q: "Are your products ready-to-ship?",
      a: "Most products are ready-to-ship. If made-to-order, it will be mentioned on the product page.",
    },
    {
      q: "How do I contact customer support?",
      a: "contact", // flag to handle differently
    },
  ];

  return (
    <section className="min-h-screen bg-[#fff9f8] px-6 py-12 md:px-20">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-[#f5dad4]">
        <h1 className="text-3xl font-serif text-[#B19A99] mb-6 border-b pb-2">
          Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-pink-50 p-4 rounded-md shadow-sm">
              <h3 className="text-md font-semibold text-[#8f5a56] mb-1">
                ❓ {faq.q}
              </h3>
              {faq.a === "contact" ? (
                <p className="text-sm font-bold font-mono text-gray-700">
                  Email us at{" "}
                  <a
                    href="mailto:shreevarahiboutique@gmail.com"
                    className="text-[#B19A99] underline"
                  >
                    shreevarahiboutique@gmail.com
                  </a>{" "}
                  or DM us on{" "}
                  <a
                    href="https://www.instagram.com/shree.varahi.boutique11?igsh=MWM5MGdndTlxMW9vaA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B19A99] underline"
                  >
                    Instagram @shree.varahi.boutique11
                  </a>
                  .
                </p>
              ) : (
                <p className="text-sm font-mono font-bold text-gray-700">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
