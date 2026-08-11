import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { useSite } from "../context/SiteContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();
  const { siteSettings } = useSite();
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

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      setPendingScroll(sectionId);
      navigate("/");
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const shopLinks = [
    { label: "Men", path: "/shop/men", type: "route" },
    { label: "Women", path: "/shop/women", type: "route" },
    { label: "Kids", path: "/shop/kids", type: "route" },
    { label: "New Arrivals", path: "/shop/men", type: "route" },
    { label: "Sale", path: "/shop/men", type: "route" },
  ];

  const helpLinks = [
    { label: "About Us", path: "/about", type: "route" },
    { label: "FAQ", path: "/faq", type: "route" },
    { label: "Services", section: "services", type: "scroll" },
    {
      label: "WhatsApp Order",
      path: `https://wa.me/${siteSettings.whatsapp}`,
      type: "external",
    },
  ];

  // Logo — responsive to any shape, no text beside it
  const FooterLogo = () => {
    if (!siteSettings.logo_url) {
      return (
        <span
          className="font-black text-lg"
          style={{ color: "var(--brand-1)" }}
        >
          {siteSettings.business_name}
        </span>
      );
    }
    return (
      <img
        src={siteSettings.logo_url}
        alt={siteSettings.business_name}
        className="h-10 w-auto object-contain"
        style={{ maxWidth: "160px", maxHeight: "48px" }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  };

  return (
    <footer className="bg-gray-950 text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <button
            onClick={() => goTo("/")}
            className="flex items-start mb-4"
            aria-label={`${siteSettings.business_name} — Home`}
          >
            <FooterLogo />
          </button>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {siteSettings.tagline}. Delivered across Nigeria.
          </p>
          {/* Socials */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
            >
              <FaInstagram size={15} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
            >
              <FaFacebookF size={15} />
            </a>
            <a
              href={`https://wa.me/${siteSettings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
            >
              <FaWhatsapp size={15} />
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
            Shop
          </h4>
          <ul className="flex flex-col gap-3">
            {shopLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => goTo(link.path)}
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-200 text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Help Links */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
            Help
          </h4>
          <ul className="flex flex-col gap-3">
            {helpLinks.map((link) => (
              <li key={link.label}>
                {link.type === "scroll" ? (
                  <button
                    onClick={() => scrollToSection(link.section)}
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                ) : link.type === "external" ? (
                  <a
                    href={link.path}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ) : (
                  <button
                    onClick={() => goTo(link.path)}
                    className="text-gray-400 text-sm hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">
            Contact
          </h4>
          <ul className="flex flex-col gap-4">
            {siteSettings.phone && (
              <li>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                  WhatsApp / Call
                </p>
                <a
                  href={`https://wa.me/${siteSettings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white text-sm font-medium hover:text-gray-300 transition-colors duration-200"
                >
                  {siteSettings.phone}
                </a>
              </li>
            )}
            {siteSettings.email && (
              <li>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="text-white text-sm font-medium hover:text-gray-300 transition-colors duration-200"
                >
                  {siteSettings.email}
                </a>
              </li>
            )}
            {siteSettings.address && (
              <li>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                  Address
                </p>
                <p className="text-white text-sm font-medium">
                  {siteSettings.address}
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Brand colour divider */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--brand-1), var(--brand-2))",
        }}
      />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-500 text-xs">
          © {currentYear} {siteSettings.business_name}. All rights reserved.
        </p>
        <p className="text-gray-600 text-xs">Fashion · Style · Nigeria</p>
        <p className="text-gray-600 text-xs">
          Built with ❤️ by{" "}
          <a
            href="https://elijah.is-a.dev"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors duration-200"
            style={{ color: "var(--brand-1)" }}
          >
            Ejay
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;