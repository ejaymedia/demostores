import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Tag,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ProductsManager from "./ProductsManager";
import EnquiriesManager from "./EnquiriesManager";
import { products } from "../../data/products";

const tabs = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { id: "products", label: "Products", icon: <Package size={16} /> },
  { id: "enquiries", label: "Enquiries", icon: <MessageSquare size={16} /> },
  { id: "categories", label: "Categories", icon: <Tag size={16} /> },
];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

  const hotDeals = products.filter((p) => p.hotDeal).length;
  const inStock = products.filter((p) => p.inStock).length;

  const stats = [
    { label: "Total Products", value: products.length, color: "text-purple-400" },
    { label: "Hot Deals", value: hotDeals, color: "text-amber-400" },
    { label: "In Stock", value: inStock, color: "text-green-400" },
    { label: "Categories", value: 6, color: "text-pink-400" },
  ];

  return (
    <div className="bg-[#0F0F1A] min-h-screen flex">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0A0A15] border-r border-purple-900/20 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Sidebar Header */}
        <div className="px-6 py-6 border-b border-purple-900/20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}logo/logo.png`}
              alt="Bovic Collections"
              className="h-8 w-auto object-contain"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div>
              <p className="text-white text-xs font-bold leading-none">
                Bovic Collections
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-purple-700/20 text-white border border-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-purple-900/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">

        {/* Top Bar */}
        <header className="bg-[#0A0A15] border-b border-purple-900/20 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-white font-bold text-lg capitalize">
              {activeTab}
            </h1>
          </div>
          <Link
            to="/"
            className="text-gray-400 hover:text-white text-xs font-medium transition-colors duration-200"
          >
            ← View Site
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 md:px-10 py-8">

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-[#1A1A2E] border border-purple-900/20 rounded-2xl p-6 text-center"
                  >
                    <div className={`text-3xl font-black mb-1 ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="mb-6">
                <h2 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("products")}
                    className="bg-[#1A1A2E] border border-purple-900/20 hover:border-purple-500/40 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Package size={20} className="text-purple-400 mb-3" />
                    <p className="text-white text-sm font-semibold mb-1">
                      Manage Products
                    </p>
                    <p className="text-gray-500 text-xs">
                      Add, edit or remove products
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab("enquiries")}
                    className="bg-[#1A1A2E] border border-purple-900/20 hover:border-purple-500/40 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <MessageSquare size={20} className="text-purple-400 mb-3" />
                    <p className="text-white text-sm font-semibold mb-1">
                      View Enquiries
                    </p>
                    <p className="text-gray-500 text-xs">
                      Respond to customer enquiries
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab("categories")}
                    className="bg-[#1A1A2E] border border-purple-900/20 hover:border-purple-500/40 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Tag size={20} className="text-purple-400 mb-3" />
                    <p className="text-white text-sm font-semibold mb-1">
                      View Categories
                    </p>
                    <p className="text-gray-500 text-xs">
                      Browse all product categories
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && <ProductsManager />}

          {/* Enquiries Tab */}
          {activeTab === "enquiries" && <EnquiriesManager />}

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <div>
              <p className="text-gray-400 text-sm mb-6">
                These are the current product categories on the site. Category
                management will be available once the Supabase backend is
                connected.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Sneakers", "Unisex Wears", "Slides", "Hand & Shoulder Bags", "High Heels", "Beddings"].map(
                  (cat, index) => (
                    <div
                      key={index}
                      className="bg-[#1A1A2E] border border-purple-900/20 rounded-2xl p-5 flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-700/30 flex items-center justify-center">
                        <Tag size={16} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">
                          {cat}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {products.filter(
                            (p) =>
                              p.category ===
                              cat.toLowerCase().replace(/\s+/g, "").replace("hand&shoulderbags", "bags")
                          ).length}{" "}
                          products
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;