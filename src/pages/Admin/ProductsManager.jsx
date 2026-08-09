import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Flame, Star, Upload, RefreshCw } from "lucide-react";
import AddEditProductModal from "./AddEditProductModal";
import { products as initialProducts } from "../../data/products";
import { uploadFile } from "../../supabaseService";

const genderTabs = [
  { id: "all", label: "All" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
];

const ProductsManager = () => {
  const [productList, setProductList] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeGender, setActiveGender] = useState("all");

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

  const handleDelete = (id) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const handleToggleHotDeal = (id) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_hot_deal: !p.is_hot_deal } : p
      )
    );
  };

  const handleToggleNewArrival = (id) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_new_arrival: !p.is_new_arrival } : p
      )
    );
  };

  const handleToggleStock = (id) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, in_stock: !p.in_stock } : p
      )
    );
  };

  const handleSave = (product) => {
    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
    } else {
      setProductList((prev) => [
        { ...product, id: String(Date.now()) },
        ...prev,
      ]);
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  const formatPrice = (amount) =>
    amount ? `₦${Number(amount).toLocaleString("en-NG")}` : "—";

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

      {/* Gender Filter Tabs */}
      <div className="flex gap-1 mb-5 border-b border-gray-100 pb-0 overflow-x-auto">
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
                ? { color: "var(--brand-1)", borderColor: "var(--brand-1)" }
                : {}
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center">
          <span className="text-4xl mb-3 block">📦</span>
          <p className="text-gray-400 text-sm">No products yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 transition-colors duration-150 hover:border-gray-200"
            >
              <div className="flex items-start gap-3">

                {/* Image */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
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
                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleHotDeal(product.id)}
                        className={`p-1.5 rounded-lg transition-colors duration-200 ${
                          product.is_hot_deal
                            ? "text-amber-500 bg-amber-50"
                            : "text-gray-300 hover:text-amber-400 hover:bg-amber-50"
                        }`}
                        title="Toggle hot deal"
                      >
                        <Flame size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleNewArrival(product.id)}
                        className={`p-1.5 rounded-lg transition-colors duration-200 ${
                          product.is_new_arrival
                            ? "text-blue-500 bg-blue-50"
                            : "text-gray-300 hover:text-blue-400 hover:bg-blue-50"
                        }`}
                        title="Toggle new arrival"
                      >
                        <Star size={14} />
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

                  {/* Price row */}
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

                  {/* Badges + Stock Toggle */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Stock toggle */}
                    <button
                      onClick={() => handleToggleStock(product.id)}
                      className={`relative w-8 h-4 rounded-full transition-colors duration-200 shrink-0 ${
                        product.in_stock ? "bg-green-500" : "bg-gray-300"
                      }`}
                      title="Toggle stock"
                    >
                      <span
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${
                          product.in_stock
                            ? "translate-x-4"
                            : "translate-x-0.5"
                        }`}
                      />
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
            onClick={() => setDeleteConfirm(null)}
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
                className="flex-1 border border-gray-200 text-gray-500 hover:text-gray-900 text-sm font-medium py-3 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Delete
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