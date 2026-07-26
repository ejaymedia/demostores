import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader, Badge } from "../../components/index";
import { products } from "../../data/products";

const NewArrivalsSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const newArrivals = products.filter((p) => p.is_new_arrival && p.in_stock);

  const formatPrice = (amount) => `₦${amount.toLocaleString("en-NG")}`;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (newArrivals.length === 0) return null;

  return (
    <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              label="New Arrivals"
              title="Just Dropped"
            />
          </motion.div>
          <div className="flex items-center gap-3 mb-10">
            {/* Scroll buttons — desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-all duration-200"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-all duration-200"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <button
              onClick={() => navigate("/shop/men")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 hover:opacity-80"
              style={{ color: "var(--brand-1)" }}
            >
              View All
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {newArrivals.map((product, index) => {
            const hasDiscount =
              product.sale_price && product.sale_price < product.price;
            const discountPercent = hasDiscount
              ? Math.round(
                  ((product.price - product.sale_price) / product.price) * 100
                )
              : null;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group flex-shrink-0 w-48 sm:w-56 bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-50 aspect-square">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {hasDiscount ? (
                      <Badge type="onSale" />
                    ) : (
                      <Badge type="newArrival" />
                    )}
                  </div>
                  {/* Discount bubble */}
                  {hasDiscount && (
                    <div
                      className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black"
                      style={{ background: "var(--brand-1)" }}
                    >
                      -{discountPercent}%
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3.5">
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: "var(--brand-1)" }}
                  >
                    {product.tag}
                  </p>
                  <h3 className="text-gray-900 text-sm font-semibold leading-snug line-clamp-1 mb-2">
                    {product.name}
                  </h3>

                  {/* Price */}
                  {hasDiscount ? (
                    <div>
                      <span className="text-gray-400 text-xs line-through mr-1">
                        {formatPrice(product.price)}
                      </span>
                      <span
                        className="text-sm font-black"
                        style={{ color: "var(--brand-1)" }}
                      >
                        {formatPrice(product.sale_price)}
                      </span>
                      <p className="text-green-600 text-xs font-medium mt-0.5">
                        Save {formatPrice(product.price - product.sale_price)}
                      </p>
                    </div>
                  ) : (
                    <span
                      className="text-sm font-black"
                      style={{ color: "var(--brand-1)" }}
                    >
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile scroll hint */}
        <p className="text-center text-xs text-gray-400 mt-4 sm:hidden">
          ← Swipe to see more →
        </p>
      </div>
    </div>
  );
};

export default NewArrivalsSection;