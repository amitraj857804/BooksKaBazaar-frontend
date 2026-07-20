import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, ShoppingBag, LogOut,
  Edit3, Save, X, Shield, ChevronRight, Check, Loader2, BookOpen,
  PackageCheck, Clock, Truck, XCircle, AlertCircle, Package
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AddressManager from "../components/profile/AddressManager";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../services/user/userApi";
import { checkoutApi } from "../services/user/checkoutApi";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logoutUser, updateUser, openAuthModal, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  
  // Fetch profile on mount to get the latest details from the server
  useEffect(() => {
    fetchUserProfile?.();
  }, []);

  // Guard the page: Redirect to "/" and open login modal if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
      openAuthModal("login");
    }
  }, [user, navigate, openAuthModal]);

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "info"); // "info" | "address" | "orders"

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [banner, setBanner] = useState(null); // null or { type: "success" | "error", message: string }
  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState(false);

  // Order history state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || user?.emailId || "");
  const [phone, setPhone] = useState(user?.phone || user?.phoneNumber || "");
  
  // Shipping addresses states
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    try {
      setAddressesLoading(true);
      const res = await userApi.getAddresses();
      let list = [];
      if (res && Array.isArray(res)) {
        list = res;
      } else if (res && res.success && Array.isArray(res.data)) {
        list = res.data;
      } else if (res && Array.isArray(res.data)) {
        list = res.data;
      } else if (res && res.addresses && Array.isArray(res.addresses)) {
        list = res.addresses;
      }
      setAddresses(list);
    } catch (err) {
      console.warn("⚠️ Failed to load addresses in profile page:", err.message);
    } finally {
      setAddressesLoading(false);
    }
  }, [user]);

  // Update local inputs when user changes (e.g. after refresh/login)
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || user.emailId || "");
      setPhone(user.phone || user.phoneNumber || "");
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === "info") {
      fetchAddresses();
    }
  }, [activeTab, fetchAddresses, user]);

  // Fetch real order history when the Orders tab becomes active
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await checkoutApi.getOrders();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setOrdersError(data.error || "Failed to load orders.");
      }
    } catch (err) {
      setOrdersError(err.response?.data?.error || err.message || "Failed to load orders.");
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab, fetchOrders]);

  if (!user) return null;

  const handleInfoSave = async (e) => {
    if (e) e.preventDefault();

    const isEmailChanged = email.toLowerCase() !== (user.email || user.emailId || "").toLowerCase();
    if (isEmailChanged && !showEmailConfirmModal) {
      setShowEmailConfirmModal(true);
      return;
    }

    setIsSaving(true);
    setBanner(null);
    setShowEmailConfirmModal(false);

    try {
      await updateUser({
        fullName,
        email,
        phone,
      });
      setIsEditing(false);
      if (isEmailChanged) {
        logoutUser();
        navigate("/");
        setTimeout(() => {
          openAuthModal("login");
        }, 100);
      } else {
        setBanner({ type: "success", message: "Profile details updated successfully!" });
        setTimeout(() => setBanner(null), 4000);
      }
    } catch (err) {
      console.error("Failed to save profile details:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to update profile";
      setBanner({ type: "error", message: errorMsg });
      setTimeout(() => setBanner(null), 6000);
    } finally {
      setIsSaving(false);
    }
  };

  // Status badge config
  const statusConfig = {
    PENDING:   { label: "Pending",    icon: Clock,        classes: "bg-amber-50 text-amber-700 border-amber-200" },
    PAID:      { label: "Paid",       icon: PackageCheck,  classes: "bg-blue-50 text-blue-700 border-blue-200" },
    SHIPPED:   { label: "Shipped",    icon: Truck,         classes: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    DELIVERED: { label: "Delivered",  icon: PackageCheck,  classes: "bg-green-50 text-green-700 border-green-200" },
    CANCELLED: { label: "Cancelled",  icon: XCircle,       classes: "bg-gray-50 text-gray-500 border-gray-200" },
    FAILED:    { label: "Failed",     icon: AlertCircle,   classes: "bg-red-50 text-red-700 border-red-200" },
  };

  // Helper to render user initials avatar
  const initials = fullName
    ? fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  const defaultAddress = addresses.find((addr) => addr.default === true);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow pb-12">
        <main className="px-6 sm:px-10 lg:px-28 mx-auto py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-6 uppercase tracking-wider">
          <span className="hover:text-[#E31E2E] cursor-pointer transition" onClick={() => navigate("/")}>Home</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-[#E31E2E]">My Profile</span>
        </div>

        {/* Status message banner */}
        <AnimatePresence>
          {banner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 border rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm ${
                banner.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <div className={`text-white rounded-full p-1 shrink-0 ${
                banner.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}>
                {banner.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
              </div>
              <span>{banner.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 text-center">
              {/* Initials Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-[#E31E2E]/10 border-2 border-[#E31E2E]/20 text-[#E31E2E] flex items-center justify-center text-3xl font-black uppercase select-none shadow-sm">
                  {initials}
                </div>
                <div className="absolute bottom-0 right-0 bg-[#E31E2E] text-white p-1.5 rounded-full border-2 border-white shadow-md">
                  <Shield size={14} />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 leading-tight truncate">{fullName || "Books Lover"}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Verified Member</p>
              
              {/* Sidebar Menu options */}
              <div className="mt-8 space-y-1.5 text-left">
                <button
                  onClick={() => { setActiveTab("info"); setIsEditing(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl font-bold text-sm transition-all ${
                    activeTab === "info"
                      ? "bg-[#E31E2E] text-white shadow-md shadow-[#E31E2E]/10"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <User size={18} />
                  <span>Personal Info</span>
                </button>
                <button
                  onClick={() => { setActiveTab("address"); setIsEditing(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold text-sm transition-all ${
                    activeTab === "address"
                      ? "bg-[#E31E2E] text-white shadow-md shadow-[#E31E2E]/10"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <MapPin size={18} />
                  <span>Delivery Addresses</span>
                </button>
                <button
                  onClick={() => { setActiveTab("orders"); setIsEditing(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-bold text-sm transition-all ${
                    activeTab === "orders"
                      ? "bg-[#E31E2E] text-white shadow-md shadow-[#E31E2E]/10"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <ShoppingBag size={18} />
                  <span>Order History</span>
                </button>
                
                <div className="h-px bg-gray-100 my-4" />
                
                <button
                  onClick={() => {
                    logoutUser();
                    navigate("/");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3  rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                  <span>Logout Account</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 min-h-[480px]">
              
              {/* Tab 1: Personal Info */}
              {activeTab === "info" && (
                <div>
                  <div className="flex justify-between items-center pb-5 border-b border-gray-100 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                      <p className="text-xs text-gray-500 mt-1">Manage your account details and contact information.</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-[#E31E2E] hover:text-white rounded-xl font-bold text-xs text-gray-700 transition cursor-pointer"
                      >
                        <Edit3 size={14} />
                        <span >Edit</span>
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleInfoSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                          <input
                            type="text"
                            required
                            disabled={!isEditing}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 font-semibold text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                          <input
                            type="email"
                            required
                            disabled={!isEditing}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 font-semibold text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                          <input
                            type="tel"
                            disabled={!isEditing}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 font-semibold text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E31E2E] hover:bg-[#E31E2E]/90 disabled:bg-gray-200 text-white rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                        >
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          <span>Save Changes</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFullName(user.fullName || "");
                            setEmail(user.email || user.emailId || "");
                            setPhone(user.phone || user.phoneNumber || "");
                          }}
                          className="flex items-center justify-center gap-1.5 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition cursor-pointer"
                        >
                          <X size={16} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </form>

                  {/* Default Address Section */}
                  <div className="mt-8 pt-6 border-t border-gray-100 font-sans">
                    <h4 className="text-xs font-bold text-gray-405 uppercase tracking-wider mb-3">Default Shipping Address</h4>
                    {addressesLoading ? (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Loader2 size={12} className="animate-spin text-[#E31E2E]" />
                        <span>Loading address...</span>
                      </div>
                    ) : defaultAddress ? (
                      <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-4 flex items-start gap-3.5 max-w-xl">
                        <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                          <MapPin size={16} className="text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-800">{defaultAddress.fullName}</span>
                            <span className="text-[9px] font-black text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded uppercase tracking-wide">
                              {defaultAddress.addressType || "HOME"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1.5 font-medium select-all leading-relaxed font-sans">
                            {defaultAddress.addressLine1}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 font-medium font-sans">
                            Phone: <span className="text-slate-700 font-bold select-all">{defaultAddress.phoneNumber}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-450 flex items-center gap-2 font-medium">
                        <span>No default shipping address set.</span>
                        <button
                          type="button"
                          onClick={() => setActiveTab("address")}
                          className="text-[#E31E2E] hover:underline font-bold cursor-pointer bg-transparent border-none p-0 inline font-sans text-xs"
                        >
                          Manage Addresses &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Addresses */}
              {activeTab === "address" && (
                <AddressManager />
              )}

              {/* Tab 3: Orders */}
              {activeTab === "orders" && (
                <div>
                  <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Order History</h3>
                      <p className="text-xs text-gray-500 mt-1">All your purchases from BooksKaBazaar.</p>
                    </div>
                    <button
                      onClick={fetchOrders}
                      disabled={ordersLoading}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xs text-gray-600 transition cursor-pointer disabled:opacity-50"
                    >
                      {ordersLoading ? <Loader2 size={13} className="animate-spin" /> : <Package size={13} />}
                      Refresh
                    </button>
                  </div>

                  {/* Loading skeleton */}
                  {ordersLoading && (
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
                          <div className="bg-gray-50 px-5 py-4 h-16" />
                          <div className="p-5 space-y-3">
                            <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                            <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error state */}
                  {!ordersLoading && ordersError && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <AlertCircle size={40} className="text-red-300 mb-3" />
                      <p className="text-sm font-bold text-gray-600">Failed to load orders</p>
                      <p className="text-xs text-gray-400 mt-1 mb-4">{ordersError}</p>
                      <button onClick={fetchOrders} className="px-4 py-2 bg-[#E31E2E] text-white rounded-xl font-bold text-xs hover:bg-red-700 transition cursor-pointer">
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* Empty state */}
                  {!ordersLoading && !ordersError && orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag size={28} className="text-gray-300" />
                      </div>
                      <p className="text-sm font-bold text-gray-600">No orders yet</p>
                      <p className="text-xs text-gray-400 mt-1">Your completed orders will appear here.</p>
                    </div>
                  )}

                  {/* Real order cards */}
                  {!ordersLoading && !ordersError && orders.length > 0 && (
                    <div className="space-y-5">
                      {orders.map((order) => {
                        const cfg = statusConfig[order.status] || statusConfig.PENDING;
                        const StatusIcon = cfg.icon;
                        const orderDate = order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—";

                        return (
                           <motion.div
                            key={order.orderId}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 bg-white"
                          >
                            {/* Order Card Header */}
                            <div className="bg-gray-50 px-5 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-gray-100">
                              <div className="flex flex-wrap gap-5">
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order Placed</p>
                                  <p className="text-xs font-bold text-gray-700 mt-0.5">{orderDate}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                                  <p className="text-xs font-bold text-gray-900 mt-0.5">₹{parseFloat(order.totalAmount).toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                                  <p className="text-xs font-bold text-slate-800 mt-0.5 select-all">BKB-{order.orderId}</p>
                                </div>
                              </div>

                              {/* Status badge */}
                              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase border ${cfg.classes}`}>
                                <StatusIcon size={11} />
                                {cfg.label}
                              </span>
                            </div>

                            {/* Order Items */}
                            <div className="p-5 space-y-3.5">
                              {(order.items || []).map((item) => (
                                <div key={item.orderItemId} className="flex items-center gap-4">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.bookTitle}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=80&h=100&fit=crop"; }}
                                    className="w-10 h-14 object-cover rounded-lg shadow-sm shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate leading-tight">{item.bookTitle}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">by {item.authorName}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} × ₹{parseFloat(item.priceAtPurchase).toFixed(2)}</p>
                                  </div>
                                  <span className="text-sm font-black text-gray-800 shrink-0">
                                    ₹{parseFloat(item.subTotal).toFixed(2)}
                                  </span>
                                </div>
                              ))}

                              {/* Footer */}
                              <div className="pt-3.5 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs text-gray-400 font-semibold">
                                  {order.paymentId ? (
                                    <>Payment ID: <span className="text-gray-600 select-all">{order.paymentId}</span></>
                                  ) : (
                                    <span className="text-amber-600">Payment pending</span>
                                  )}
                                </span>
                                <span className="text-xs font-bold text-gray-500">
                                  {order.city && `${order.city}, ${order.state}`}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
      {/* Email Change Confirmation Modal */}
      <AnimatePresence>
        {showEmailConfirmModal && (
          <motion.div
            key="email-confirm-backdrop"
            className="fixed inset-0 z-[9999] backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEmailConfirmModal(false)}
          >
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={24} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">Change Email Address?</h3>
                <p className="text-sm text-gray-500 mb-6">
                  For security reasons, changing your email to <strong className="text-gray-900">{email}</strong> will invalidate your current session. You will be logged out and must sign in again using your new email address.
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleInfoSave()}
                    className="flex-1 py-3 bg-[#E31E2E] hover:bg-[#E31E2E]/90 text-white rounded-xl font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    Yes, Update & Logout
                  </button>
                  <button
                    onClick={() => {
                      setShowEmailConfirmModal(false);
                      // Restore original email
                      setEmail(user.email || user.emailId || "");
                    }}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
