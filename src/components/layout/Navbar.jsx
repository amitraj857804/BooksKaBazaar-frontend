import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { useFlyToCartContext } from "../../context/FlyToCartContext";
import { CartDrawer } from "../cart";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [bounceCart, setBounceCart] = useState(false);
  const { openAuthModal } = useAuth();
  const cartIconRef = useRef(null);
  const { cartIconRef: contextCartIconRef, isFlying } = useFlyToCartContext();

  // Get cart data from Redux
  const { totalQuantity } = useSelector((state) => state.cart);

  // Update context with cart icon ref
  useEffect(() => {
    if (contextCartIconRef) {
      contextCartIconRef.current = cartIconRef.current;
    }
  }, [contextCartIconRef]);

  // Trigger bounce when animation completes
  useEffect(() => {
    if (!isFlying && bounceCart) {
      setBounceCart(false);
    }
  }, [isFlying, bounceCart]);

  useEffect(() => {
    if (isFlying) {
      setBounceCart(true);
    }
  }, [isFlying]);

  const handleCartClick = () => {
    setCartOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="shrink-0 font-bold text-xl">
              <span className="text-gray-900">Books</span>
              <span className="text-red-600 font-extrabold">KaBazaar</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {/* Search Bar */}
              <div 
                className="relative transition-all duration-300"
                onMouseEnter={() => setSearchHovered(true)}
                onMouseLeave={() => setSearchHovered(false)}
              >
                <input
                  type="text"
                  placeholder="Search books..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`px-4 py-2 rounded-lg bg-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300 ${
                    searchHovered || searchFocused ? "w-96" : "w-64"
                  }`}
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Links */}
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium transition">
                Categories
              </a>
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium transition">
                New Arrivals
              </a>

              {/* Cart Icon */}
              <motion.div
                ref={cartIconRef}
                className="relative cursor-pointer"
                onClick={handleCartClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={bounceCart ? { scale: [1, 1.2, 0.95, 1.05, 1] } : {}}
                transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 15 }}
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-red-600 transition" />
                {totalQuantity > 0 && (
                  <motion.span
                    key={totalQuantity}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {totalQuantity}
                  </motion.span>
                )}
              </motion.div>

              {/* Auth Section */}
              {!isLoggedIn ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => openAuthModal("login")}
                    className="px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal("signup")}
                    className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Profile</span>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <motion.div
                className="relative cursor-pointer"
                onClick={handleCartClick}
                whileHover={{ scale: 1.1 }}
                animate={bounceCart ? { scale: [1, 1.2, 0.95, 1.05, 1] } : {}}
                transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 15 }}
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {totalQuantity > 0 && (
                  <motion.span
                    key={totalQuantity}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    {totalQuantity}
                  </motion.span>
                )}
              </motion.div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-sm placeholder-gray-500 focus:outline-none"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-red-600 font-medium">
                Categories
              </a>
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-red-600 font-medium">
                New Arrivals
              </a>
              {!isLoggedIn && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      openAuthModal("login");
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal("signup");
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
