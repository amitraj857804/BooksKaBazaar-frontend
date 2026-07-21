import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu, X, Store, Heart, MapPin, ChevronDown, Smartphone, Compass, Sparkles, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { useFlyToCartContext } from "../../context/FlyToCartContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { wishlistApi } from "../../services/user/wishlistApi";
import { setBookshelfItems, clearBookshelf } from "../../store/bookshelfSlice";
import { clearCart } from "../../store/cartSlice";
import { useCart } from "../../hooks/useCart";
import { useDebounce } from "../../hooks/useDebounce";
import { publicApi } from "../../services/public/publicApi";

const SEARCH_CATEGORIES = [
  "All Categories",
  "Academics",
  "Fiction",
  "Non Fiction",
  "Children & Kids",
  "Young Adults",
  "Comics & Graphic",
  "Languages",
  "Competitive",
  "Rare & Vintage",
];

const Navbar = () => {
  const { openAuthModal, user, logoutUser } = useAuth();
  const isLoggedIn = !!user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bounceCart, setBounceCart] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const mobileCategoryDropdownRef = useRef(null);
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Derive selected category directly from the URL — no state sync needed
  const urlQuery = urlSearchParams.get("query") || "";
  const urlCategory = urlSearchParams.get("category") || "";
  const selectedCategory = urlCategory || (SEARCH_CATEGORIES.slice(1).includes(urlQuery) ? urlQuery : "");

  const cartIconRef = useRef(null);
  const { cartIconRef: contextCartIconRef, isFlying } = useFlyToCartContext();

  // Search autocomplete state and refs
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const debouncedSearchTerm = useDebounce(searchInput, 400);

  // Get cart and bookshelf data from Redux
  const { totalQuantity } = useSelector((state) => state.cart);
  const { bookshelfItems } = useSelector((state) => state.bookshelf);

  const { syncCart } = useCart();

  const [bounceBookshelf, setBounceBookshelf] = useState(false);
  const prevBookshelfLength = useRef(bookshelfItems?.length || 0);

  useEffect(() => {
    if (bookshelfItems && bookshelfItems.length !== prevBookshelfLength.current) {
      setBounceBookshelf(true);
      prevBookshelfLength.current = bookshelfItems.length;
    }
  }, [bookshelfItems?.length]);

  // Sync cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoggedIn) return;
      try {
        await syncCart();
      } catch (err) {
        console.warn("⚠️ Central cart fetch failed: ", err.message);
      }
    };
    fetchCart();
  }, [isLoggedIn, syncCart]);

  // Close category popover on outside click (desktop + mobile)
  useEffect(() => {
    const handler = (e) => {
      const insideDesktop = categoryDropdownRef.current?.contains(e.target);
      const insideMobile = mobileCategoryDropdownRef.current?.contains(e.target);
      if (!insideDesktop && !insideMobile) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Clear cart and bookshelf states on logout
  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(clearCart());
      dispatch(clearBookshelf());
    }
  }, [isLoggedIn, dispatch]);

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

  // Click outside suggestions list
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target)) &&
        (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target))
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch live suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      const trimmed = debouncedSearchTerm.trim();
      if (!trimmed || trimmed.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setIsSearching(true);
        const data = await publicApi.searchBooks(trimmed);

        let booksArray = [];
        if (data && Array.isArray(data)) {
          booksArray = data;
        } else if (data && data.success && Array.isArray(data.data)) {
          booksArray = data.data;
        } else if (data && Array.isArray(data.data)) {
          booksArray = data.data;
        }

        const mapped = booksArray.map((bk) => ({
          id: bk.bookId || bk.id,
          title: bk.bookTitle || "Untitled Book",
          author: bk.authorName || "Unknown Author",
          price: parseFloat(bk.price) || 0,
          imageURL: bk.imageFileName
            ? `http://localhost:8080/api/public/books/${bk.bookId || bk.id}/image`
            : "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop",
          badge: bk.category || null,
        }));

        // Show top 5 suggestions
        setSuggestions(mapped.slice(0, 5));
      } catch (err) {
        console.warn("⚠️ Autocomplete fetch failed: ", err.message);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    getSuggestions();
  }, [debouncedSearchTerm]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      const cat = selectedCategory && selectedCategory !== "All Categories" ? selectedCategory : "";
      const url = cat
        ? `/search?query=${encodeURIComponent(searchInput.trim())}&category=${encodeURIComponent(cat)}`
        : `/search?query=${encodeURIComponent(searchInput.trim())}`;
      navigate(url);
      setShowSuggestions(false);
    } else if (selectedCategory && selectedCategory !== "All Categories") {
      navigate(`/search?query=${encodeURIComponent(selectedCategory)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (bookId) => {
    navigate(`/book/${bookId}`);
    setSearchInput("");
    setShowSuggestions(false);
  };

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
              className="shrink-0 font-black sm:text-2xl text-lg tracking-tighter cursor-pointer select-none flex items-center gap-1   justify-start lg:justify-start flex-1 lg:flex-initial"
            >

              <span className="text-[#E31E2E] font-sans font-black">Books Ka Bazaar</span>
            </div>

            {/* Desktop Search Bar */}
            <div ref={desktopSearchRef} className="hidden lg:block flex-1 max-w-xl mx-8 relative">
              <form onSubmit={handleSearchSubmit} className="relative w-full cup">
                {/* Input */}
                <input
                  type="text"
                  placeholder="Search books, authors, ISBN..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => { if (e.key === "Escape") setShowSuggestions(false); }}
                  className="w-full pl-10 pr-[148px] py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E31E2E] focus:ring-1 focus:ring-[#E31E2E]/20 transition-all shadow-sm"
                />
                {/* Search button (left) */}
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Search size={15} />
                </button>

                {/* Category selector (right) */}
                <div ref={categoryDropdownRef} className="absolute right-0 top-0 bottom-0 flex items-center">
                  <span className="w-px h-5 bg-gray-200" />
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen((o) => !o)}
                    className="flex items-center gap-1 px-3 h-full text-xs font-semibold text-gray-600 rounded-r-lg cursor-pointer focus:outline-none whitespace-nowrap"
                  >
                    <span className="max-w-[90px] truncate">{selectedCategory || "All"}</span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Category popover */}
                  {categoryDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                      {SEARCH_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            const val = cat === "All Categories" ? "" : cat;
                            setCategoryDropdownOpen(false);
                            setSearchInput("");
                            setShowSuggestions(false);
                            if (val) {
                              navigate(`/search?query=${encodeURIComponent(val)}`);
                            }
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                            selectedCategory === (cat === "All Categories" ? "" : cat)
                              ? "bg-[#E31E2E]/5 text-[#E31E2E] font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </form>

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && searchInput.trim().length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-left max-h-[420px] flex flex-col font-sans"
                  >
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                      {isSearching ? (
                        <div className="p-6 flex items-center justify-center gap-3 text-slate-500 text-sm">
                          <svg className="animate-spin h-5 w-5 text-[#E31E2E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Searching books...</span>
                        </div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map((bk) => (
                          <div
                            key={bk.id}
                            onClick={() => handleSuggestionClick(bk.id)}
                            className="flex items-center gap-3.5 p-3 hover:bg-slate-50 cursor-pointer group transition-colors"
                          >
                            <div className="w-10 h-14 bg-slate-100 rounded-md overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                              <img
                                src={bk.imageURL}
                                alt={bk.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-[#E31E2E] transition-colors">
                                {bk.title}
                              </h4>
                              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">by {bk.author}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold text-[#E31E2E]">&#8377;{bk.price}</span>
                                {bk.badge && (
                                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded capitalize">
                                    {bk.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-slate-500 text-sm">
                          No books found for <span className="font-semibold text-slate-700">"{searchInput}"</span>
                        </div>
                      )}
                    </div>

                    {!isSearching && suggestions.length > 0 && (
                      <div
                        onClick={handleSearchSubmit}
                        className="p-3.5 bg-slate-50 hover:bg-slate-100/80 text-center text-xs font-bold text-[#E31E2E] uppercase tracking-wider cursor-pointer border-t border-slate-100 hover:text-[#E31E2E]/90 transition-colors"
                      >
                        View all results for "{searchInput}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions (Login/Sign Up, Bookshelf, Cart) - visible on desktop (lg and up) */}
            <div className="hidden lg:flex items-center gap-6">

              {/* Bookshelf Widget */}
              <motion.button
                onClick={() => navigate("/bookshelf")}
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#E31E2E] transition cursor-pointer font-semibold text-sm relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={bounceBookshelf ? { scale: [1, 1.25, 0.9, 1.08, 1] } : {}}
                onAnimationComplete={() => setBounceBookshelf(false)}
                transition={{ duration: 0.4 }}
              >
                <div className="relative">
                  <Heart className={`w-5.5 h-5.5 transition-colors ${bookshelfItems.length > 0 ? "fill-[#E31E2E] text-[#E31E2E]" : "text-gray-500"}`} />
                  {bookshelfItems.length > 0 && (
                    <motion.span
                      key={bookshelfItems.length}
                      className="absolute -top-2 -right-2 bg-[#E31E2E] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    >
                      {bookshelfItems.length}
                    </motion.span>
                  )}
                </div>
                <span>Bookshelf</span>
              </motion.button>

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


            </div>

            {/* Mobile/Tablet Actions (Heart, Cart, Profile User icon) - visible under lg */}
            <div className="lg:hidden flex items-center gap-4">

              {/* Heart/Bookshelf Icon */}
              <motion.button
                onClick={() => navigate("/bookshelf")}
                className="text-gray-700 p-1 cursor-pointer hover:text-[#E31E2E] transition-colors relative flex items-center justify-center"
                aria-label="Bookshelf"
                whileTap={{ scale: 0.95 }}
                animate={bounceBookshelf ? { scale: [1, 1.25, 0.9, 1.08, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Heart className={`w-5.5 h-5.5 transition-colors ${bookshelfItems.length > 0 ? "fill-[#E31E2E] text-[#E31E2E]" : "text-gray-600"}`} />
                {bookshelfItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#E31E2E] text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white">
                    {bookshelfItems.length}
                  </span>
                )}
              </motion.button>

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
        <div ref={mobileSearchRef} className="lg:hidden border-b border-gray-100 bg-white pb-3.5 px-4 sm:px-6 relative">
          <div className="max-w-7xl mx-auto relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              {/* Input */}
              <input
                type="text"
                placeholder="Search books, authors, ISBN..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => { if (e.key === "Escape") setShowSuggestions(false); }}
                className="w-full pl-10 pr-[120px] py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E31E2E] focus:ring-1 focus:ring-[#E31E2E]/20 transition-all shadow-sm"
              />
              {/* Search button (left) */}
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={15} />
              </button>

              {/* Category selector (right) */}
              <div ref={mobileCategoryDropdownRef} className="absolute right-0 top-0 bottom-0 flex items-center">
                <span className="w-px h-5 bg-gray-200" />
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen((o) => !o)}
                  className="flex items-center gap-1 px-3 h-full text-xs font-semibold text-gray-600 rounded-r-lg focus:outline-none whitespace-nowrap"
                >
                  <span className="max-w-[70px] truncate">{selectedCategory || "All"}</span>
                  <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Category popover */}
                {categoryDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                    {SEARCH_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          const val = cat === "All Categories" ? "" : cat;
                          setCategoryDropdownOpen(false);
                          setSearchInput("");
                          setShowSuggestions(false);
                          if (val) {
                            navigate(`/search?query=${encodeURIComponent(val)}`);
                          }
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          selectedCategory === (cat === "All Categories" ? "" : cat)
                            ? "bg-[#E31E2E]/5 text-[#E31E2E] font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Suggestions dropdown for mobile */}
            <AnimatePresence>
              {showSuggestions && searchInput.trim().length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-left max-h-[350px] flex flex-col font-sans"
                >
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {isSearching ? (
                      <div className="p-6 flex items-center justify-center gap-3 text-slate-500 text-sm">
                        <svg className="animate-spin h-5 w-5 text-[#E31E2E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Searching books...</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((bk) => (
                        <div
                          key={bk.id}
                          onClick={() => handleSuggestionClick(bk.id)}
                          className="flex items-center gap-3.5 p-3 hover:bg-slate-50 cursor-pointer group transition-colors"
                        >
                          <div className="w-10 h-14 bg-slate-100 rounded-md overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                            <img
                              src={bk.imageURL}
                              alt={bk.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-[#E31E2E] transition-colors">
                              {bk.title}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">by {bk.author}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-[#E31E2E]">&#8377;{bk.price}</span>
                              {bk.badge && (
                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded capitalize">
                                  {bk.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-500 text-sm">
                        No books found for <span className="font-semibold text-slate-700">"{searchInput}"</span>
                      </div>
                    )}
                  </div>

                  {!isSearching && suggestions.length > 0 && (
                    <div
                      onClick={handleSearchSubmit}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/80 text-center text-xs font-bold text-[#E31E2E] uppercase tracking-wider cursor-pointer border-t border-slate-100 hover:text-[#E31E2E]/90 transition-colors"
                    >
                      View all results for "{searchInput}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
                onClick={() => navigate("/bestsellers")}
                className="hover:text-[#E31E2E] transition cursor-pointer py-1.5 uppercase font-bold text-[13px] text-gray-700"
              >
                Best Sellers
              </button>

              {/* New Arrivals */}
              <button
                onClick={() => navigate("/new-arrivals")}
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
                    navigate("/bestsellers");
                  }}
                  className="block w-full text-left py-1 hover:text-[#E31E2E] cursor-pointer"
                >
                  Best Sellers
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/new-arrivals");
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
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/about");
                  }}
                  className="block w-full text-left py-1 hover:text-[#E31E2E] cursor-pointer"
                >
                  About Us
                </button>
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
