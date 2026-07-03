import { Navbar, Footer } from "./components/index";
import HeroSection from "./pages/Home/HeroSection";
import CategoriesSection from "./pages/Home/CategoriesSection";
import AboutSection from "./pages/Home/AboutSection";
import FeaturesSection from "./pages/Home/FeaturesSection";
import FeaturedProducts from "./pages/Home/FeaturedProducts";
import ContactSection from "./pages/Home/ContactSection";

const App = () => {
  return (
    <div className="bg-[#0F0F1A] min-h-screen">
      <Navbar />
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        <section id="categories">
          <CategoriesSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="products">
          <FeaturedProducts />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;