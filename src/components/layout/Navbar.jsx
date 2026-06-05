import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu, X, Store, Heart, MapPin, ChevronDown, Smartphone, Compass, Sparkles, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { useFlyToCartContext } from "../../context/FlyToCartContext";
import { useNavigate } from "react-router-dom";
import { wishlistApi } from "../../services/user/wishlistApi";
import { setBookshelfItems } from "../../store/bookshelfSlice";

const Navbar = () => {
  const { openAuthModal, user, logoutUser } = useAuth();
  const isLoggedIn = !!user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pincode, setPincode] = useState("122009");
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [showBookshelfAlert, setShowBookshelfAlert] = useState(false);
  const [pincodeInput, setPincodeInput] = useState("");
  const [bounceCart, setBounceCart] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartIconRef = useRef(null);
  const { cartIconRef: contextCartIconRef, isFlying } = useFlyToCartContext();

  // Get cart data from Redux
  const { totalQuantity } = useSelector((state) => state.cart);

  // Sync wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isLoggedIn) return;
      try {
        const data = await wishlistApi.get();
        let booksArray = [];
        if (data && Array.isArray(data)) {
          booksArray = data;
        } else if (data && data.success && Array.isArray(data.data)) {
          booksArray = data.data;
        } else if (data && Array.isArray(data.data)) {
          booksArray = data.data;
        }
        
        const mapped = booksArray.map((item) => {
          const bk = item.bookId ? item : (item.book || {});
          const bookId = bk.bookId || item.id;
          return {
            id: bookId,
            title: bk.bookTitle || "Untitled Book",
            author: bk.authorName || "Unknown Author",
            price: parseFloat(bk.price) || 0,
            imageURL: bk.imageFileName 
              ? `http://localhost:8080/api/public/books/${bookId}/image`
              : "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop",
            badge: bk.category || null,
          };
        });
        
        dispatch(setBookshelfItems(mapped));
      } catch (err) {
        console.warn("⚠️ Central wishlist fetch failed: ", err.message);
      }
    };
    fetchWishlist();
  }, [isLoggedIn, dispatch]);

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


  return (
    <>
      <header className="w-full bg-white z-50 shadow-sm sticky top-0 relative">
       


        {/* Tier 3: Main Brand, Search & Actions */}
        <div className="border-b border-gray-100 bg-white py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
            
            {/* Mobile/Tablet Left Menu Trigger (Hamburger menu) - visible under lg */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 p-1 cursor-pointer hover:text-[#E31E2E] transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo - left aligned on desktop, centered on mobile/tablet */}
            <div 
              onClick={() => navigate("/")} 
              className="shrink-0 font-black text-2xl tracking-tighter cursor-pointer select-none flex items-center gap-1.5 justify-center lg:justify-start flex-1 lg:flex-initial"
            >
              <span className="text-slate-900 font-serif">Books</span>
              <span className="text-[#E31E2E] font-sans font-black">KaBazaar</span>
            </div>

            {/* Desktop Search Bar - positioned in the middle on desktop only */}
            <div className="hidden lg:block flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search by Title, Author, ISBN or Genre..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-300 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] hover:border-[#E31E2E]/50 transition-all shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-[#E31E2E] transition-colors" />
              </div>
            </div>

            {/* Actions (Login/Sign Up, Bookshelf, Cart) - visible on desktop (lg and up) */}
            <div className="hidden lg:flex items-center gap-6">
              
              {/* Auth Section */}
              {!isLoggedIn ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => openAuthModal("login")}
                    className="px-4 py-2 text-gray-700 font-bold text-sm hover:text-[#E31E2E] transition cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal("signup")}
                    className="px-5 py-2 bg-[#E31E2E] text-white font-bold text-sm rounded-lg hover:bg-[#E31E2E]/90 hover:shadow-md transition cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2.5 cursor-pointer group transition select-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E31E2E]/10 border border-[#E31E2E]/20 text-[#E31E2E] flex items-center justify-center font-bold text-sm uppercase shadow-sm group-hover:bg-[#E31E2E] group-hover:text-white group-hover:border-transparent transition-all duration-200">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                  <span className="text-gray-700 font-bold text-sm group-hover:text-[#E31E2E] transition">
                    {user?.fullName?.split(" ")[0] || "User"}
                  </span>
                </div>
              )}

              {/* Bookshelf Widget */}
              <button 
                onClick={() => navigate("/bookshelf")}
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#E31E2E] transition cursor-pointer font-semibold text-sm"
              >
                <Heart className="w-5.5 h-5.5 text-gray-500" />
                <span>Bookshelf</span>
              </button>

              {/* Shopping Cart */}
              <motion.div
                ref={cartIconRef}
                className="relative cursor-pointer flex items-center gap-1.5 text-gray-700 hover:text-[#E31E2E] transition"
                onClick={() => navigate("/cart")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={bounceCart ? { scale: [1, 1.15, 0.95, 1.03, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <ShoppingCart className="w-5.5 h-5.5 text-gray-600" />
                  {totalQuantity > 0 && (
                    <motion.span
                      key={totalQuantity}
                      className="absolute -top-2 -right-2.5 bg-[#E31E2E] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white"
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      {totalQuantity}
                    </motion.span>
                  )}
                </div>
                <span className="font-semibold text-sm">Cart</span>
              </motion.div>
            </div>

            {/* Mobile/Tablet Actions (Heart, Cart, Profile User icon) - visible under lg */}
            <div className="lg:hidden flex items-center gap-4">
              
              {/* Heart/Bookshelf Icon */}
              <button 
                onClick={() => navigate("/bookshelf")}
                className="text-gray-700 p-1 cursor-pointer hover:text-[#E31E2E] transition-colors"
                aria-label="Bookshelf"
              >
                <Heart className="w-5.5 h-5.5 text-gray-600" />
              </button>

              {/* Shopping Cart */}
              <motion.div
                className="relative cursor-pointer p-1"
                onClick={() => navigate("/cart")}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-5.5 h-5.5 text-gray-600" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#E31E2E] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                    {totalQuantity}
                  </span>
                )}
              </motion.div>

              {/* Profile/User Icon */}
              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    navigate("/profile");
                  } else {
                    openAuthModal("login");
                  }
                }}
                className="text-gray-700 p-1 cursor-pointer hover:text-[#E31E2E] transition-colors flex items-center justify-center"
                aria-label="Profile"
              >
                {isLoggedIn ? (
                  <div className="w-7 h-7 rounded-full bg-[#E31E2E]/10 border border-[#E31E2E]/20 text-[#E31E2E] flex items-center justify-center font-bold text-xs uppercase shadow-sm hover:bg-[#E31E2E] hover:text-white hover:border-transparent transition-all duration-200">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                ) : (
                  <User className="w-5.5 h-5.5 text-gray-600 hover:text-[#E31E2E]" />
                )}
              </button>

            </div>

          </div>
        </div>

        {/* Tier 3.5: Search Bar Row (Directly visible on mobile, iPad; hidden on desktop) */}
        <div className="lg:hidden border-b border-gray-100 bg-white pb-3.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search by Title, Author, ISBN or Genre..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-300 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] hover:border-[#E31E2E]/50 transition-all shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-[#E31E2E] transition-colors" />
            </div>
          </div>
        </div>

        {/* Tier 4: Catalog Sub-header Links & Dropdowns (Visible on desktop screen size >= lg) */}
        <div className="hidden lg:block border-b border-gray-100 bg-white py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[13px] font-bold text-gray-700 uppercase tracking-wide">
            <div className="flex items-center gap-8">
              
              {/* Categories Dropdown Container */}
              <div 
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button className="hover:text-[#E31E2E] transition flex items-center gap-1 cursor-pointer py-1.5 uppercase font-bold text-[13px] text-gray-700">
                  <span>Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu Panel */}
                <AnimatePresence>
                  {categoriesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 text-left capitalize font-medium text-sm text-gray-700 overflow-hidden"
                    >
                      <div className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-2">
                        Browse by Category
                      </div>
                      <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#E31E2E] transition">Academics</a>
                      <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#E31E2E] transition">Fiction</a>
                      <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#E31E2E] transition">Non Fiction</a>
                      <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#E31E2E] transition">Children & Kids</a>
                      <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#E31E2E] transition">Young Adults</a>
                      <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#E31E2E] transition">Comics & Graphic Novels</a>
                      <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#E31E2E] transition">Languages</a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Best Sellers */}
              <button 
                onClick={() => {
                  const grid = document.querySelector("#book-collection-section");
                  if (grid) grid.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-[#E31E2E] transition cursor-pointer py-1.5 uppercase font-bold text-[13px] text-gray-700"
              >
                Best Sellers
              </button>

              {/* New Arrivals */}
              <button 
                onClick={() => {
                  const grid = document.querySelector("#book-collection-section");
                  if (grid) grid.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-[#E31E2E] transition cursor-pointer py-1.5 uppercase font-bold text-[13px] text-gray-700"
              >
                New Arrivals
              </button>

              {/* Sell With Us */}
              {!isLoggedIn && (
                <button 
                  onClick={() => navigate("/seller")}
                  className="hover:text-[#E31E2E] transition flex items-center gap-1.5 cursor-pointer py-1.5 uppercase font-bold text-[13px] text-gray-700"
                >
                  <Store size={15} />
                  <span>Sell With Us</span>
                </button>
              )}

            </div>
            
            
          </div>
        </div>
        {/* Mobile Menu Overlay - visible on mobile and iPads (under lg), scrolls with the navbar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute inset-x-0 top-full bg-white z-40 border-b border-gray-200 shadow-xl p-5 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto"
            >

             

              {/* Categories & Links */}
              <div className="space-y-3 font-bold text-sm text-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Explore Collections</div>
                
                {/* Collapsible Categories accordion section */}
                <div className="border-b border-gray-100 pb-2">
                  <button 
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="flex justify-between items-center w-full text-left py-1 hover:text-[#E31E2E] cursor-pointer"
                  >
                    <span>Categories</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCategoriesOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {mobileCategoriesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 mt-2 space-y-2.5 text-xs text-gray-500 font-medium overflow-hidden border-l-2 border-gray-100 text-left capitalize"
                      >
                        <a href="#" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#E31E2E]">Academics</a>
                        <a href="#" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#E31E2E]">Fiction</a>
                        <a href="#" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#E31E2E]">Non Fiction</a>
                        <a href="#" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#E31E2E]">Children & Kids</a>
                        <a href="#" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#E31E2E]">Young Adults</a>
                        <a href="#" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#E31E2E]">Comics & Graphic Novels</a>
                        <a href="#" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#E31E2E]">Languages</a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const grid = document.querySelector("#book-collection-section");
                    if (grid) grid.scrollIntoView({ behavior: "smooth" });
                  }} 
                  className="block w-full text-left py-1 hover:text-[#E31E2E] cursor-pointer"
                >
                  Best Sellers
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const grid = document.querySelector("#book-collection-section");
                    if (grid) grid.scrollIntoView({ behavior: "smooth" });
                  }} 
                  className="block w-full text-left py-1 hover:text-[#E31E2E] cursor-pointer"
                >
                  New Arrivals
                </button>
                {!isLoggedIn && (
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/seller");
                    }} 
                    className="block w-full text-left py-1 hover:text-[#E31E2E] cursor-pointer"
                  >
                    Sell With Us
                  </button>
                )}
              </div>

              {/* Auth section in Mobile Menu */}
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        openAuthModal("login");
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 py-2.5 text-center text-sm font-bold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal("signup");
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 py-2.5 text-center text-sm font-bold text-white bg-[#E31E2E] rounded-lg hover:bg-[#E31E2E]/90 transition"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="flex-1 py-2.5 text-center text-sm font-bold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        logoutUser();
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 py-2.5 text-center text-sm font-bold text-white bg-[#E31E2E] rounded-lg hover:bg-[#E31E2E]/90 transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
