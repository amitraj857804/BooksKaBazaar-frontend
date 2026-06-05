import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, 
  ChevronRight, Sparkles, Tag, ShieldCheck, CheckCircle, Loader2
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { removeItem, updateQuantity, clearCart } from "../store/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalAmount, totalQuantity } = useSelector((state) => state.cart);

  // Checkout modal and loading states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleUpdateQuantity = (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty >= 1) {
      dispatch(updateQuantity({ itemId, quantity: newQty }));
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    
    if (couponCode.trim().toUpperCase() === "BKB100") {
      setAppliedCoupon("BKB100");
      setCouponDiscount(10.00); // Save $10.00
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code. Try 'BKB100'.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponDiscount(0);
  };

  const handleCheckoutSubmit = async () => {
    setIsProcessingCheckout(true);
    // Simulate payment gateway delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessingCheckout(false);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    dispatch(clearCart());
    setIsCheckoutOpen(false);
    navigate("/");
  };

  // Calculations
  const shippingCharge = totalAmount > 50 || totalAmount === 0 ? 0 : 5.00;
  const estimatedTax = totalAmount * 0.08; // 8% GST/Tax
  const finalDiscount = totalAmount > 0 ? Math.min(couponDiscount, totalAmount) : 0;
  const orderTotal = totalAmount > 0 
    ? totalAmount + estimatedTax + shippingCharge - finalDiscount 
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
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
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#E31E2E] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          {cartItems.length === 0 ? (
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
                Explore our catalog to find books on Academics, Fiction, Non-Fiction, and more. Add books to your cart to checkout.
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
              
              {/* Cart Items List (Column 1 - span 2) */}
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop";
                        }}
                        className="w-20 h-28 object-cover rounded-xl shadow-sm shrink-0" 
                      />
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-extrabold text-gray-900 text-sm sm:text-base line-clamp-1 leading-tight">
                              {item.title}
                            </h3>
                            <button 
                              onClick={() => dispatch(removeItem(item.id))} 
                              className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 font-medium mt-1">by {item.author}</p>
                        </div>
                        
                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl px-1.5 py-1">
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                              className="p-1 hover:text-[#E31E2E] text-gray-500 transition cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="px-3 text-sm font-extrabold text-gray-800 select-none">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                              className="p-1 hover:text-[#E31E2E] text-gray-500 transition cursor-pointer"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</p>
                            <span className="font-black text-gray-900 text-sm sm:text-base mt-0.5">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold text-xs text-gray-600 transition cursor-pointer"
                  >
                    Clear Shopping Cart
                  </button>
                </div>
              </div>

              {/* Order Summary Sidebar (Column 2 - span 1) */}
              <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Order Summary</h3>
                  
                  {/* Detailed pricing */}
                  <div className="space-y-3.5 text-sm font-semibold text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-gray-900">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (8%)</span>
                      <span className="text-gray-900">${estimatedTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span>Shipping Fees</span>
                        {shippingCharge === 0 && totalAmount > 0 && (
                          <span className="text-[10px] bg-green-50 text-green-700 font-extrabold uppercase px-1.5 py-0.5 border border-green-100 rounded">
                            Free
                          </span>
                        )}
                      </div>
                      <span className="text-gray-900">
                        {shippingCharge === 0 ? "$0.00" : `$${shippingCharge.toFixed(2)}`}
                      </span>
                    </div>

                    {/* Discount row */}
                    {finalDiscount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span className="flex items-center gap-1 font-bold">
                          <Sparkles size={14} />
                          Discount Applied
                        </span>
                        <span>-${finalDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="h-px bg-gray-100 my-4" />
                    
                    <div className="flex justify-between text-base font-black text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-lg text-[#E31E2E]">${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Coupon Field */}
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
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    
                    {couponError && (
                      <span className="text-xs text-red-600 font-bold block">{couponError}</span>
                    )}

                    {appliedCoupon && (
                      <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-green-700 font-bold">
                        <span>Active: {appliedCoupon}</span>
                        <button 
                          type="button" 
                          onClick={handleRemoveCoupon}
                          className="text-[10px] uppercase text-red-600 hover:text-red-700 font-black cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </form>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={isProcessingCheckout}
                    className="w-full py-4 bg-[#E31E2E] hover:bg-red-700 disabled:bg-gray-200 text-white rounded-xl font-black shadow-lg shadow-red-100 hover:shadow-xl transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                  >
                    {isProcessingCheckout && <Loader2 size={16} className="animate-spin" />}
                    <span>{isProcessingCheckout ? "PROCESSING..." : "PROCEED TO SECURE CHECKOUT"}</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span>Safe & Secure Payments</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Checkout Success Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
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
              <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-4">ID: BKB-ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
              
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Thank you for buying from **BooksKaBazaar**. Your order is being processed, and an email receipt has been sent to your address.
              </p>
              
              <button
                onClick={handleCloseCheckout}
                className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-black transition cursor-pointer"
              >
                RETURN TO HOMEPAGE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
