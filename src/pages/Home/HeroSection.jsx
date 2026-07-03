import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-16">

      {/* Background */}
      <div className="absolute inset-0 bg-[#0F0F1A]">
        {/* Hero image */}
        <img
          src={`${import.meta.env.BASE_URL}hero/hero-bg.jpg`}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F1A]/60 via-transparent to-[#0F0F1A]" />
        <div className="absolute inset-0 bg-radial-[ellipse_80%_60%_at_60%_40%] from-purple-700/20 to-transparent" />
        <div className="absolute inset-0 bg-radial-[ellipse_50%_40%_at_20%_70%] from-amber-500/10 to-transparent" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(123,47,190,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(123,47,190,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-700/40 text-purple-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Now Available in Nigeria
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black leading-none mb-4 text-white"
        >
          Dress Your
          <span className="block bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Best Every Day
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto font-light"
        >
          Premium fashion for every lifestyle — from sleek sneakers to designer
          bags, luxury bedding to show-stopping heels.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/shop"
            className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 text-sm tracking-wide"
          >
            Shop the Collection
          </Link>
          <a
            href="https://wa.me/2347064191600"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto border border-white/20 hover:border-white/50 text-white font-medium px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 text-sm tracking-wide"
          >
            Reach Us on WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Rainbow bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400" />
    </div>
  );
};

export default HeroSection;