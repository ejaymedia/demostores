import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingScroll, setPendingScroll] = useState(null);

  useEffect(() => {
    if (pendingScroll && location.pathname === "/") {
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(pendingScroll);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setPendingScroll(null);
        } else if (attempts < 10) {
          setTimeout(() => tryScroll(attempts + 1), 100);
        }
      };
      tryScroll();
    }
  }, [location.pathname, pendingScroll]);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      setPendingScroll(sectionId);
      navigate("/");
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", type: "route", to: "/" },
    { label: "Shop", type: "route", to: "/shop" },
    { label: "About", type: "scroll", section: "about" },
    { label: "Contact", type: "scroll", section: "contact" },
  ];

  const categories = [
    { label: "Sneakers", to: "/shop" },
    { label: "Unisex Wears", to: "/shop" },
    { label: "Slides", to: "/shop" },
    { label: "Hand & Shoulder Bags", to: "/shop" },
    { label: "High Heels", to: "/shop" },
    { label: "Beddings", to: "/shop" },
  ];

  return (
    <footer className="bg-[#0A0A15] border-t border-purple-900/20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand Column */}
        <div className="lg:col-span-1">
          <button
            onClick={() => goTo("/")}
            className="flex items-center gap-3 mb-4"
          >
            <img
              src={`${import.meta.env.BASE_URL}logo/logo.png`}
              alt="Bovic Collections"
              className="h-10 w-auto object-contain"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <span className="font-bold text-lg bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Bovic Collections
            </span>
          </button>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Premium fashion for every lifestyle. Sneakers, bags, heels, wears,
            slides and beddings — delivered across Nigeria.
          </p>
          {/* Socials */}
          <div className="flex items-center gap-4">
            <a  
              href="https://instagram.com/boviccollection"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200"
              aria-label="Instagram"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="https://facebook.com/ajibadeboluwa"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200"
              aria-label="Facebook"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="https://wa.me/2347064191600"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 transition-all duration-200"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <li key={link.label}>
                {link.type === "route" ? (
                  <button
                    onClick={() => goTo(link.to)}
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                ) : (
                  <button
                    onClick={() => scrollToSection(link.section)}
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
            Categories
          </h4>
          <ul className="flex flex-col gap-3">
            {categories.map((cat) => (
              <li key={cat.label}>
                <button
                  onClick={() => goTo(cat.to)}
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-200 text-left"
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
            Contact Us
          </h4>
          <ul className="flex flex-col gap-4">
            <li>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                WhatsApp / Call
              </p>
              <a
                href="https://wa.me/2347064191600"
                target="_blank"
                rel="noreferrer"
                className="text-white text-sm font-medium hover:text-purple-400 transition-colors duration-200"
              >
                +234 706 419 1600
              </a>
            </li>
            <li>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                Alternative
              </p>
              <a
                href="tel:08068457238"
                className="text-white text-sm font-medium hover:text-purple-400 transition-colors duration-200"
              >
                080 6845 7238
              </a>
            </li>
            <li>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                Instagram
              </p>
              <a
                href="https://instagram.com/boviccollection"
                target="_blank"
                rel="noreferrer"
                className="text-white text-sm font-medium hover:text-purple-400 transition-colors duration-200"
              >
                @boviccollection
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Rainbow Divider */}
      <div className="h-px bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-gray-500 text-xs">
          © {currentYear} Bovic Collections. All rights reserved.
        </p>
        <p className="text-gray-600 text-xs">Fashion · Style · Nigeria</p>
        <p className="text-gray-600 text-xs">
          Built with ❤️ by{" "}
          <a
            href="https://elijah.is-a.dev"
            target="_blank"
            rel="noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            Ejay
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;