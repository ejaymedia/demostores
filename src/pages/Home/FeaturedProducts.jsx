import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader, ProductCard } from "../../components/index";
import { products } from "../../data/products";

const FeaturedProducts = () => {
  const navigate = useNavigate();

  // Hot deals first, fill remaining from others, max 8
  const hotDeals = products.filter((p) => p.is_hot_deal && p.in_stock);
  const others = products.filter((p) => !p.is_hot_deal && p.in_stock);
  const featured = [...hotDeals, ...others].slice(0, 8);

  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              label="Hot Deals"
              title={
                <>
                  Best Picks
                  <br />
                  Right Now
                </>
              }
            />
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            onClick={() => navigate("/shop/men")}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:opacity-80 mb-10 shrink-0"
            style={{ color: "var(--brand-1)" }}
          >
            View Full Catalogue
            <ArrowRight size={15} />
          </motion.button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {featured.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default FeaturedProducts;