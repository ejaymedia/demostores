import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader, ProductCard } from "../../components/index";
import { getHotDeals } from "../../supabaseService";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotDeals = async () => {
      setLoading(true);
      const data = await getHotDeals(8);
      setProducts(data);
      setLoading(false);
    };
    fetchHotDeals();
  }, []);

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
              label="Hot Deals & Sale"
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

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded-full w-1/3" />
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-full w-full" />
                  <div className="h-3 bg-gray-200 rounded-full w-2/3" />
                  <div className="h-8 bg-gray-200 rounded-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🛍️</span>
            <p className="text-gray-400 text-sm">
              No hot deals available right now. Check back soon!
            </p>
          </div>
        )}

        {/* Products grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;