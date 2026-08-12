import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useSite } from "../../context/SiteContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { siteSettings } = useSite();

  const genderLinks = [
    { label: "Shop Men", path: "/shop/men" },
    { label: "Shop Women", path: "/shop/women" },
    { label: "Shop Kids", path: "/shop/kids" },
  ];

  const scrollToNext = () => {
    const nextSection = document.getElementById("gender");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Background Image with Ken Burns zoom */}
      <div className="absolute inset-0 z-0">
        {siteSettings.hero_url ? (
          <img
            src={siteSettings.hero_url}
            alt="Hero background"
            className="w-full h-full object-cover animate-[kenburns_20s_ease-in-out_infinite_alternate]"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, var(--brand-shade-darker), var(--brand-1))`,
            }}
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Main content — centered vertically */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pt-20 pb-24">
        <div className="text-center max-w-4xl mx-auto w-full">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--brand-1)" }}
            />
            New Season Arrivals
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-4 tracking-tight"
          >
            {siteSettings.business_name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/70 text-lg sm:text-xl md:text-2xl font-light leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            {siteSettings.tagline}
          </motion.p>

          {/* Gender CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            {genderLinks.map((link, index) => (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`w-full sm:w-auto font-semibold px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-200 hover:-translate-y-0.5 ${
                  index === 0
                    ? "text-white hover:opacity-90"
                    : "bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20"
                }`}
                style={index === 0 ? { background: "var(--brand-1)" } : {}}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — pinned to very bottom of hero */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group cursor-pointer"
        aria-label="Scroll to next section"
      >
        <span className="text-white/50 text-xs uppercase tracking-widest font-medium group-hover:text-white/80 transition-colors duration-200">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors duration-200"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <ChevronDown size={16} className="text-white/60 group-hover:text-white transition-colors duration-200" />
        </motion.div>
      </motion.button>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default HeroSection;