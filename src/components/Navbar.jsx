import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pendingScroll, setPendingScroll] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Fire pending scroll after navigation lands on home
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
    setMenuOpen(false);
  };

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", type: "home" },
    { label: "Shop", type: "scroll-top", to: "/shop" },
    { label: "About", type: "scroll", section: "about" },
    { label: "Contact", type: "scroll", section: "contact" },
  ];

  const isActive = (to) => location.pathname === to;

  const renderLink = (link, isMobile = false) => {
    const baseClass = isMobile
      ? "text-left text-sm font-medium uppercase tracking-wide transition-colors duration-200"
      : "text-sm font-medium tracking-wide uppercase transition-colors duration-200";

    if (link.type === "home") {
      return (
        <button
          key={link.label}
          onClick={goHome}
          className={`${baseClass} ${
            isActive("/") ? "text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          {link.label}
        </button>
      );
    }

    if (link.type === "scroll-top") {
      return (
        <button
          key={link.label}
          onClick={() => {
            navigate(link.to);
            window.scrollTo({ top: 0, behavior: "smooth" });
            setMenuOpen(false);
          }}
          className={`${baseClass} ${
            isActive(link.to) ? "text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          {link.label}
        </button>
      );
    }

    if (link.type === "scroll") {
      return (
        <button
          key={link.label}
          onClick={() => scrollToSection(link.section)}
          className={`${baseClass} text-gray-400 hover:text-white`}
        >
          {link.label}
        </button>
      );
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0F0F1A]/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">

        {/* Logo */}
        <button onClick={goHome} className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}logo/logo.png`}
            alt="Bovic Collections"
            className="h-10 w-auto object-contain"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Bovic Collections
          </span>
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>{renderLink(link)}</li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="https://wa.me/2347064191600"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
        >
          Get in Touch
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden text-gray-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0F0F1A]/98 backdrop-blur-md border-t border-purple-900/30 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => renderLink(link, true))}
          <a
            href="https://wa.me/2347064191600"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-5 py-3 rounded-full transition-all duration-200 mt-2"
          >
            Get in Touch
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;