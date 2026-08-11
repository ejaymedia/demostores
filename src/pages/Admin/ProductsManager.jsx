import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Flame, Star, RefreshCw } from "lucide-react";
import AddEditProductModal from "./AddEditProductModal";
import {
  getProducts,
  deleteProduct,
  updateProduct,
} from "../../supabaseService";

const genderTabs = [
  { id: "all", label: "All" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
];

const ProductsManager = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeGender, setActiveGender] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProductList(data);
    setLoading(false);
  };

  const filtered =
    activeGender === "all"
      ? productList
      : productList.filter((p) => p.gender === activeGender);

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    const success = await deleteProduct(id);
    if (success) {
      setProductList((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleteConfirm(null);
    setDeleting(false);
  };

  const handleToggle = async (id, field, currentValue) => {
    setTogglingId(`${id}-${field}`);
    const updated = await updateProduct(id, { [field]: !currentValue });
    if (updated) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, [field]: !currentValue } : p
        )
      );
    }
    setTogglingId(null);
  };

  const handleSave = (updatedProduct) => {
    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );
    } else {
      setProductList((prev) => [updatedProduct, ...prev]);
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  const formatPrice = (amount) =>
    amount ? `₦${Number(amount).toLocaleString("en-NG")}` : "—";

  // Get first image from media array or fallback to image_url
  const getProductImage = (product) => {
    if (product.media && product.media.length > 0) {
      const sorted = [...product.media].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      const firstImage = sorted.find((m) => m.type === "image");
      return firstImage?.url || sorted[0]?.url || "";
    }
    return product.image_url || "";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-gray-900 font-bold text-base">Products</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {filtered.length} of {productList.length} products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
          </button>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shrink-0"
            style={{ background: "var(--brand-1)" }}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Gender Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-100 overflow-x-auto">
        {genderTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveGender(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all duration-200 border-b-2 -mb-px whitespace-nowrap ${
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

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center">
          <span className="text-4xl mb-3 block">📦</span>
          <p className="text-gray-400 text-sm mb-4">No products yet.</p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90"
            style={{ background: "var(--brand-1)" }}
          >
            <Plus size={15} />
            Add First Product
          </button>
        </div>
      )}

      {/* Product list */}
      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors duration-150"
            >
              <div className="flex items-start gap-3">

                {/* Image */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                  {getProductImage(product) ? (
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                      🛍️
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-gray-900 text-sm font-semibold truncate">
                        {product.name}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5 capitalize">
                        {product.gender} · {product.category}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() =>
                          handleToggle(
                            product.id,
                            "is_hot_deal",
                            product.is_hot_deal
                          )
                        }
                        disabled={
                          togglingId === `${product.id}-is_hot_deal`
                        }
                        className={`p-1.5 rounded-lg transition-colors duration-200 ${
                          product.is_hot_deal
                            ? "text-amber-500 bg-amber-50"
                            : "text-gray-300 hover:text-amber-400 hover:bg-amber-50"
                        } disabled:opacity-50`}
                        title="Toggle hot deal"
                      >
                        {togglingId === `${product.id}-is_hot_deal` ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Flame size={14} />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleToggle(
                            product.id,
                            "is_new_arrival",
                            product.is_new_arrival
                          )
                        }
                        disabled={
                          togglingId === `${product.id}-is_new_arrival`
                        }
                        className={`p-1.5 rounded-lg transition-colors duration-200 ${
                          product.is_new_arrival
                            ? "text-blue-500 bg-blue-50"
                            : "text-gray-300 hover:text-blue-400 hover:bg-blue-50"
                        } disabled:opacity-50`}
                        title="Toggle new arrival"
                      >
                        {togglingId ===
                        `${product.id}-is_new_arrival` ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Star size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-gray-900 text-xs font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {product.sale_price && (
                      <span className="text-red-500 text-xs font-semibold">
                        Sale: {formatPrice(product.sale_price)}
                      </span>
                    )}
                  </div>

                  {/* Status row */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Stock toggle */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          handleToggle(
                            product.id,
                            "in_stock",
                            product.in_stock
                          )
                        }
                        disabled={
                          togglingId === `${product.id}-in_stock`
                        }
                        className={`relative w-8 h-4 rounded-full transition-colors duration-200 shrink-0 disabled:opacity-50 ${
                          product.in_stock ? "bg-green-500" : "bg-gray-300"
                        }`}
                        title="Toggle stock"
                      >
                        {togglingId === `${product.id}-in_stock` ? (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw
                              size={10}
                              className="animate-spin text-white"
                            />
                          </span>
                        ) : (
                          <span
                            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${
                              product.in_stock
                                ? "translate-x-4"
                                : "translate-x-0.5"
                            }`}
                          />
                        )}
                      </button>
                      <span
                        className={`text-xs font-medium ${
                          product.in_stock
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    {product.is_hot_deal && (
                      <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                        🔥 Hot
                      </span>
                    )}
                    {product.is_new_arrival && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        🆕 New
                      </span>
                    )}
                    {product.sale_price && (
                      <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-medium">
                        🏷️ Sale
                      </span>
                    )}
                    {product.media && product.media.length > 0 && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                        📸 {product.media.length} media
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
            <span className="text-4xl mb-4 block">🗑️</span>
            <h3 className="text-gray-900 font-bold text-lg mb-2">
              Delete Product?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              This action cannot be undone. The product will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 border border-gray-200 text-gray-500 hover:text-gray-900 text-sm font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddEditProductModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductsManager;