import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { categories } from "../../data/categories";

const emptyForm = {
  name: "",
  category: "sneakers",
  gender: "Unisex",
  tag: "Footwear",
  description: "",
  sizes: [],
  colors: [],
  hotDeal: false,
  inStock: true,
};

const genderOptions = ["Unisex", "Men", "Women"];
const tagOptions = ["Footwear", "Clothing", "Bags", "Home"];
const sizePresets = {
  sneakers: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
  slides: ["36", "37", "38", "39", "40", "41", "42", "43", "44"],
  heels: ["36", "37", "38", "39", "40", "41"],
  wears: ["XS", "S", "M", "L", "XL", "XXL"],
  bags: ["One Size"],
  beddings: ["Single", "Double", "King"],
};

const AddEditProductModal = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [colorInput, setColorInput] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCategoryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      category: value,
      sizes: [],
      image: `${import.meta.env.BASE_URL}categories/${value}.jpg`,
    }));
  };

  const handleToggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleAddColor = () => {
    const trimmed = colorInput.trim();
    if (trimmed && !form.colors.includes(trimmed)) {
      setForm((prev) => ({ ...prev, colors: [...prev.colors, trimmed] }));
      setColorInput("");
    }
  };

  const handleRemoveColor = (color) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleColorKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddColor();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (form.sizes.length === 0)
      newErrors.sizes = "Select at least one size.";
    if (form.colors.length === 0)
      newErrors.colors = "Add at least one colour.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      image: `${import.meta.env.BASE_URL}categories/${form.category}.jpg`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1A1A2E] border border-purple-900/20 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/40">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-purple-900/20 sticky top-0 bg-[#1A1A2E] z-10">
          <h2 className="text-white font-bold text-lg">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-7 py-6 flex flex-col gap-5">

          {/* Product Name */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Air Trainer Pro"
              className="w-full bg-[#0F0F1A] border border-purple-900/30 text-white text-sm placeholder-gray-600 px-4 py-3 rounded-xl outline-none focus:border-purple-500/60 transition-colors duration-200"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category + Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-[#0F0F1A] border border-purple-900/30 text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-purple-500/60 transition-colors duration-200 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
                Gender *
              </label>
              <select
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full bg-[#0F0F1A] border border-purple-900/30 text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-purple-500/60 transition-colors duration-200 cursor-pointer"
              >
                {genderOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tag */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
              Tag *
            </label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleChange("tag", tag)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                    form.tag === tag
                      ? "bg-purple-700 text-white border-purple-600"
                      : "bg-transparent text-gray-400 border-white/10 hover:border-purple-500/40 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the product — materials, style, occasion..."
              rows={3}
              className="w-full bg-[#0F0F1A] border border-purple-900/30 text-white text-sm placeholder-gray-600 px-4 py-3 rounded-xl outline-none focus:border-purple-500/60 transition-colors duration-200 resize-none"
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Sizes */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
              Sizes * {errors.sizes && (
                <span className="text-red-400 normal-case ml-1">
                  {errors.sizes}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {(sizePresets[form.category] || sizePresets.sneakers).map(
                (size) => (
                  <button
                    key={size}
                    onClick={() => handleToggleSize(size)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      form.sizes.includes(size)
                        ? "bg-purple-700 text-white border-purple-600"
                        : "bg-transparent text-gray-400 border-white/10 hover:border-purple-500/40 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
              Colours * {errors.colors && (
                <span className="text-red-400 normal-case ml-1">
                  {errors.colors}
                </span>
              )}
            </label>
            {/* Added colors */}
            {form.colors.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1.5 bg-purple-700/20 border border-purple-500/30 text-purple-300 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {color}
                    <button
                      onClick={() => handleRemoveColor(color)}
                      className="text-purple-400 hover:text-white transition-colors"
                      aria-label={`Remove ${color}`}
                    >
                      <Minus size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Color input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={handleColorKeyDown}
                placeholder="e.g. Black, Red, Navy..."
                className="flex-1 bg-[#0F0F1A] border border-purple-900/30 text-white text-sm placeholder-gray-600 px-4 py-2.5 rounded-xl outline-none focus:border-purple-500/60 transition-colors duration-200"
              />
              <button
                onClick={handleAddColor}
                className="bg-purple-700 hover:bg-purple-800 text-white p-2.5 rounded-xl transition-colors duration-200"
                aria-label="Add colour"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4">
            {/* Hot Deal */}
            <div className="bg-[#0F0F1A] border border-purple-900/20 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-semibold">Hot Deal</p>
                <p className="text-gray-600 text-xs">Feature on homepage</p>
              </div>
              <button
                onClick={() => handleChange("hotDeal", !form.hotDeal)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                  form.hotDeal ? "bg-amber-500" : "bg-gray-600"
                }`}
                aria-label="Toggle hot deal"
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    form.hotDeal ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* In Stock */}
            <div className="bg-[#0F0F1A] border border-purple-900/20 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-semibold">In Stock</p>
                <p className="text-gray-600 text-xs">Show as available</p>
              </div>
              <button
                onClick={() => handleChange("inStock", !form.inStock)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                  form.inStock ? "bg-green-600" : "bg-gray-600"
                }`}
                aria-label="Toggle in stock"
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    form.inStock ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-purple-900/20 sticky bottom-0 bg-[#1A1A2E]">
          <button
            onClick={onClose}
            className="flex-1 border border-white/10 text-gray-400 hover:text-white text-sm font-medium py-3.5 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            {product ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProductModal;