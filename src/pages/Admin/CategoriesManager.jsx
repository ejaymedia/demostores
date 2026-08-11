import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, RefreshCw } from "lucide-react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../supabaseService";

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addError, setAddError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editError, setEditError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setAddError("Category name is required.");
      return;
    }
    if (
      categories.some(
        (c) => c.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setAddError("This category already exists.");
      return;
    }
    setSaving(true);
    setAddError("");
    const data = await addCategory(trimmed);
    if (data) {
      setCategories((prev) => [...prev, data].sort((a, b) =>
        a.name.localeCompare(b.name)
      ));
      setNewCategoryName("");
    } else {
      setAddError("Failed to add category. Please try again.");
    }
    setSaving(false);
  };

  const handleAddKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditError("");
  };

  const handleUpdate = async (id) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      setEditError("Category name cannot be empty.");
      return;
    }
    if (
      categories.some(
        (c) =>
          c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== id
      )
    ) {
      setEditError("This category name already exists.");
      return;
    }
    setSaving(true);
    setEditError("");
    const data = await updateCategory(id, trimmed);
    if (data) {
      setCategories((prev) =>
        prev
          .map((c) => (c.id === id ? data : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingId(null);
      setEditingName("");
    } else {
      setEditError("Failed to update. Please try again.");
    }
    setSaving(false);
  };

  const handleUpdateKeyDown = (e, id) => {
    if (e.key === "Enter") handleUpdate(id);
    if (e.key === "Escape") cancelEdit();
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    const success = await deleteCategory(id);
    if (success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
    setDeleteConfirm(null);
    setDeleting(false);
  };

  return (
    <div className="max-w-lg">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-base">Categories</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {categories.length} categories · used as product sub-filters
          </p>
        </div>
        <button
          onClick={fetchCategories}
          disabled={loading}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* Add New Category */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5">
        <p className="text-gray-900 text-sm font-bold mb-3">
          Add New Category
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value);
              setAddError("");
            }}
            onKeyDown={handleAddKeyDown}
            placeholder="e.g. Sportswear, Swimwear..."
            className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 px-4 py-3 rounded-xl outline-none focus:border-gray-400 transition-colors duration-200"
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            style={{ background: "var(--brand-1)" }}
          >
            {saving ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : (
              <Plus size={15} />
            )}
            Add
          </button>
        </div>
        {addError && (
          <p className="text-red-500 text-xs mt-2">{addError}</p>
        )}
      </div>

      {/* Categories List */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-5 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl mb-3 block">🏷️</span>
            <p className="text-gray-400 text-sm">
              No categories yet. Add one above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors duration-150"
              >
                {/* Index number */}
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: "var(--brand-1)" }}
                >
                  {index + 1}
                </span>

                {/* Name — editable or static */}
                {editingId === category.id ? (
                  <div className="flex-1 flex flex-col gap-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => {
                        setEditingName(e.target.value);
                        setEditError("");
                      }}
                      onKeyDown={(e) => handleUpdateKeyDown(e, category.id)}
                      autoFocus
                      className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm px-3 py-2 rounded-lg outline-none focus:border-gray-500 transition-colors duration-200"
                    />
                    {editError && (
                      <p className="text-red-500 text-xs">{editError}</p>
                    )}
                  </div>
                ) : (
                  <span className="flex-1 text-gray-900 text-sm font-medium">
                    {category.name}
                  </span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {editingId === category.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(category.id)}
                        disabled={saving}
                        className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors duration-200 disabled:opacity-50"
                        title="Save"
                      >
                        {saving ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      <p className="text-gray-400 text-xs mt-4 leading-relaxed">
        💡 Categories are used as sub-filters in the shop page. Deleting a
        category won't remove existing products — they'll just lose their
        category filter match.
      </p>

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
              Delete Category?
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              <span className="font-semibold text-gray-700">
                {categories.find((c) => c.id === deleteConfirm)?.name}
              </span>{" "}
              will be permanently removed.
            </p>
            <p className="text-gray-400 text-xs mb-8">
              Existing products won't be deleted — they'll just no longer
              match this category filter.
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
    </div>
  );
};

export default CategoriesManager;