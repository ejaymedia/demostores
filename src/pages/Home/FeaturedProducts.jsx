import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader, ProductCard } from "../../components/index";
import { getHotDeals } from "../../supabaseService";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const rowRef = useRef(null);

  // How many cards visible per page depends on screen — we handle via scroll
  const CARDS_PER_PAGE = 4;

  useEffect(() => {
    const fetchHotDeals = async () => {
      setLoading(true);
      const data = await getHotDeals(20);
      setProducts(data);
      setLoading(false);
    };
    fetchHotDeals();
  }, []);

  const totalPages = Math.ceil(products.length / CARDS_PER_PAGE);

  const handlePrev = () => {
    const newPage = Math.max(currentPage - 1, 0);
    setCurrentPage(newPage);
    scrollToPage(newPage);
  };

  const handleNext = () => {
    const newPage = Math.min(currentPage + 1, totalPages - 1);
    setCurrentPage(newPage);
    scrollToPage(newPage);
  };

  const scrollToPage = (page) => {
    if (!rowRef.current) return;
    const cardWidth = rowRef.current.scrollWidth / products.length;
    rowRef.current.scrollTo({
      left: cardWidth * CARDS_PER_PAGE * page,
      behavior: "smooth",
    });
  };

  // Sync currentPage when user manually scrolls
  const handleScroll = () => {
    if (!rowRef.current || products.length === 0) return;
    const cardWidth = rowRef.current.scrollWidth / products.length;
    const page = Math.round(
      rowRef.current.scrollLeft / (cardWidth * CARDS_PER_PAGE)
    );
    setCurrentPage(Math.min(page, totalPages - 1));
  };

  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex items-end justify-between gap-4 mb-10">
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

          <div className="flex items-center gap-3 mb-10 shrink-0">
            {/* Prev / Next — only when more than one page */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

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

        {/* Loading skeleton — single row */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded-full w-1/3" />
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-full w-full" />
                  <div className="h-8 bg-gray-200 rounded-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🛍️</span>
            <p className="text-gray-400 text-sm">
              No hot deals available right now. Check back soon!
            </p>
          </div>
        )}

        {/* Single row — horizontal scroll on mobile, paginated on desktop */}
        {!loading && products.length > 0 && (
          <>
            <div
              ref={rowRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto pb-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="shrink-0"
                  style={{
                    // On mobile: 2 per row. On sm+: 4 per row
                    width: "calc(50% - 8px)",
                    minWidth: "160px",
                    maxWidth: "280px",
                  }}
                >
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i);
                      scrollToPage(i);
                    }}
                    className="transition-all duration-200 rounded-full"
                    style={{
                      width: currentPage === i ? "24px" : "8px",
                      height: "8px",
                      background:
                        currentPage === i
                          ? "var(--brand-1)"
                          : "#d1d5db",
                    }}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Mobile swipe hint */}
            {products.length > 2 && (
              <p className="text-center text-xs text-gray-400 mt-3 sm:hidden">
                ← Swipe to see more →
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;