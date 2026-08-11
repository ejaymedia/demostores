import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useSite } from "../context/SiteContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(null);
  const { siteSettings } = useSite();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setShopDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
    setShopDropdownOpen(false);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      setPendingScroll(sectionId);
      navigate("/");
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
    setShopDropdownOpen(false);
  };

  const genderLinks = [
    { label: "Men", path: "/shop/men" },
    { label: "Women", path: "/shop/women" },
    { label: "Kids", path: "/shop/kids" },
  ];

  const isActiveShop = location.pathname.startsWith("/shop");
  const isActivePath = (path) => location.pathname === path;

  const navLinkClass = (active) =>
    `text-sm font-semibold transition-colors duration-200 ${
      active ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
    }`;

  // Logo component — responsive to any logo shape
  const Logo = ({ className = "h-10" }) => {
    if (!siteSettings.logo_url) {
      return (
        <span
          className="font-black text-lg tracking-tight"
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
        className={`${className} w-auto object-contain`}
        style={{ maxWidth: "160px" }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling && (e.target.nextSibling.style.display = "block");
        }}
      />
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button
            onClick={goHome}
            className="flex items-center shrink-0 max-w-[160px] sm:max-w-[200px]"
            aria-label={`${siteSettings.business_name} — Home`}
          >
            <Logo className="h-9 sm:h-10" />
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">

            {/* Shop dropdown */}
            <li ref={dropdownRef} className="relative">
              <button
                onClick={() => setShopDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${navLinkClass(
                  isActiveShop
                )}`}
              >
                Shop
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    shopDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 overflow-hidden z-50">
                  {genderLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => goTo(link.path)}
                      className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all duration-150 flex items-center justify-between ${
                        isActivePath(link.path)
                          ? "text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      style={
                        isActivePath(link.path)
                          ? { background: "var(--brand-1)" }
                          : {}
                      }
                    >
                      {link.label}
                      {isActivePath(link.path) && (
                        <span className="text-white/70 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </li>

            <li>
              <button
                onClick={() => scrollToSection("services")}
                className={`px-3 py-2 rounded-lg ${navLinkClass(false)}`}
              >
                Services
              </button>
            </li>
            <li>
              <button
                onClick={() => goTo("/faq")}
                className={`px-3 py-2 rounded-lg ${navLinkClass(
                  isActivePath("/faq")
                )}`}
              >
                FAQ
              </button>
            </li>
            <li>
              <button
                onClick={() => goTo("/about")}
                className={`px-3 py-2 rounded-lg ${navLinkClass(
                  isActivePath("/about")
                )}`}
              >
                About
              </button>
            </li>
          </ul>

          {/* Desktop WhatsApp CTA */}
          <a
            href={`https://wa.me/${siteSettings.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shrink-0"
            style={{ background: "var(--brand-1)" }}
          >
            <FaWhatsapp size={16} />
            WhatsApp
          </a>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`https://wa.me/${siteSettings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white transition-all duration-200 shrink-0"
              style={{ background: "var(--brand-1)" }}
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={16} />
            </a>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-600 hover:text-gray-900 transition-colors p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 shadow-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 mb-1">
            Shop
          </p>
          {genderLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => goTo(link.path)}
              className={`text-left text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 ${
                isActivePath(link.path)
                  ? "text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              style={
                isActivePath(link.path)
                  ? { background: "var(--brand-1)" }
                  : {}
              }
            >
              {link.label}
            </button>
          ))}

          <div className="border-t border-gray-100 my-2" />

          <button
            onClick={() => scrollToSection("services")}
            className="text-left text-sm font-semibold px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            Services
          </button>
          <button
            onClick={() => goTo("/faq")}
            className={`text-left text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 ${
              isActivePath("/faq")
                ? "text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            style={
              isActivePath("/faq") ? { background: "var(--brand-1)" } : {}
            }
          >
            FAQ
          </button>
          <button
            onClick={() => goTo("/about")}
            className={`text-left text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 ${
              isActivePath("/about")
                ? "text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            style={
              isActivePath("/about") ? { background: "var(--brand-1)" } : {}
            }
          >
            About
          </button>

          <div className="border-t border-gray-100 my-2" />

          <a
            href={`https://wa.me/${siteSettings.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-5 py-3.5 rounded-full transition-all duration-200 mt-1"
            style={{ background: "var(--brand-1)" }}
          >
            <FaWhatsapp size={16} />
            Order on WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;