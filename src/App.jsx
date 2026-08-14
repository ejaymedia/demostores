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
      {/* Static logo from public folder */}
      <motion.img
        src={`${import.meta.env.BASE_URL}logo/logo.png`}
        alt="Loading"
        className="w-16 h-16 object-contain mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Animated loading bar */}
      <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--brand-1)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
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