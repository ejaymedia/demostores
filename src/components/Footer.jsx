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

  // Logo — no text beside it
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
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  };

  return (
    <footer style={{ background: "var(--brand-footer)" }} className="text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-1">
            <button
              onClick={() => goTo("/")}
              className="flex items-start mb-4"
              aria-label={`${siteSettings.business_name} — Home`}
            >
              <FooterLogo />
            </button>
            <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-xs">
              {siteSettings.tagline}. Delivered across Nigeria.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <FaInstagram size={15} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <FaFacebookF size={15} />
              </a>
              <a
                href={`https://wa.me/${siteSettings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <FaWhatsapp size={15} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Shop
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Men", action: () => goTo("/shop/men") },
                { label: "Women", action: () => goTo("/shop/women") },
                { label: "Kids", action: () => goTo("/shop/kids") },
                { label: "New Arrivals", action: () => goTo("/shop/men") },
                { label: "Sale", action: () => goTo("/shop/men") },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-white/50 text-sm hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Help
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "About Us", action: () => goTo("/about") },
                { label: "FAQ", action: () => goTo("/faq") },
                { label: "Services", action: () => scrollToSection("services") },
                {
                  label: "WhatsApp Order",
                  action: () =>
                    window.open(
                      `https://wa.me/${siteSettings.whatsapp}`,
                      "_blank"
                    ),
                },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-white/50 text-sm hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Contact
            </h4>
            <ul className="flex flex-col gap-3.5">
              {siteSettings.phone && (
                <li>
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </p>
                  <a
                    href={`https://wa.me/${siteSettings.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/70 text-sm hover:text-white transition-colors duration-200"
                  >
                    {siteSettings.phone}
                  </a>
                </li>
              )}
              {siteSettings.email && (
                <li>
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="text-white/70 text-sm hover:text-white transition-colors duration-200"
                  >
                    {siteSettings.email}
                  </a>
                </li>
              )}
              {siteSettings.address && (
                <li>
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="text-white/70 text-sm">
                    {siteSettings.address}
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider — uses brand primary colour */}
      <div
        className="h-px w-full opacity-20"
        style={{ background: "var(--brand-1)" }}
      />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">
            © {currentYear} {siteSettings.business_name}. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">Fashion · Style · Nigeria</p>
          <p className="text-white/30 text-xs">
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
      </div>
    </footer>
  );
};

export default Footer;