import { useState, useEffect, useRef } from "react";
import { X, Plus, Minus, Upload, RefreshCw, Image, Trash2, GripVertical, Play } from "lucide-react";
import { uploadFile, getCategories, addProduct, updateProduct } from "../../supabaseService";

const genderOptions = ["men", "women", "kids"];

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
  media: [],
};

const AddEditProductModal = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [colorInput, setColorInput] = useState("");
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const mediaInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        price: product.price?.toString() || "",
        sale_price: product.sale_price?.toString() || "",
        media: product.media || [],
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGenderChange = (value) => {
    setForm((prev) => ({ ...prev, gender: value, sizes: [] }));
  };

  const handleCategoryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      category: value,
      tag: value.charAt(0).toUpperCase() + value.slice(1),
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

  // ── MEDIA UPLOAD ──────────────────────────────────────

  const handleMediaUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setErrors((prev) => ({ ...prev, media: "" }));

    const newMedia = [];

    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      const tempItem = {
        url: localUrl,
        type: isVideo ? "video" : "image",
        order: form.media.length + newMedia.length,
        uploading: true,
      };
      newMedia.push(tempItem);
    }

    // Add temp items to form for immediate preview
    setForm((prev) => ({
      ...prev,
      media: [...prev.media, ...newMedia],
    }));

    // Upload each file
    const uploadedItems = [];
    for (let i = 0; i < Array.from(files).length; i++) {
      const file = Array.from(files)[i];
      const isVideo = file.type.startsWith("video/");
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const url = await uploadFile("product-media", path, file);
      uploadedItems.push({
        url: url || URL.createObjectURL(file),
        type: isVideo ? "video" : "image",
        order: form.media.length + i,
        uploading: false,
      });
    }

    // Replace temp items with uploaded items
    setForm((prev) => {
      const withoutTemp = prev.media.filter((m) => !m.uploading);
      return {
        ...prev,
        media: [...withoutTemp, ...uploadedItems],
      };
    });

    setUploading(false);
  };

  const handleRemoveMedia = (index) => {
    setForm((prev) => {
      const updated = prev.media
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, order: i }));
      return { ...prev, media: updated };
    });
  };

  // ── DRAG TO REORDER ───────────────────────────────────

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    setForm((prev) => {
      const updated = [...prev.media];
      const dragged = updated[dragIndex];
      updated.splice(dragIndex, 1);
      updated.splice(index, 0, dragged);
      return {
        ...prev,
        media: updated.map((item, i) => ({ ...item, order: i })),
      };
    });
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  // ── VALIDATION ────────────────────────────────────────

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
    if (form.media.filter((m) => !m.uploading).length === 0)
      newErrors.media = "Please upload at least one image or video.";
    if (form.sizes.length === 0)
      newErrors.sizes = "Select at least one size.";
    if (form.colors.length === 0)
      newErrors.colors = "Add at least one colour.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── SAVE ──────────────────────────────────────────────

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      media: form.media
        .filter((m) => !m.uploading)
        .map((m, i) => ({ url: m.url, type: m.type, order: i })),
      // Set image_url to first image for backwards compatibility
      image_url:
        form.media.find((m) => m.type === "image" && !m.uploading)?.url ||
        "",
    };

    let result;
    if (product) {
      result = await updateProduct(product.id, payload);
    } else {
      result = await addProduct(payload);
    }

    if (result) {
      onSave(result);
    } else {
      setErrors((prev) => ({
        ...prev,
        general: "Failed to save product. Please try again.",
      }));
    }

    setSaving(false);
  };

  const currentSizes =
    sizePresets[form.category]?.[form.gender] || ["One Size"];

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

  const inputClass =
    "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 px-4 py-3 rounded-xl outline-none focus:border-gray-400 transition-colors duration-200";
  const labelClass =
    "text-gray-500 text-xs font-bold uppercase tracking-widest block mb-2";

  const allCategories =
    categories.length > 0
      ? categories.map((c) => c.name.toLowerCase())
      : ["clothing", "shoes", "bags", "accessories"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-gray-900 font-bold text-base">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors duration-200 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* General error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {errors.general}
            </div>
          )}

          {/* ── MEDIA UPLOAD ─────────────────────────── */}
          <div>
            <label className={labelClass}>
              Images & Videos *{" "}
              {errors.media && (
                <span className="text-red-500 normal-case font-normal ml-1">
                  {errors.media}
                </span>
              )}
            </label>

            {/* Media Grid */}
            {form.media.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {form.media.map((item, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                      dragIndex === index
                        ? "border-blue-400 opacity-50 scale-95"
                        : "border-gray-200 hover:border-gray-400"
                    } ${index === 0 ? "ring-2 ring-offset-1" : ""}`}
                    style={
                      index === 0
                        ? { ringColor: "var(--brand-1)" }
                        : {}
                    }
                  >
                    {/* Media preview */}
                    {item.type === "video" ? (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Play
                          size={20}
                          className="text-gray-500"
                          fill="currentColor"
                        />
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Uploading overlay */}
                    {item.uploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <RefreshCw
                          size={16}
                          className="animate-spin"
                          style={{ color: "var(--brand-1)" }}
                        />
                      </div>
                    )}

                    {/* Cover label */}
                    {index === 0 && (
                      <div
                        className="absolute bottom-0 left-0 right-0 py-0.5 text-center text-white text-xs font-bold"
                        style={{ background: "var(--brand-1)" }}
                      >
                        Cover
                      </div>
                    )}

                    {/* Drag handle + Delete — on hover */}
                    {!item.uploading && (
                      <>
                        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/50 rounded-md p-0.5">
                            <GripVertical size={12} className="text-white" />
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveMedia(index)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-md p-0.5"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload area */}
            <div
              onClick={() => !uploading && mediaInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
                errors.media
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw
                    size={20}
                    className="animate-spin"
                    style={{ color: "var(--brand-1)" }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--brand-1)" }}
                  >
                    Uploading media...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                    <Upload size={18} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Click to upload images or videos
                  </p>
                  <p className="text-gray-400 text-xs">
                    PNG, JPG, WEBP, MP4 · Multiple files allowed
                  </p>
                  <p className="text-gray-400 text-xs">
                    Drag thumbnails above to reorder · First item = cover
                  </p>
                </div>
              )}
            </div>

            <input
              ref={mediaInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
              multiple
              className="hidden"
              onChange={(e) => handleMediaUpload(e.target.files)}
            />
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
                {allCategories.map((c) => (
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
              {allCategories.map((cat) => {
                const tag =
                  cat.charAt(0).toUpperCase() + cat.slice(1);
                return (
                  <button
                    key={cat}
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
                );
              })}
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
              <p className="text-red-500 text-xs mt-1">
                {errors.description}
              </p>
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
                onChange={(e) =>
                  handleChange("sale_price", e.target.value)
                }
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
                  <p className="text-gray-400 text-xs truncate">
                    {toggle.sub}
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleChange(toggle.key, !form[toggle.key])
                  }
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${
                    form[toggle.key] ? toggle.activeColor : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      form[toggle.key]
                        ? "translate-x-5"
                        : "translate-x-0.5"
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
            disabled={saving || uploading}
            className="flex-1 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            style={{ background: "var(--brand-1)" }}
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Saving...
              </>
            ) : uploading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Uploading...
              </>
            ) : product ? (
              "Save Changes"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProductModal;