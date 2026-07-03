import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Navbar, Footer, ProductCard } from "../../components/index";
import FilterSidebar from "./FilterSidebar";
import { products } from "../../data/products";

const ITEMS_PER_PAGE = 6;

const Shop = () => {
  const [filters, setFilters] = useState({
    category: "all",
    gender: "All",
    sort: "Newest",
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    // Category
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Gender
    if (filters.gender !== "All") {
      result = result.filter((p) => p.gender === filters.gender);
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
    if (filters.sort === "A–Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === "Z–A") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (filters.sort === "Hot Deals") {
      result.sort((a, b) => Number(b.hotDeal) - Number(a.hotDeal));
    }

    return result;
  }, [filters, search]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#0F0F1A] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-20">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            Browse
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Our Collection
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        </div>

        {/* Search + Mobile Filter Toggle */}
        <div className="flex items-center gap-3 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="flex-1 bg-[#1A1A2E] border border-purple-900/30 text-white text-sm placeholder-gray-500 px-5 py-3 rounded-full outline-none focus:border-purple-500/60 transition-colors duration-200"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-[#1A1A2E] border border-purple-900/30 text-gray-400 text-sm px-4 py-3 rounded-full hover:border-purple-500/40 hover:text-white transition-all duration-200"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <div className="flex gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
            />
          </aside>

          {/* Mobile Sidebar Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative z-10 w-72 bg-[#0F0F1A] h-full overflow-y-auto p-6 shadow-2xl">
                <FilterSidebar
                  filters={filters}
                  onChange={(f) => {
                    handleFilterChange(f);
                    setMobileFilterOpen(false);
                  }}
                  onClose={() => setMobileFilterOpen(false)}
                  isMobile
                />
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1">

            {/* Results count */}
            <p className="text-gray-500 text-sm mb-6">
              Showing{" "}
              <span className="text-white font-medium">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "product" : "products"}
            </p>

            {/* Grid */}
            {paginated.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-5xl mb-4">🔍</span>
                <h3 className="text-white font-semibold text-lg mb-2">
                  No products found
                </h3>
                <p className="text-gray-400 text-sm">
                  Try adjusting your filters or search term.
                </p>
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
                  className="text-sm px-4 py-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-purple-700 text-white border border-purple-600"
                          : "border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40"
                      }`}
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
                  className="text-sm px-4 py-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;