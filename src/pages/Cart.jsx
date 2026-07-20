import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft,
  ChevronRight, Sparkles, Tag, ShieldCheck, CheckCircle,
  Loader2, MapPin, X, AlertCircle, CreditCard, Home, Briefcase, Compass, Check
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { clearCart } from "../store/cartSlice";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../services/user/userApi";
import { checkoutApi } from "../services/user/checkoutApi";
import toast from "react-hot-toast";

// ─── Address Modal (Multiple Shipping Address Selector) ──────────────────────────────────
const AddressModal = ({ user, onClose, onConfirm, isLoading }) => {
  const [addresses, setAddresses] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [isSavingNew, setIsSavingNew] = useState(false);

  // Form states for new address
  const [addressType, setAddressType] = useState("HOME");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setIsFetching(true);
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
      
      // Auto-select the default address, or the first one available
      if (list.length > 0) {
        const defaultAddr = list.find(a => a.isDefault === true || a.isDefault === "true");
        setSelectedAddress(defaultAddr || list[0]);
      }
    } catch (err) {
      console.warn("⚠️ Failed to load addresses in checkout modal:", err.message);
      toast.error("Failed to load saved addresses.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleOpenAddForm = () => {
    setFullName("");
    setPhoneNumber("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPincode("");
    setAddressType("HOME");
    setErrors({});
    setShowNewForm(true);
  };

  const getAddressIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "HOME":
        return <Home size={13} className="text-blue-500" />;
      case "WORK":
        return <Briefcase size={13} className="text-amber-500" />;
      default:
        return <Compass size={13} className="text-purple-500" />;
    }
  };

  const validateForm = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(phoneNumber)) e.phoneNumber = "Enter a valid 10-digit mobile number";
    if (!addressLine1.trim()) e.addressLine1 = "Address line 1 is required";
    if (!city.trim()) e.city = "City is required";
    if (!state.trim()) e.state = "State is required";
    if (!pincode.trim()) e.pincode = "Pincode is required";
    else if (!/^[1-9][0-9]{5}$/.test(pincode)) e.pincode = "Enter a valid 6-digit pincode";
    return e;
  };

  const handleCreateNewAddress = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setIsSavingNew(true);
      const newAddrPayload = {
        addressType,
        fullName,
        phoneNumber,
        addressLine1,
        city,
        state,
        pincode,
        country: "India", // Static
        isDefault: (addresses.length === 0).toString()
      };

      // Exclude country from direct API payload to prevent Spring Jackson parsing errors
      const { country, ...apiPayload } = newAddrPayload;

      const response = await userApi.createAddress(apiPayload);
      toast.success("Shipping address saved!");
      
      // Re-fetch all addresses and auto-select the newly added address
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
      
      // Auto-select the last added address
      const newlyAdded = list.find(a => a.addressLine1 === addressLine1 && a.fullName === fullName) || list[list.length - 1];
      setSelectedAddress(newlyAdded || list[0]);
      
      // Reset form states
      setFullName("");
      setPhoneNumber("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setPincode("");
      setAddressType("HOME");
      setErrors({});
      setShowNewForm(false);
    } catch (err) {
      console.error("❌ Failed to add shipping address:", err);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to save address";
      toast.error(msg);
    } finally {
      setIsSavingNew(false);
    }
  };

  const handleCheckoutProceed = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address to proceed.");
      return;
    }

    // Format address object to matching checkout API fields
    const addressPayload = {
      fullName: selectedAddress.fullName,
      phoneNumber: selectedAddress.phoneNumber,
      addressLine1: selectedAddress.addressLine1,
      addressLine2: addressLine2 || "",
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode
    };

    onConfirm(addressPayload);
  };

  const formField = (label, value, setter, errorKey, placeholder, type = "text", maxLength) => (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => {
          setter(e.target.value);
          setErrors(err => ({ ...err, [errorKey]: "" }));
        }}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 transition-all
          ${errors[errorKey] ? "border-red-400 focus:ring-red-200" : "border-gray-200 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E]"}`}
      />
      {errors[errorKey] && <p className="text-xs text-red-500 font-bold mt-1">{errors[errorKey]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-sans"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
              <MapPin size={16} className="text-[#E31E2E]" />
            </div>
            <h2 className="text-base font-extrabold text-gray-900">
              {showNewForm ? "Add Delivery Location" : "Choose Delivery Address"}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {isFetching ? (
            <div className="py-20 flex flex-col justify-center items-center gap-2.5 text-gray-500 font-bold text-sm">
              <Loader2 size={24} className="animate-spin text-[#E31E2E]" />
              <span>Fetching your addresses...</span>
            </div>
          ) : showNewForm ? (
            /* Add Address Form */
            <form onSubmit={handleCreateNewAddress} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Address Type</label>
                <div className="flex gap-3">
                  {["HOME", "WORK", "OTHER"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        addressType === type
                          ? "bg-white border-[#E31E2E] text-[#E31E2E] shadow-xs"
                          : "bg-transparent border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {getAddressIcon(type)}
                      <span className="capitalize">{type.toLowerCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formField("Recipient Name", fullName, setFullName, "fullName", "e.g. Tribhuvan nath sagar")}
                {formField("Phone Number", phoneNumber, setPhoneNumber, "phoneNumber", "10-digit number", "tel", 10)}
              </div>

              {formField("Street Address / Address Line 1", addressLine1, setAddressLine1, "addressLine1", "Flat/House No., Street name, Area")}
              {formField("Address Line 2 (Optional landmark)", addressLine2, setAddressLine2, "addressLine2", "Near Metro / Colony name")}

              <div className="grid grid-cols-3 gap-4">
                {formField("City", city, setCity, "city", "e.g. Patna")}
                {formField("State", state, setState, "state", "e.g. Bihar")}
                {formField("Pincode", pincode, setPincode, "pincode", "6-digit code", "text", 6)}
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSavingNew}
                  className="flex-1 py-3 bg-[#E31E2E] hover:bg-red-700 disabled:bg-gray-200 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {isSavingNew ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Location</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setShowNewForm(false); setErrors({}); }}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Address List */
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Saved Addresses</span>
                <button
                  type="button"
                  onClick={handleOpenAddForm}
                  className="text-xs font-bold text-[#E31E2E] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 inline font-sans"
                >
                  <Plus size={13} />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="py-12 border border-dashed border-gray-200 rounded-2xl text-center flex flex-col items-center justify-center">
                  <MapPin size={22} className="text-gray-300 mb-2" />
                  <p className="text-xs font-bold text-gray-500">No shipping addresses saved.</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 mb-4">Please add a shipping address to place your order.</p>
                  <button
                    onClick={handleOpenAddForm}
                    className="px-4 py-2 bg-[#E31E2E] text-white text-[11px] font-black uppercase rounded-lg hover:bg-red-700 transition cursor-pointer"
                  >
                    Add Shipping Location
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddress && (selectedAddress.addressId || selectedAddress.id) === (addr.addressId || addr.id);
                    const isDefault = addr.isDefault === true || addr.isDefault === "true";
                    return (
                      <div
                        key={addr.addressId || addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`border rounded-xl p-4 cursor-pointer relative flex items-start gap-3 transition-all ${
                          isSelected
                            ? "border-green-500 bg-green-50/[0.02] shadow-xs"
                            : "border-gray-150 hover:border-gray-300 hover:bg-slate-50/20"
                        }`}
                      >
                        {/* Custom selection dot indicator */}
                        <div className="mt-1 shrink-0">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? "border-green-500 bg-green-500 text-white" : "border-gray-300 bg-white"
                          }`}>
                            {isSelected && <Check size={10} className="stroke-[3.5]" />}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-gray-900 truncate">{addr.fullName}</span>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[8px] font-black uppercase tracking-wider">
                              {getAddressIcon(addr.addressType)}
                              <span>{addr.addressType || "HOME"}</span>
                            </span>
                            {isDefault && (
                              <span className="text-[8px] font-black text-green-700 bg-green-50 border border-green-200 px-1 py-0.5 rounded uppercase tracking-wider">
                                Default
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-1.5 font-medium leading-relaxed font-sans truncate">
                            {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 font-sans">
                            Phone: <span className="text-gray-600 font-bold select-all">{addr.phoneNumber}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!showNewForm && !isFetching && (
          <div className="px-6 py-4.5 bg-gray-50 border-t border-gray-100 shrink-0">
            <button
              onClick={handleCheckoutProceed}
              disabled={isLoading || addresses.length === 0}
              className="w-full py-3.5 bg-[#E31E2E] hover:bg-red-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-red-100/50 cursor-pointer"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
              <span>{isLoading ? "Creating Order…" : "Deliver to this Address & Pay"}</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ─── Main Cart Component ───────────────────────────────────────────────────────
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, openAuthModal } = useAuth();
  const { cartItems, totalAmount, totalQuantity, updateQty, removeItemFromCart, clearUserCart } = useCart();

  // Modal / loading states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isConfirmingPay, setIsConfirmingPay] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(null);  // { orderId }
  const [paymentError, setPaymentError] = useState(null);  // error string

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  // ── Quantity & remove handlers ───────────────────────────────────────────
  const handleUpdateQuantity = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty >= 1) updateQty(item, newQty);
  };

  // ── Coupon handlers ──────────────────────────────────────────────────────
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    if (couponCode.trim().toUpperCase() === "BKB100") {
      setAppliedCoupon("BKB100");
      setCouponDiscount(10.00);
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code. Try 'BKB100'.");
    }
  };
  const handleRemoveCoupon = () => { setAppliedCoupon(""); setCouponDiscount(0); };

  // ── Calculations ─────────────────────────────────────────────────────────
  const shippingCharge = totalAmount > 50 || totalAmount === 0 ? 0 : 5.00;
  const estimatedTax = totalAmount * 0.08;
  const finalDiscount = totalAmount > 0 ? Math.min(couponDiscount, totalAmount) : 0;
  const orderTotal = totalAmount > 0 ? totalAmount + estimatedTax + shippingCharge - finalDiscount : 0;

  // ── Checkout button clicked ───────────────────────────────────────────────
  const handleCheckoutClick = () => {
    if (!user) { openAuthModal("login"); return; }
    setPaymentError(null);
    setShowAddressModal(true);
  };

  // ── Address confirmed → create backend order → open Razorpay modal ───────
  const handleAddressConfirm = async (addressData) => {
    setIsCreatingOrder(true);
    setPaymentError(null);

    let orderData;
    try {
      orderData = await checkoutApi.createOrder(addressData);
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order.");
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Failed to create order.";
      setPaymentError(msg);
      setIsCreatingOrder(false);
      return;
    }

    setIsCreatingOrder(false);
    setShowAddressModal(false);

    // Open Razorpay checkout modal
    openRazorpayModal(orderData);
  };

  // ── Razorpay modal ────────────────────────────────────────────────────────
  const openRazorpayModal = (orderData) => {
    if (typeof window.Razorpay === "undefined") {
      setPaymentError("Payment SDK not loaded. Please refresh the page and try again.");
      return;
    }

    const options = {
      key: orderData.razorpayKeyId,
      amount: Math.round(orderData.amount * 100),  // Razorpay expects paise
      currency: orderData.currency || "INR",
      name: "BooksKaBazaar",
      description: `Order #${orderData.orderId}`,
      order_id: orderData.razorpayOrderId,
      prefill: {
        name: user?.fullName || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      theme: { color: "#E31E2E" },

      // ── Payment success callback ─────────────────────────────────────────
      handler: async (response) => {
        setIsConfirmingPay(true);
        try {
          const confirmData = await checkoutApi.confirmPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (confirmData.success) {
            dispatch(clearCart());
            setCheckoutSuccess({ orderId: orderData.orderId });
          } else {
            setPaymentError(confirmData.error || "Payment confirmation failed.");
          }
        } catch (err) {
          const msg = err.response?.data?.error || err.message || "Payment confirmation failed.";
          const code = err.response?.data?.code;

          if (code === "INSUFFICIENT_STOCK") {
            setPaymentError(
              "Sorry! Another customer just purchased the last copy of one of your items. " +
              "Your payment has NOT been captured. Please update your cart and try again."
            );
          } else {
            setPaymentError(msg);
          }
        } finally {
          setIsConfirmingPay(false);
        }
      },

      // ── Modal dismissed without payment ──────────────────────────────────
      modal: {
        ondismiss: () => {
          toast("Payment cancelled. Your cart is intact.", { icon: "ℹ️" });
        },
      },
    };

    const rzp = new window.Razorpay(options);

    // ── Payment failure callback (e.g. card declined) ─────────────────────
    rzp.on("payment.failed", (response) => {
      const desc = response.error?.description || "Payment failed. Please try again.";
      setPaymentError(desc);
      toast.error("Payment failed: " + desc);
    });

    rzp.open();
  };

  // ── Close success modal ───────────────────────────────────────────────────
  const handleCloseSuccess = () => {
    setCheckoutSuccess(null);
    navigate("/profile", { state: { activeTab: "orders" } });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow pb-16">
        <main className="px-6 sm:px-10 lg:px-28 mx-auto py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-6 uppercase tracking-wider">
          <span className="hover:text-[#E31E2E] cursor-pointer transition" onClick={() => navigate("/")}>Home</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-[#E31E2E]">Shopping Cart</span>
        </div>

        <div className="flex items-center justify-between pb-5 border-b border-gray-200 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
            <p className="text-sm text-gray-500 mt-1">
              You have {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your cart.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 md:text-sm text-xs font-bold text-gray-600 hover:text-[#E31E2E] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Go Back</span>
          </button>
        </div>

        {/* Payment error banner */}
        <AnimatePresence>
          {paymentError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span className="flex-1">{paymentError}</span>
              <button onClick={() => setPaymentError(null)} className="shrink-0 text-red-400 hover:text-red-600 cursor-pointer">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {cartItems.length === 0 ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-xl mx-auto mt-8"
            >
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Explore our catalog to find books on Academics, Fiction, Non-Fiction, and more.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-[#E31E2E] text-white font-bold rounded-xl text-sm hover:bg-red-700 hover:shadow-lg shadow-red-100 transition duration-200 cursor-pointer"
              >
                Browse Bookstore
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* ── Cart Items List ─────────────────────────────────────────── */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="flex gap-4 p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition duration-200"
                    >
                      <img
                        src={item.imageURL}
                        alt={item.title}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop"; }}
                        className="w-20 h-28 object-cover rounded-xl shadow-sm shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-extrabold text-gray-900 text-sm sm:text-base line-clamp-1 leading-tight">
                              {item.title}
                            </h3>
                            <button
                              onClick={() => removeItemFromCart(item)}
                              className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 font-medium mt-1">by {item.author}</p>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl px-1.5 py-1">
                            <button onClick={() => handleUpdateQuantity(item, -1)} disabled={item.quantity <= 1}
                              className="p-1 hover:text-[#E31E2E] text-gray-500 transition cursor-pointer disabled:opacity-30">
                              <Minus size={13} />
                            </button>
                            <span className="px-3 text-sm font-extrabold text-gray-800 select-none">{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item, 1)}
                              className="p-1 hover:text-[#E31E2E] text-gray-500 transition cursor-pointer">
                              <Plus size={13} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</p>
                            <span className="font-black text-gray-900 text-sm sm:text-base mt-0.5">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={clearUserCart}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold text-xs text-gray-600 transition cursor-pointer"
                  >
                    Clear Shopping Cart
                  </button>
                </div>
              </div>

              {/* ── Order Summary Sidebar ────────────────────────────────────── */}
              <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Order Summary</h3>

                  <div className="space-y-3.5 text-sm font-semibold text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-gray-900">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (8%)</span>
                      <span className="text-gray-900">₹{estimatedTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span>Shipping Fees</span>
                        {shippingCharge === 0 && totalAmount > 0 && (
                          <span className="text-[10px] bg-green-50 text-green-700 font-extrabold uppercase px-1.5 py-0.5 border border-green-100 rounded">Free</span>
                        )}
                      </div>
                      <span className="text-gray-900">{shippingCharge === 0 ? "₹0.00" : `₹${shippingCharge.toFixed(2)}`}</span>
                    </div>
                    {finalDiscount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span className="flex items-center gap-1 font-bold"><Sparkles size={14} />Discount Applied</span>
                        <span>-₹{finalDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="h-px bg-gray-100 my-4" />
                    <div className="flex justify-between text-base font-black text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-lg text-[#E31E2E]">₹{orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Coupon field */}
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Promo / Coupon Code</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="e.g. BKB100"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                        />
                      </div>
                      <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition cursor-pointer">
                        Apply
                      </button>
                    </div>
                    {couponError && <span className="text-xs text-red-600 font-bold block">{couponError}</span>}
                    {appliedCoupon && (
                      <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-green-700 font-bold">
                        <span>Active: {appliedCoupon}</span>
                        <button type="button" onClick={handleRemoveCoupon} className="text-[10px] uppercase text-red-600 hover:text-red-700 font-black cursor-pointer">Remove</button>
                      </div>
                    )}
                  </form>

                  {/* Checkout button */}
                  <button
                    onClick={handleCheckoutClick}
                    disabled={isCreatingOrder || isConfirmingPay || cartItems.length === 0}
                    className="w-full py-4 bg-[#E31E2E] hover:bg-red-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl font-black shadow-lg shadow-red-100 hover:shadow-xl transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                  >
                    {(isCreatingOrder || isConfirmingPay) && <Loader2 size={16} className="animate-spin" />}
                    <span>
                      {isCreatingOrder ? "PREPARING ORDER…" :
                        isConfirmingPay ? "CONFIRMING PAYMENT…" :
                          "PROCEED TO SECURE CHECKOUT"}
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span>Safe &amp; Secure Payments via Razorpay</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Address Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddressModal && (
          <AddressModal
            user={user}
            isLoading={isCreatingOrder}
            onClose={() => { setShowAddressModal(false); setIsCreatingOrder(false); }}
            onConfirm={handleAddressConfirm}
          />
        )}
      </AnimatePresence>

      {/* ── Payment Confirmation Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {isConfirmingPay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl px-10 py-8 shadow-2xl flex flex-col items-center gap-4"
            >
              <Loader2 size={36} className="text-[#E31E2E] animate-spin" />
              <p className="text-sm font-bold text-gray-600">Confirming your payment…</p>
              <p className="text-xs text-gray-400">Please do not close this window</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Order Success Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {checkoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle size={36} className="text-green-600" />
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Order Confirmed!</h3>
              <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-4">
                Order ID: BKB-{checkoutSuccess.orderId}
              </p>

              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Thank you for shopping at <strong>BooksKaBazaar</strong>! Your order is being processed and a confirmation email has been sent to your address.
              </p>

              <button
                onClick={handleCloseSuccess}
                className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-black transition cursor-pointer"
              >
                VIEW ORDER HISTORY
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
