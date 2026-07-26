import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";

const genderOptions = ["men", "women", "kids"];
const categoryOptions = ["clothing", "shoes", "bags", "accessories"];
const tagOptions = ["Clothing", "Shoes", "Bags", "Accessories"];

const sizePresets = {
  clothing: {
    men: ["XS", "S", "M", "L", "XL", "XXL"],
    women: ["XS", "S", "M", "L", "XL"],
    kids: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  },
  shoes: {
    men: ["39", "40", "41", "42", "43", "44", "45"],
    women: ["36", "37", "38", "39", "40", "41"],
    kids: ["EU 25", "EU 27", "EU 29", "EU 31", "EU 33", "EU 35"],
  },
  bags: {
    men: ["One Size"],
    women: ["One Size"],
    kids: ["One Size"],
  },
  accessories: {
    men: ["One Size"],
    women: ["One Size"],
    kids: ["One Size"],
  },
};

const emptyForm = {
  name: "",
  gender: "men",
  category: "clothing",
  tag: "Clothing",
  description: "",
  price: "",
  sale_price: "",
  sizes: [],
  colors: [],
  is_new_arrival: false,
  is_hot_deal: false,
  in_stock: true,
  image_url: `${import.meta.env.BASE_URL}genders/men.jpg`,
};

const AddEditProductModal = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [colorInput, setColorInput] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        price: product.price?.toString() || "",
        sale_price: product.sale_price?.toString() || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGenderChange = (value) => {
    setForm((prev) => ({
      ...prev,
      gender: value,
      sizes: [],
      image_url: `${import.meta.env.BASE_URL}genders/${value}.jpg`,
    }));
  };

  const handleCategoryChange = (value) => {
    const tagMap = {
      clothing: "Clothing",
      shoes: "Shoes",
      bags: "Bags",
      accessories: "Accessories",
    };
    setForm((prev) => ({
      ...prev,
      category: value,
      tag: tagMap[value],
      sizes: [],
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
      setForm((prev) => ({
        ...prev,
        colors: [...prev.colors, trimmed],
      }));
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
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = "Valid price is required.";
    if (
      form.sale_price &&
      (isNaN(Number(form.sale_price)) ||
        Number(form.sale_price) >= Number(form.price))
    )
      newErrors.sale_price = "Sale price must be less than original price.";
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
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
    });
  };

  const currentSizes =
    sizePresets[form.category]?.[form.gender] || ["One Size"];

  const inputClass =
    "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 px-4 py-3 rounded-xl outline-none focus:border-gray-400 transition-colors duration-200";

  const labelClass =
    "text-gray-500 text-xs font-bold uppercase tracking-widest block mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-gray-900 font-bold text-lg">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-7 py-6 flex flex-col gap-5">

          {/* Name */}
          <div>
            <label className={labelClass}>Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Classic Polo Shirt"
              className={inputClass}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Gender + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Gender *</label>
              <select
                value={form.gender}
                onChange={(e) => handleGenderChange(e.target.value)}
                className={inputClass}
              >
                {genderOptions.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={inputClass}
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tag */}
          <div>
            <label className={labelClass}>Tag *</label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleChange("tag", tag)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                    form.tag === tag
                      ? "text-white border-current"
                      : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                  style={
                    form.tag === tag
                      ? {
                          background: "var(--brand-1)",
                          borderColor: "var(--brand-1)",
                        }
                      : {}
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the product — materials, style, occasion..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price + Sale Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (₦) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="e.g. 15000"
                className={inputClass}
                min={0}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Sale Price (₦)</label>
              <input
                type="number"
                value={form.sale_price}
                onChange={(e) => handleChange("sale_price", e.target.value)}
                placeholder="Leave blank if no sale"
                className={inputClass}
                min={0}
              />
              {errors.sale_price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sale_price}
                </p>
              )}
              {form.price &&
                form.sale_price &&
                !errors.sale_price &&
                Number(form.sale_price) < Number(form.price) && (
                  <p className="text-green-600 text-xs mt-1">
                    {Math.round(
                      ((Number(form.price) - Number(form.sale_price)) /
                        Number(form.price)) *
                        100
                    )}
                    % off · Save ₦
                    {(
                      Number(form.price) - Number(form.sale_price)
                    ).toLocaleString("en-NG")}
                  </p>
                )}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className={labelClass}>
              Sizes *{" "}
              {errors.sizes && (
                <span className="text-red-500 normal-case font-normal ml-1">
                  {errors.sizes}
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {currentSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleToggleSize(size)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 ${
                    form.sizes.includes(size)
                      ? "text-white border-current"
                      : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                  style={
                    form.sizes.includes(size)
                      ? {
                          background: "var(--brand-1)",
                          borderColor: "var(--brand-1)",
                        }
                      : {}
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className={labelClass}>
              Colours *{" "}
              {errors.colors && (
                <span className="text-red-500 normal-case font-normal ml-1">
                  {errors.colors}
                </span>
              )}
            </label>
            {form.colors.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {color}
                    <button
                      onClick={() => handleRemoveColor(color)}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                      aria-label={`Remove ${color}`}
                    >
                      <Minus size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={handleColorKeyDown}
                placeholder="e.g. Black, Navy, Red..."
                className={`${inputClass} flex-1`}
              />
              <button
                onClick={handleAddColor}
                className="text-white p-3 rounded-xl transition-colors duration-200 hover:opacity-90 shrink-0"
                style={{ background: "var(--brand-1)" }}
                aria-label="Add colour"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                key: "is_new_arrival",
                label: "New Arrival",
                sub: "Show in New Arrivals",
                activeColor: "bg-blue-500",
              },
              {
                key: "is_hot_deal",
                label: "Hot Deal",
                sub: "Feature on homepage",
                activeColor: "bg-amber-500",
              },
              {
                key: "in_stock",
                label: "In Stock",
                sub: "Show as available",
                activeColor: "bg-green-500",
              },
            ].map((toggle) => (
              <div
                key={toggle.key}
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-900 text-xs font-semibold">
                    {toggle.label}
                  </p>
                  <p className="text-gray-400 text-xs">{toggle.sub}</p>
                </div>
                <button
                  onClick={() => handleChange(toggle.key, !form[toggle.key])}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${
                    form[toggle.key] ? toggle.activeColor : "bg-gray-300"
                  }`}
                  aria-label={`Toggle ${toggle.label}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      form[toggle.key] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 py-5 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-500 hover:text-gray-900 text-sm font-medium py-3.5 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "var(--brand-1)" }}
          >
            {product ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProductModal;