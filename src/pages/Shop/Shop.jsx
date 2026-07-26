import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { Navbar, Footer, ProductCard, BackToTop } from "../../components/index";
import FilterSidebar from "./FilterSidebar";
import { products } from "../../data/products";

const ITEMS_PER_PAGE = 9;

const genderTabs = [
  { id: "men", label: "👔 Men" },
  { id: "women", label: "👗 Women" },
  { id: "kids", label: "🧒 Kids" },
];

const maxPriceFromProducts = Math.max(...products.map((p) => p.price));

const Shop = () => {
  const { gender } = useParams();
  const navigate = useNavigate();

  const activeGender = ["men", "women", "kids"].includes(gender)
    ? gender
    : "men";

  const [filters, setFilters] = useState({
    category: "all",
    sort: "newest",
    showOnly: "all",
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, maxPriceFromProducts]);

  const handleGenderChange = (g) => {
    navigate(`/shop/${g}`);
    setCurrentPage(1);
    setFilters({ category: "all", sort: "newest", showOnly: "all" });
    setSearch("");
    setPriceRange([0, maxPriceFromProducts]);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.gender === activeGender);

    // Category
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price range
    result = result.filter(
      (p) =>
        (p.sale_price ?? p.price) >= priceRange[0] &&
        (p.sale_price ?? p.price) <= priceRange[1]
    );

    // Show only
    if (filters.showOnly === "hotDeal") {
      result = result.filter((p) => p.is_hot_deal);
    } else if (filters.showOnly === "newArrival") {
      result = result.filter((p) => p.is_new_arrival);
    } else if (filters.showOnly === "onSale") {
      result = result.filter(
        (p) => p.sale_price && p.sale_price < p.price
      );
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (filters.sort === "price_asc") {
      result.sort(
        (a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price)
      );
    } else if (filters.sort === "price_desc") {
      result.sort(
        (a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price)
      );
    } else if (filters.sort === "onSale") {
      result.sort(
        (a, b) =>
          Number(b.sale_price !== null) - Number(a.sale_price !== null)
      );
    }
    // Default: newest — products array order

    return result;
  }, [activeGender, filters, search, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-20">

        {/* Page Header */}
        <div className="mb-8">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--brand-1)" }}
          >
            Browse
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Our Collection
          </h1>
          <div
            className="w-14 h-1 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--brand-1), var(--brand-2))",
            }}
          />
        </div>

        {/* Gender Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-100 pb-1">
          {genderTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleGenderChange(tab.id)}
              className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all duration-200 border-b-2 -mb-px ${
                activeGender === tab.id
                  ? "border-current"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
              style={
                activeGender === tab.id
                  ? { color: "var(--brand-1)", borderColor: "var(--brand-1)" }
                  : {}
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + Mobile Filter Toggle */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={`Search in ${
                activeGender.charAt(0).toUpperCase() + activeGender.slice(1)
              }'s collection...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 pl-10 pr-4 py-3 rounded-full outline-none focus:border-gray-400 transition-colors duration-200"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-medium px-4 py-3 rounded-full hover:border-gray-400 transition-all duration-200 shrink-0"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        <div className="flex gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              priceRange={priceRange}
              maxPrice={maxPriceFromProducts}
              onPriceChange={handlePriceChange}
            />
          </aside>

          {/* Mobile Sidebar Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative z-10 w-72 bg-white h-full overflow-y-auto p-5 shadow-2xl">
                <FilterSidebar
                  filters={filters}
                  onChange={(f) => {
                    handleFilterChange(f);
                    setMobileFilterOpen(false);
                  }}
                  onClose={() => setMobileFilterOpen(false)}
                  isMobile
                  priceRange={priceRange}
                  maxPrice={maxPriceFromProducts}
                  onPriceChange={(range) => {
                    handlePriceChange(range);
                  }}
                />
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0">

            {/* Results count */}
            <p className="text-gray-400 text-sm mb-6">
              Showing{" "}
              <span className="text-gray-900 font-semibold">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "product" : "products"} in{" "}
              <span className="text-gray-900 font-semibold capitalize">
                {activeGender}'s
              </span>{" "}
              collection
            </p>

            {/* Grid */}
            {paginated.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {paginated.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-6xl mb-4">🔍</span>
                <h3 className="text-gray-900 font-bold text-lg mb-2">
                  No products found
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      category: "all",
                      sort: "newest",
                      showOnly: "all",
                    });
                    setSearch("");
                    setPriceRange([0, maxPriceFromProducts]);
                  }}
                  className="text-white text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:opacity-90"
                  style={{ background: "var(--brand-1)" }}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="text-sm px-4 py-2.5 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 ${
                        currentPage === page
                          ? "text-white"
                          : "border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400"
                      }`}
                      style={
                        currentPage === page
                          ? { background: "var(--brand-1)" }
                          : {}
                      }
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="text-sm px-4 py-2.5 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Shop;