import { X } from "lucide-react";

const sortOptions = [
  { id: "newest", label: "Newest" },
  { id: "price_asc", label: "Price: Low–High" },
  { id: "price_desc", label: "Price: High–Low" },
  { id: "onSale", label: "On Sale" },
];

const showOnlyOptions = [
  { id: "all", label: "All Products" },
  { id: "hotDeal", label: "🔥 Hot Deals" },
  { id: "newArrival", label: "🆕 New Arrivals" },
  { id: "onSale", label: "🏷️ On Sale" },
];

const FilterSidebar = ({
  filters,
  onChange,
  onClose,
  isMobile = false,
  priceRange,
  maxPrice,
  onPriceChange,
  categories = [],
}) => {
  const handleReset = () => {
    onChange({ category: "all", sort: "newest", showOnly: "all" });
    onPriceChange([0, maxPrice]);
  };

  const allCategories = [
    { id: "all", label: "All" },
    ...categories.map((cat) => ({
      id: cat.name.toLowerCase(),
      label: cat.name,
    })),
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-gray-900 text-xs font-bold uppercase tracking-widest">
          Filters
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="text-xs font-semibold transition-colors duration-200 hover:opacity-80"
            style={{ color: "var(--brand-1)" }}
          >
            Reset
          </button>
          {isMobile && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="mb-5">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
          Category
        </p>
        <div className="flex flex-col gap-1">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ ...filters, category: cat.id })}
              className={`text-left text-sm px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                filters.category === cat.id
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
              style={
                filters.category === cat.id
                  ? { background: "var(--brand-1)" }
                  : {}
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-5" />

      {/* Price Range */}
      <div className="mb-5">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
          Price Range
        </p>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={500}
          value={priceRange[1]}
          onChange={(e) => onPriceChange([0, Number(e.target.value)])}
          className="w-full cursor-pointer accent-[var(--brand-1)]"
          style={{ accentColor: "var(--brand-1)" }}
        />
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">₦0</span>
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--brand-1)" }}
          >
            Up to ₦{priceRange[1].toLocaleString("en-NG")}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-5" />

      {/* Sort By */}
      <div className="mb-5">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
          Sort By
        </p>
        <div className="flex flex-col gap-1">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onChange({ ...filters, sort: option.id })}
              className={`text-left text-sm px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                filters.sort === option.id
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
              style={
                filters.sort === option.id
                  ? { background: "var(--brand-1)" }
                  : {}
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-5" />

      {/* Show Only */}
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
          Show Only
        </p>
        <div className="flex flex-col gap-1">
          {showOnlyOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onChange({ ...filters, showOnly: option.id })}
              className={`text-left text-sm px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                filters.showOnly === option.id
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
              style={
                filters.showOnly === option.id
                  ? { background: "var(--brand-1)" }
                  : {}
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;