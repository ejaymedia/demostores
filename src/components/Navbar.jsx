import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { useSite } from "../context/SiteContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(null);
  const { siteSettings } = useSite();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Fire pending scroll after navigating home
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
  };

  const genderLinks = [
    { label: "Men", path: "/shop/men" },
    { label: "Women", path: "/shop/women" },
    { label: "Kids", path: "/shop/kids" },
  ];

  const isActiveGender = (path) => location.pathname === path;

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
            className="flex items-center gap-2.5 shrink-0"
          >
            <img
              src={siteSettings.logo_url}
              alt={siteSettings.business_name}
              className="h-9 w-auto object-contain"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <span
              className="font-black text-lg tracking-tight hidden sm:block"
              style={{ color: "var(--brand-1)" }}
            >
              {siteSettings.business_name}
            </span>
          </button>

          {/* Desktop — Gender Tabs */}
          <div className="hidden md:flex items-center gap-1">
            {genderLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => goTo(link.path)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActiveGender(link.path)
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
                style={
                  isActiveGender(link.path)
                    ? { background: "var(--brand-1)" }
                    : {}
                }
              >
                {link.label}
              </button>
            ))}
            <div className="w-px h-5 bg-gray-200 mx-2" />
            <button
              onClick={() => goTo("/shop/men")}
              className="px-4 py-2 rounded-full text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              New Arrivals
            </button>
            <button
              onClick={() => goTo("/shop/men")}
              className="px-4 py-2 rounded-full text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              Sale
            </button>
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${siteSettings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "var(--brand-1)" }}
            >
              💬 WhatsApp
            </a>
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`https://wa.me/${siteSettings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="text-white text-xs font-semibold px-3 py-2 rounded-full transition-all duration-200"
              style={{ background: "var(--brand-1)" }}
            >
              💬
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
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-5 flex flex-col gap-1 shadow-lg">

          {/* Gender Links */}
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">
            Shop
          </p>
          {genderLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => goTo(link.path)}
              className={`text-left text-sm font-semibold px-4 py-3 rounded-xl transition-all duration-200 ${
                isActiveGender(link.path)
                  ? "text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              style={
                isActiveGender(link.path)
                  ? { background: "var(--brand-1)" }
                  : {}
              }
            >
              {link.label}
            </button>
          ))}

          <div className="border-t border-gray-100 my-2" />

          <button
            onClick={() => goTo("/shop/men")}
            className="text-left text-sm font-semibold px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            🆕 New Arrivals
          </button>
          <button
            onClick={() => goTo("/shop/men")}
            className="text-left text-sm font-semibold px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            🏷️ Sale
          </button>

          <div className="border-t border-gray-100 my-2" />

          <button
            onClick={() => scrollToSection("contact")}
            className="text-left text-sm font-semibold px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            Contact Us
          </button>

          <a
            href={`https://wa.me/${siteSettings.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-center text-white text-sm font-semibold px-5 py-3.5 rounded-full transition-all duration-200"
            style={{ background: "var(--brand-1)" }}
          >
            💬 Order on WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;