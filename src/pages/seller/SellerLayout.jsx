import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Package,
  Wallet,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/seller/dashboard" },
  { name: "Inventory",  icon: BookOpen,        path: "/seller/inventory" },
  { name: "Orders",     icon: Package,          path: "/seller/orders",   badge: 12 },
  { name: "Payouts",    icon: Wallet,           path: "/seller/payouts" },
  { name: "Messages",   icon: MessageSquare,    path: "/seller/messages", badge: 4  },
  { name: "Reports",    icon: BarChart2,        path: "/seller/reports" },
  { name: "Settings",   icon: Settings,         path: "/seller/settings" },
];

const SellerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/seller");
  };

  const adminData  = JSON.parse(localStorage.getItem("adminData") || "{}");
  const sellerName = adminData.sellerName || "Seller";
  const sellerStore= adminData.storeName  || "Books Corner";
  const initials   = sellerName.substring(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ══════ SIDEBAR ══════ */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed lg:relative z-40 h-screen w-[200px] shrink-0 bg-white border-r border-gray-100 flex flex-col shadow-sm"
          >
            {/* Logo */}
            <div
              className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 cursor-pointer select-none"
              onClick={() => navigate("/seller")}
            >
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xs tracking-tight">BKB</span>
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 leading-none">BOOKS KA</p>
                <p className="text-[10px] font-bold text-red-600 tracking-widest leading-none mt-0.5">BAZAAR</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              {NAV_LINKS.map((link) => {
                const Icon   = link.icon;
                const active = isActive(link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() => { navigate(link.path); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                      active
                        ? "bg-red-50 text-red-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-red-50 rounded-xl"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon size={18} className={`relative z-10 shrink-0 ${active ? "text-red-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                    <span className="relative z-10 flex-1 text-left">{link.name}</span>
                    {link.badge && (
                      <span className="relative z-10 text-[10px] font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Grow your store promo */}
            <div className="mx-3 mb-3 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 p-4 text-center">
              <div className="text-2xl mb-1">📚</div>
              <p className="text-xs font-bold text-gray-800">Grow your store</p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">Add more books and get discovered by more buyers.</p>
              <button
                onClick={() => navigate("/seller/inventory")}
                className="mt-3 w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                + Add New Book
              </button>
            </div>

            {/* Help */}
            <div className="px-5 py-3 border-t border-gray-100">
              <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <span>Need help? Visit Help Center →</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ══════ MAIN AREA ══════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-14 bg-white border-b border-gray-100 shrink-0 flex items-center px-4 gap-4 z-20">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 cursor-pointer"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1" />

          {/* Bell */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User chip */}
          <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">{initials}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-none">{sellerName}</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">{sellerStore}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
