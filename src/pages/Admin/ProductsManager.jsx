import { useState } from "react";
import { Plus, Pencil, Trash2, Flame } from "lucide-react";
import Badge from "../../components/Badge";
import AddEditProductModal from "./AddEditProductModal";
import { products as initialProducts } from "../../data/products";

const ProductsManager = () => {
  const [productList, setProductList] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
        p.id === id ? { ...p, hotDeal: !p.hotDeal } : p
      )
    );
  };

  const handleToggleStock = (id) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, inStock: !p.inStock } : p
      )
    );
  };

  const handleSave = (product) => {
    if (editingProduct) {
      // Edit existing
      setProductList((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
    } else {
      // Add new
      setProductList((prev) => [
        { ...product, id: String(Date.now()) },
        ...prev,
      ]);
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-lg">Products</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            {productList.length} total products
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A2E] border border-purple-900/20 rounded-2xl overflow-hidden">

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_100px_90px_90px_90px_80px] gap-4 px-5 py-3 bg-[#0F0F1A] border-b border-purple-900/20">
          {["Product", "Category", "Status", "Hot Deal", "Stock", "Actions"].map(
            (col) => (
              <span
                key={col}
                className="text-gray-500 text-xs font-semibold uppercase tracking-wider"
              >
                {col}
              </span>
            )
          )}
        </div>

        {/* Rows */}
        {productList.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl mb-3 block">📦</span>
            <p className="text-gray-400 text-sm">No products yet.</p>
          </div>
        ) : (
          productList.map((product, index) => (
            <div
              key={product.id}
              className={`grid grid-cols-[1fr_100px_90px_90px_90px_80px] gap-4 px-5 py-4 items-center transition-colors duration-150 hover:bg-white/[0.02] ${
                index !== productList.length - 1
                  ? "border-b border-purple-900/10"
                  : ""
              }`}
            >
              {/* Product */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#0F0F1A]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {product.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {product.gender}
                  </p>
                </div>
              </div>

              {/* Category */}
              <span className="text-gray-400 text-xs capitalize">
                {product.category}
              </span>

              {/* Status */}
              <span>
                <Badge type={product.inStock ? "inStock" : "inactive"} />
              </span>

              {/* Hot Deal */}
              <span>
                {product.hotDeal ? (
                  <Badge type="hotDeal" />
                ) : (
                  <span className="text-gray-600 text-xs">—</span>
                )}
              </span>

              {/* Stock Toggle */}
              <button
                onClick={() => handleToggleStock(product.id)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                  product.inStock ? "bg-green-600" : "bg-gray-600"
                }`}
                aria-label="Toggle stock"
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    product.inStock ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleHotDeal(product.id)}
                  className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    product.hotDeal
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-gray-500 hover:text-amber-400 hover:bg-amber-500/10"
                  }`}
                  aria-label="Toggle hot deal"
                  title="Toggle hot deal"
                >
                  <Flame size={15} />
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-colors duration-200"
                  aria-label="Edit product"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(product.id)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                  aria-label="Delete product"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-[#1A1A2E] border border-red-500/20 rounded-2xl p-8 w-full max-w-sm text-center">
            <span className="text-4xl mb-4 block">🗑️</span>
            <h3 className="text-white font-bold text-lg mb-2">
              Delete Product?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              This action cannot be undone. The product will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-white/10 text-gray-400 hover:text-white text-sm font-medium py-3 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
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