import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar, Footer, BackToTop } from "./components/index";
import HeroSection from "./pages/Home/HeroSection";
import GenderSection from "./pages/Home/GenderSection";
import FeaturedProducts from "./pages/Home/FeaturedProducts";
import FeaturesSection from "./pages/Home/FeaturesSection";
import { useSite } from "./context/SiteContext";

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
    >
      {/* Circular container with spinning border */}
      <div className="relative flex items-center justify-center">

        {/* Spinning ring — pure CSS, no brand colour dependency */}
        <svg
          className="absolute animate-spin"
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDuration: "1.2s" }}
        >
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <path
            d="M48 4 A44 44 0 0 1 92 48"
            stroke="#111827"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* Logo inside circle */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
          <img
            src={`${import.meta.env.BASE_URL}logo/logo.png`}
            alt="Loading"
            className="w-14 h-14 object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
};

const App = () => {
  const { loading: siteLoading } = useSite();
  const [pageReady, setPageReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Wait for site settings to load from Supabase
    if (!siteLoading) {
      // Give the page a little extra time to paint
      const timer = setTimeout(() => {
        setPageReady(true);
        // Keep loader visible briefly after content ready for smooth exit
        setTimeout(() => setShowLoader(false), 600);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [siteLoading]);

  return (
    <>
      {/* Loading screen */}
      <AnimatePresence>
        {showLoader && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {/* Main page — renders behind loader, visible after exit */}
      <div
        className="bg-white min-h-screen"
        style={{ visibility: pageReady ? "visible" : "hidden" }}
      >
        <Navbar />
        <main>
          <section id="hero">
            <HeroSection />
          </section>
          <section id="gender">
            <GenderSection />
          </section>
          <section id="featured">
            <FeaturedProducts />
          </section>
          <section id="services">
            <FeaturesSection />
          </section>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
};

export default App;