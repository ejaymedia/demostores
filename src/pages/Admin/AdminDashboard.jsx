import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSite } from "../../context/SiteContext";
import ProductsManager from "./ProductsManager";
import SiteSettings from "./SiteSettings";
import { products } from "../../data/products";

const tabs = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { id: "products", label: "Products", icon: <Package size={16} /> },
  { id: "categories", label: "Categories", icon: <Tag size={16} /> },
  { id: "settings", label: "Site Settings", icon: <Settings size={16} /> },
];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { siteSettings } = useSite();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      color: "var(--brand-1)",
    },
    {
      label: "Men's Items",
      value: products.filter((p) => p.gender === "men").length,
      color: "var(--brand-1)",
    },
    {
      label: "Women's Items",
      value: products.filter((p) => p.gender === "women").length,
      color: "var(--brand-2)",
    },
    {
      label: "Kids' Items",
      value: products.filter((p) => p.gender === "kids").length,
      color: "var(--brand-2)",
    },
    {
      label: "Hot Deals",
      value: products.filter((p) => p.is_hot_deal).length,
      color: "#d97706",
    },
    {
      label: "New Arrivals",
      value: products.filter((p) => p.is_new_arrival).length,
      color: "#16a34a",
    },
    {
      label: "On Sale",
      value: products.filter((p) => p.sale_price).length,
      color: "#dc2626",
    },
    {
      label: "Out of Stock",
      value: products.filter((p) => !p.in_stock).length,
      color: "#64748b",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex overflow-hidden">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img
              src={siteSettings.logo_url}
              alt={siteSettings.business_name}
              className="h-7 w-7 object-contain shrink-0"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div className="min-w-0">
              <p
                className="text-xs font-black leading-none truncate"
                style={{ color: "var(--brand-1)" }}
              >
                {siteSettings.business_name}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">Admin</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-700 transition-colors shrink-0 ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
              style={
                activeTab === tab.id
                  ? { background: "var(--brand-1)" }
                  : {}
              }
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-56">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-gray-900 font-bold text-sm sm:text-base capitalize">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-700 text-xs font-medium transition-colors duration-200 whitespace-nowrap"
          >
            ← View Site
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 overflow-x-hidden">

          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-100 rounded-2xl p-4 text-center"
                  >
                    <div
                      className="text-2xl sm:text-3xl font-black mb-1"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-xs leading-snug">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <h2 className="text-gray-900 font-bold text-xs uppercase tracking-widest mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tabs
                  .filter((t) => t.id !== "overview")
                  .map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white shrink-0"
                        style={{ background: "var(--brand-1)" }}
                      >
                        {tab.icon}
                      </div>
                      <p className="text-gray-900 text-sm font-semibold mb-1">
                        {tab.label}
                      </p>
                      <p className="text-gray-400 text-xs leading-snug">
                        {tab.id === "products" && "Add, edit or remove products"}
                        {tab.id === "categories" && "View product categories"}
                        {tab.id === "settings" && "Edit site settings & branding"}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === "products" && <ProductsManager />}

          {/* Categories */}
          {activeTab === "categories" && (
            <div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                These are the current product categories. Full category
                management will be available once Supabase is connected.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Clothing", emoji: "👔" },
                  { label: "Shoes", emoji: "👟" },
                  { label: "Bags", emoji: "👜" },
                  { label: "Accessories", emoji: "🧢" },
                ].map((cat) => (
                  <div
                    key={cat.label}
                    className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{
                        background: "var(--brand-1)",
                        opacity: 0.1,
                      }}
                    >
                      <span style={{ opacity: 10 }}>{cat.emoji}</span>
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">
                        {cat.label}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {
                          products.filter(
                            (p) => p.category === cat.label.toLowerCase()
                          ).length
                        }{" "}
                        products
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Site Settings */}
          {activeTab === "settings" && <SiteSettings />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;