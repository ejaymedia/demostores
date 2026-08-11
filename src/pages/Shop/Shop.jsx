import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar, Footer, ProductCard, BackToTop } from "../../components/index";
import FilterSidebar from "./FilterSidebar";
import { getProducts, getCategories } from "../../supabaseService";

const genderTabs = [
  { id: "men", label: "👔 Men" },
  { id: "women", label: "👗 Women" },
  { id: "kids", label: "🧒 Kids" },
];

const ITEMS_PER_PAGE = 9;
const DEFAULT_MAX_PRICE = 100000;

const Shop = () => {
  const { gender } = useParams();
  const navigate = useNavigate();

  const activeGender = ["men", "women", "kids"].includes(gender)
    ? gender
    : "men";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [filters, setFilters] = useState({
    category: "all",
    sort: "newest",
    showOnly: "all",
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, DEFAULT_MAX_PRICE]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setCurrentPage(1);
      setFilters({ category: "all", sort: "newest", showOnly: "all" });
      setSearch("");

      const data = await getProducts({ gender: activeGender });
      setProducts(data);

      if (data.length > 0) {
        const max = Math.max(...data.map((p) => p.price));
        setMaxPrice(max);
        setPriceRange([0, max]);
      } else {
        setMaxPrice(DEFAULT_MAX_PRICE);
        setPriceRange([0, DEFAULT_MAX_PRICE]);
      }

      setLoading(false);
    };
    fetchProducts();
  }, [activeGender]);

  const handleGenderChange = (g) => {
    navigate(`/shop/${g}`);
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
    let result = [...products];

    if (filters.category !== "all") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    result = result.filter(
      (p) =>
        (p.sale_price ?? p.price) >= priceRange[0] &&
        (p.sale_price ?? p.price) <= priceRange[1]
    );

    if (filters.showOnly === "hotDeal") {
      result = result.filter((p) => p.is_hot_deal);
    } else if (filters.showOnly === "newArrival") {
      result = result.filter((p) => p.is_new_arrival);
    } else if (filters.showOnly === "onSale") {
      result = result.filter((p) => p.sale_price && p.sale_price < p.price);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

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

    return result;
  }, [products, filters, search, priceRange]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
    return pages;
  };

  const Skeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
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
        <div className="flex gap-1 mb-8 border-b border-gray-100 overflow-x-auto">
          {genderTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleGenderChange(tab.id)}
              className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all duration-200 border-b-2 -mb-px whitespace-nowrap ${
                activeGender === tab.id
                  ? "border-current"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
              style={
                activeGender === tab.id
                  ? {
                      color: "var(--brand-1)",
                      borderColor: "var(--brand-1)",
                    }
                  : {}
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + Mobile Filter */}
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
          <aside className="hidden lg:block w-56 shrink-0 self-start sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              priceRange={priceRange}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              categories={categories}
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
                  maxPrice={maxPrice}
                  onPriceChange={handlePriceChange}
                  categories={categories}
                />
              </div>
            </div>
          )}

          {/* Products area */}
          <div className="flex-1 min-w-0">

            {/* Results count */}
            {!loading && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400 text-sm">
                  Showing{" "}
                  <span className="text-gray-900 font-semibold">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                  </span>{" "}
                  of{" "}
                  <span className="text-gray-900 font-semibold">
                    {filtered.length}
                  </span>{" "}
                  products
                </p>
                {totalPages > 1 && (
                  <p className="text-gray-400 text-sm">
                    Page{" "}
                    <span className="text-gray-900 font-semibold">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="text-gray-900 font-semibold">
                      {totalPages}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Loading */}
            {loading && <Skeleton />}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
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
                    setPriceRange([0, maxPrice]);
                    setCurrentPage(1);
                  }}
                  className="text-white text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:opacity-90"
                  style={{ background: "var(--brand-1)" }}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && paginated.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {paginated.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* ── PAGINATION ─────────────────────────── */}
            {!loading && totalPages > 1 && (
              <div className="mt-12">

                {/* Page info — mobile */}
                <p className="text-center text-gray-400 text-xs mb-4 sm:hidden">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center justify-center gap-1.5 flex-wrap">

                  {/* Prev button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-200 text-gray-500 text-sm font-medium hover:text-gray-900 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft size={15} />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1.5">
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm"
                        >
                          ···
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 ${
                            currentPage === page
                              ? "text-white shadow-sm"
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
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-200 text-gray-500 text-sm font-medium hover:text-gray-900 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={15} />
                  </button>
                </div>

                {/* Jump to page — shows when more than 10 pages */}
                {totalPages > 10 && (
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <span className="text-gray-400 text-xs">Jump to page:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      defaultValue={currentPage}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = Number(e.target.value);
                          if (val >= 1 && val <= totalPages) {
                            handlePageChange(val);
                          }
                        }
                      }}
                      className="w-16 bg-gray-50 border border-gray-200 text-gray-900 text-sm text-center px-2 py-1.5 rounded-lg outline-none focus:border-gray-400 transition-colors duration-200"
                    />
                    <span className="text-gray-400 text-xs">
                      of {totalPages}
                    </span>
                  </div>
                )}
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