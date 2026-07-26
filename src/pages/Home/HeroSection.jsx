import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSite } from "../../context/SiteContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { siteSettings } = useSite();

  const genderLinks = [
    { label: "Shop Men", path: "/shop/men" },
    { label: "Shop Women", path: "/shop/women" },
    { label: "Shop Kids", path: "/shop/kids" },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Hero Background Image with Ken Burns zoom */}
      <div className="absolute inset-0 z-0">
        <img
          src={siteSettings.hero_url}
          alt="Hero background"
          className="w-full h-full object-cover animate-[kenburns_20s_ease-in-out_infinite_alternate]"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">

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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </div>
  );
};

export default HeroSection;