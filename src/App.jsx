import { Navbar, Footer, BackToTop } from "./components/index";
import HeroSection from "./pages/Home/HeroSection";
import GenderSection from "./pages/Home/GenderSection";
import FeaturedProducts from "./pages/Home/FeaturedProducts";
import FeaturesSection from "./pages/Home/FeaturesSection";

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
  );
};

export default App;