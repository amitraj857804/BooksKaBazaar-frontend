import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, ShoppingBag, LogOut, 
  Edit3, Save, X, Shield, ChevronRight, Check, Loader2, BookOpen
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

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

  const [activeTab, setActiveTab] = useState("info"); // "info" | "address" | "orders"
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || user?.emailId || "");
  const [phone, setPhone] = useState(user?.phone || user?.phoneNumber || "");
  
  // Address states
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [stateName, setStateName] = useState(user?.state || "");
  const [pincode, setPincode] = useState(user?.pincode || "");

  // Update local inputs when user changes (e.g. after refresh/login)
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || user.emailId || "");
      setPhone(user.phone || user.phoneNumber || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      setStateName(user.state || "");
      setPincode(user.pincode || "");
    }
  }, [user]);

  if (!user) return null;

  const handleInfoSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    updateUser({
      fullName,
      email,
      phone,
    });

    setIsSaving(false);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    updateUser({
      address,
      city,
      state: stateName,
      pincode,
    });

    setIsSaving(false);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const mockOrders = [
    {
      id: "BKB-2026-9812",
      date: "May 28, 2026",
      status: "Delivered",
      total: 799,
      books: [
        { title: "The Alchemist", quantity: 1, price: 349 },
        { title: "React Design Patterns", quantity: 1, price: 450 }
      ],
      trackingId: "TRK981234567"
    },
    {
      id: "BKB-2026-4531",
      date: "June 02, 2026",
      status: "In Transit",
      total: 450,
      books: [
        { title: "Harry Potter & the Sorcerer's Stone", quantity: 1, price: 450 }
      ],
      trackingId: "TRK453198765"
    }
  ];

  // Helper to render user initials avatar
  const initials = fullName
    ? fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-6 uppercase tracking-wider">
          <span className="hover:text-[#E31E2E] cursor-pointer transition" onClick={() => navigate("/")}>Home</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-[#E31E2E]">My Profile</span>
        </div>

        {/* Success message banner */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-sm font-bold text-green-700 shadow-sm"
            >
              <div className="bg-green-500 text-white rounded-full p-1 shrink-0">
                <Check size={16} />
              </div>
              <span>Profile details updated successfully!</span>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 transition-all cursor-pointer"
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
                        <span>Edit Profile</span>
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
                </div>
              )}

              {/* Tab 2: Addresses */}
              {activeTab === "address" && (
                <div>
                  <div className="flex justify-between items-center pb-5 border-b border-gray-100 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Delivery Address</h3>
                      <p className="text-xs text-gray-500 mt-1">Manage your default shipping location details.</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-[#E31E2E] hover:text-white rounded-xl font-bold text-xs text-gray-700 transition cursor-pointer"
                      >
                        <Edit3 size={14} />
                        <span>Edit Address</span>
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleAddressSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Street Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                          <input
                            type="text"
                            required
                            placeholder="Apartment, building, street address"
                            disabled={!isEditing}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 font-semibold text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">City</label>
                        <input
                          type="text"
                          required
                          disabled={!isEditing}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 font-semibold text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">State</label>
                        <input
                          type="text"
                          required
                          disabled={!isEditing}
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 font-semibold text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pincode</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          disabled={!isEditing}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500 font-semibold text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                        />
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
                          <span>Save Address</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setAddress(user.address || "");
                            setCity(user.city || "");
                            setStateName(user.state || "");
                            setPincode(user.pincode || "");
                          }}
                          className="flex items-center justify-center gap-1.5 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition cursor-pointer"
                        >
                          <X size={16} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Tab 3: Orders */}
              {activeTab === "orders" && (
                <div>
                  <div className="pb-5 border-b border-gray-100 mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Order History</h3>
                    <p className="text-xs text-gray-500 mt-1">Review your recent purchases and check shipping progress.</p>
                  </div>

                  <div className="space-y-6">
                    {mockOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 bg-white"
                      >
                        {/* Order Card Header */}
                        <div className="bg-gray-50 px-5 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-gray-100">
                          <div className="flex gap-6">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order Placed</p>
                              <p className="text-xs font-bold text-gray-700 mt-0.5">{order.date}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                              <p className="text-xs font-bold text-gray-900 mt-0.5">₹{order.total}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                              <p className="text-xs font-bold text-slate-800 mt-0.5 select-all">{order.id}</p>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase ${
                            order.status === "Delivered"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="p-5 space-y-4">
                          {order.books.map((book, idx) => (
                            <div key={idx} className="flex justify-between items-center gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-13 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 text-gray-400">
                                  <BookOpen size={18} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900 leading-tight">{book.title}</p>
                                  <p className="text-xs font-semibold text-gray-500 mt-1">Qty: {book.quantity}</p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-gray-800">₹{book.price * book.quantity}</span>
                            </div>
                          ))}

                          {/* Order Footer Actions */}
                          <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold">
                            <span className="text-gray-500 select-all font-semibold">
                              Tracking ID: <span className="text-gray-700">{order.trackingId}</span>
                            </span>
                            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                              Track Shipments
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
