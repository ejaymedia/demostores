import { useState } from "react";
import { Plus, Pencil, Trash2, Flame, Star } from "lucide-react";
import Badge from "../../components/Badge";
import AddEditProductModal from "./AddEditProductModal";
import { products as initialProducts } from "../../data/products";

const ProductsManager = () => {
  const [productList, setProductList] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeGender, setActiveGender] = useState("all");

  const genderTabs = [
    { id: "all", label: "All" },
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
  ];

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-lg">Products</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {filtered.length} of {productList.length} products
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
          style={{ background: "var(--brand-1)" }}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Gender Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-1">
        {genderTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveGender(tab.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-200 border-b-2 -mb-px ${
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

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-[1fr_80px_80px_90px_80px_70px_70px_80px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
          {[
            "Product",
            "Gender",
            "Category",
            "Price",
            "Sale Price",
            "Hot",
            "New",
            "Actions",
          ].map((col) => (
            <span
              key={col}
              className="text-gray-400 text-xs font-bold uppercase tracking-wider"
            >
              {col}
            </span>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl mb-3 block">📦</span>
            <p className="text-gray-400 text-sm">No products yet.</p>
          </div>
        ) : (
          filtered.map((product, index) => (
            <div
              key={product.id}
              className={`flex flex-col lg:grid lg:grid-cols-[1fr_80px_80px_90px_80px_70px_70px_80px] gap-3 px-5 py-4 transition-colors duration-150 hover:bg-gray-50 ${
                index !== filtered.length - 1
                  ? "border-b border-gray-50"
                  : ""
              }`}
            >
              {/* Product */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-900 text-sm font-semibold truncate">
                    {product.name}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {product.in_stock ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-center lg:block">
                <span className="lg:hidden text-gray-400 text-xs w-20 shrink-0">Gender:</span>
                <span className="text-gray-500 text-xs capitalize">
                  {product.gender}
                </span>
              </div>

              {/* Category */}
              <div className="flex items-center lg:block">
                <span className="lg:hidden text-gray-400 text-xs w-20 shrink-0">Category:</span>
                <span className="text-gray-500 text-xs capitalize">
                  {product.category}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center lg:block">
                <span className="lg:hidden text-gray-400 text-xs w-20 shrink-0">Price:</span>
                <span className="text-gray-900 text-xs font-semibold">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Sale Price */}
              <div className="flex items-center lg:block">
                <span className="lg:hidden text-gray-400 text-xs w-20 shrink-0">Sale:</span>
                {product.sale_price ? (
                  <span className="text-red-500 text-xs font-semibold">
                    {formatPrice(product.sale_price)}
                  </span>
                ) : (
                  <span className="text-gray-300 text-xs">—</span>
                )}
              </div>

              {/* Hot Deal Toggle */}
              <div className="flex items-center lg:block">
                <span className="lg:hidden text-gray-400 text-xs w-20 shrink-0">Hot Deal:</span>
                <button
                  onClick={() => handleToggleHotDeal(product.id)}
                  className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    product.is_hot_deal
                      ? "text-amber-500 bg-amber-50"
                      : "text-gray-300 hover:text-amber-400 hover:bg-amber-50"
                  }`}
                  aria-label="Toggle hot deal"
                  title="Toggle hot deal"
                >
                  <Flame size={15} />
                </button>
              </div>

              {/* New Arrival Toggle */}
              <div className="flex items-center lg:block">
                <span className="lg:hidden text-gray-400 text-xs w-20 shrink-0">New Arrival:</span>
                <button
                  onClick={() => handleToggleNewArrival(product.id)}
                  className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    product.is_new_arrival
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-300 hover:text-blue-400 hover:bg-blue-50"
                  }`}
                  aria-label="Toggle new arrival"
                  title="Toggle new arrival"
                >
                  <Star size={15} />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Stock toggle */}
                <button
                  onClick={() => handleToggleStock(product.id)}
                  className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${
                    product.in_stock ? "bg-green-500" : "bg-gray-300"
                  }`}
                  aria-label="Toggle stock"
                  title="Toggle stock"
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      product.in_stock ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                  aria-label="Edit"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(product.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                  aria-label="Delete"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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