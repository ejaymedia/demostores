import { Navbar, Footer, BackToTop } from "./components/index";
import HeroSection from "./pages/Home/HeroSection";
import GenderSection from "./pages/Home/GenderSection";
import NewArrivalsSection from "./pages/Home/NewArrivalsSection";
import FeaturedProducts from "./pages/Home/FeaturedProducts";
import FeaturesSection from "./pages/Home/FeaturesSection";
import ContactSection from "./pages/Home/ContactSection";

const App = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        <section id="gender">
          <GenderSection />
        </section>
        <section id="new-arrivals">
          <NewArrivalsSection />
        </section>
        <section id="featured">
          <FeaturedProducts />
        </section>
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default App;