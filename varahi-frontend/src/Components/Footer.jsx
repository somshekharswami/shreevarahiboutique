import React from "react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate(); // for navigating the subscribe to contact us
  return (
    <footer className="bg-pink-500 text-white py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-serif font-bold mb-3">
            Varahi Boutique
          </h2>
          <p className="text-sm text-white/90 leading-relaxed">
            Explore our elegant handcrafted collection of Kurtis, Dupattas, and
            Suits — designed for women who celebrate grace.
          </p>
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-1">Location</h3>
            <p className="text-sm text-white/80">
              <a
                href="https://www.google.com/maps/place/Shop+No.6,+Shree+varahi+boutique,+Navratna+society,+RRT+Rd,+opposite+Om+jwellers,+Mulund+West,+Mumbai,+Maharashtra+400080/data=!4m2!3m1!1s0x3be7b9970670ad87:0xacc0aadff9273ec6?entry=gps&coh=192189&g_ep=CAESBzI1LjMwLjMYACDXggMqkAEsOTQyNzgzMDcsOTQyNjc3MjcsOTQyMjMyOTksOTQyMTY0MTMsOTQyODA1NzYsOTQyMTI0OTYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTc1MjMsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsNDcwODQzOTMsOTQyMTMyMDAsOTQyNTgzMjVCAklO&skid=0c39443b-b5a7-4a52-908a-00b7efa47c11&g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
              >
                Shop No. 6, Navratna Society, Opp. OM Jewellers, R.R. T. Road,
                Mulund (W), Mumbai
              </a>
            </p>
          </div>
        </div>

        {/* Shop Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Shop</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["Kurtis", "/kurti"],
              ["Dupattas", "/duppata"],
              ["Palazzo Pants", "/palazzo"],
              ["3-Piece Suits", "/three-piece-suits"],
              ["2-Piece Suits", "/two-piece-suits"],
            ].map(([label, path]) => (
              <li key={label}>
                <Link
                  to={path}
                  className="hover:underline hover:text-pink-100 transition"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["Contact Us", "/contact"],
              ["Shipping Policy", "/shipping-policy"],
              ["Returns & Exchanges", "/returns"],
              ["FAQ", "/faq"],
            ].map(([label, path]) => (
              <li key={label}>
                <Link
                  to={path}
                  className="hover:underline hover:text-pink-100 transition"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter & Socials */}
        <div>
          <p>
            For special offers, free giveaways, and once-in-a-lifetime deals !
          </p>
          <br />
          <button
            type="submit"
            onClick={() => navigate("/contact")}
            className="bg-white text-[#B19A99] px-4 py-2 rounded-md font-semibold hover:bg-pink-100 transition"
          >
            Subscribe
          </button>

          <div className="flex gap-4 mt-5 text-white text-xl">
            <a
              href="https://www.instagram.com/shree.varahi.boutique11?igsh=MWM5MGdndTlxMW9vaA=="
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-200 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wa.me/918355907193"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="hover:text-pink-200 transition"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-pink-200 transition"
            >
              <FaFacebookF />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-white/70 mt-12">
        © {new Date().getFullYear()} Varahi Boutique · All rights reserved ·
        Designed with love
      </div>
    </footer>
  );
};

export default Footer;
