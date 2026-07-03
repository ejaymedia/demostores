import { X } from "lucide-react";
import { categories } from "../../data/categories";

const genders = ["All", "Men", "Women", "Unisex"];
const sortOptions = ["Newest", "A–Z", "Z–A", "Hot Deals"];

const FilterSidebar = ({ filters, onChange, onClose, isMobile = false }) => {
  const handleCategory = (id) => {
    onChange({ ...filters, category: id });
  };

  const handleGender = (gender) => {
    onChange({ ...filters, gender });
  };

  const handleSort = (sort) => {
    onChange({ ...filters, sort });
  };

  const handleReset = () => {
    onChange({ category: "all", gender: "All", sort: "Newest" });
  };

  return (
    <div className="bg-[#1A1A2E] border border-purple-900/20 rounded-2xl p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-sm font-semibold uppercase tracking-widest">
          Filters
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors duration-200"
          >
            Reset
          </button>
          {isMobile && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
          Category
        </p>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => handleCategory("all")}
            className={`text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
              filters.category === "all"
                ? "bg-purple-700/30 text-white font-medium border border-purple-500/40"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                filters.category === cat.id
                  ? "bg-purple-700/30 text-white font-medium border border-purple-500/40"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-purple-900/20 mb-6" />

      {/* Gender Filter */}
      <div className="mb-6">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
          Gender
        </p>
        <div className="flex flex-wrap gap-2">
          {genders.map((gender) => (
            <button
              key={gender}
              onClick={() => handleGender(gender)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                filters.gender === gender
                  ? "bg-purple-700 text-white border-purple-600"
                  : "bg-transparent text-gray-400 border-white/10 hover:border-purple-500/40 hover:text-white"
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-purple-900/20 mb-6" />

      {/* Sort */}
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
          Sort By
        </p>
        <div className="flex flex-col gap-1.5">
          {sortOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleSort(option)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                filters.sort === option
                  ? "bg-purple-700/30 text-white font-medium border border-purple-500/40"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;