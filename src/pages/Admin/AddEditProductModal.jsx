import { useState, useEffect, useRef } from "react";
import { X, Plus, Minus, Upload, RefreshCw, Image } from "lucide-react";
import { uploadFile } from "../../supabaseService";

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
  image_url: "",
};

const AddEditProductModal = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [colorInput, setColorInput] = useState("");
  const [errors, setErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const imageRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        price: product.price?.toString() || "",
        sale_price: product.sale_price?.toString() || "",
      });
      setImagePreview(product.image_url || "");
    } else {
      setForm(emptyForm);
      setImagePreview("");
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

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    setUploadingImage(true);
    setErrors((prev) => ({ ...prev, image_url: "" }));

    try {
      const path = `products/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const url = await uploadFile("product-images", path, file);

      if (url) {
        setForm((prev) => ({ ...prev, image_url: url }));
        setImagePreview(url);
      } else {
        // Keep local preview but flag error
        setForm((prev) => ({ ...prev, image_url: localUrl }));
        setErrors((prev) => ({
          ...prev,
          image_url:
            "Upload failed — image will only show locally until Supabase is connected.",
        }));
      }
    } catch (err) {
      console.error("Image upload error:", err);
      setForm((prev) => ({ ...prev, image_url: localUrl }));
    } finally {
      setUploadingImage(false);
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
    if (!form.image_url)
      newErrors.image_url = "Please upload a product image.";
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

  const discountPercent =
    form.price &&
    form.sale_price &&
    !isNaN(Number(form.price)) &&
    !isNaN(Number(form.sale_price)) &&
    Number(form.sale_price) < Number(form.price)
      ? Math.round(
          ((Number(form.price) - Number(form.sale_price)) /
            Number(form.price)) *
            100
        )
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-gray-900 font-bold text-base">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors duration-200 p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* ── IMAGE UPLOAD ─────────────────────────── */}
          <div>
            <label className={labelClass}>
              Product Image *{" "}
              {errors.image_url && (
                <span className="text-red-500 normal-case font-normal ml-1">
                  {errors.image_url}
                </span>
              )}
            </label>

            <div
              onClick={() => !uploadingImage && imageRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${
                errors.image_url
                  ? "border-red-300 bg-red-50"
                  : imagePreview
                  ? "border-gray-200 bg-gray-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
              }`}
              style={{ minHeight: "180px" }}
            >
              {imagePreview ? (
                /* Image Preview */
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-48 object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    <Upload size={20} className="text-white" />
                    <span className="text-white text-xs font-semibold">
                      Change Image
                    </span>
                  </div>
                  {/* Uploading spinner */}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw
                          size={20}
                          className="animate-spin"
                          style={{ color: "var(--brand-1)" }}
                        />
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "var(--brand-1)" }}
                        >
                          Uploading...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  {uploadingImage ? (
                    <>
                      <RefreshCw
                        size={24}
                        className="animate-spin mb-3"
                        style={{ color: "var(--brand-1)" }}
                      />
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--brand-1)" }}
                      >
                        Uploading image...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center mb-3">
                        <Image size={20} className="text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">
                        Click to upload product image
                      </p>
                      <p className="text-gray-400 text-xs">
                        PNG, JPG or WEBP · Max 5MB
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={imageRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />

            {/* Upload button if image already set */}
            {imagePreview && !uploadingImage && (
              <button
                onClick={() => imageRef.current?.click()}
                className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                <Upload size={12} />
                Replace image
              </button>
            )}
          </div>

          {/* ── NAME ─────────────────────────────────── */}
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

          {/* ── GENDER + CATEGORY ────────────────────── */}
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

          {/* ── TAG ──────────────────────────────────── */}
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

          {/* ── DESCRIPTION ──────────────────────────── */}
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

          {/* ── PRICE + SALE PRICE ───────────────────── */}
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
              {discountPercent && (
                <p className="text-green-600 text-xs mt-1 font-medium">
                  {discountPercent}% off · Save ₦
                  {(
                    Number(form.price) - Number(form.sale_price)
                  ).toLocaleString("en-NG")}
                </p>
              )}
            </div>
          </div>

          {/* ── SIZES ────────────────────────────────── */}
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

          {/* ── COLORS ───────────────────────────────── */}
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
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* ── TOGGLES ──────────────────────────────── */}
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
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-gray-900 text-xs font-semibold truncate">
                    {toggle.label}
                  </p>
                  <p className="text-gray-400 text-xs truncate">{toggle.sub}</p>
                </div>
                <button
                  onClick={() => handleChange(toggle.key, !form[toggle.key])}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${
                    form[toggle.key] ? toggle.activeColor : "bg-gray-300"
                  }`}
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
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-500 hover:text-gray-900 text-sm font-medium py-3.5 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploadingImage}
            className="flex-1 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--brand-1)" }}
          >
            {uploadingImage
              ? "Uploading..."
              : product
              ? "Save Changes"
              : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProductModal;