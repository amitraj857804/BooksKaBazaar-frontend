import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { removeItem, updateQuantity, clearCart } from "../../store/cartSlice";

const CartDrawer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { cartItems, totalAmount, totalQuantity } = useSelector(
    (state) => state.cart
  );

  const handleUpdateQuantity = (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty >= 1) {
      dispatch(updateQuantity({ itemId, quantity: newQty }));
    }
  };

  // FIX 1: Ensure consistency in units ("100%" to "0%")
  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: "0%", // Changed from 0 to "0%"
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      x: "100%",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            className="fixed right-0 top-0 h-screen w-full max-w-md z-50 bg-[#FAFAFA] shadow-2xl flex flex-col overflow-hidden"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  BooksKa<span className="text-[#E31E2E]">Bazaar</span> Cart
                </h2>
                <p className="text-sm text-gray-600">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold">Your cart is empty</h3>
                  <button onClick={onClose} className="mt-4 text-[#E31E2E] font-medium">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout // Smooth reordering when items are deleted
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm"
                      >
                        <img src={item.imageURL} className="w-16 h-24 object-cover rounded-md shadow-sm" alt={item.title} />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-gray-500 mb-2">{item.author}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border rounded-lg">
                              <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                className="p-1 hover:text-[#E31E2E]"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                className="p-1 hover:text-[#E31E2E]"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                        <button onClick={() => dispatch(removeItem(item.id))} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
                </div>
                <button className="w-full py-4 bg-[#E31E2E] text-white rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;