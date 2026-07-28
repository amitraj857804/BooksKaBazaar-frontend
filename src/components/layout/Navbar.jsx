import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { useFlyToCartContext } from "../../context/FlyToCartContext";
import { useNavigate, useSearchParams, Link, NavLink } from "react-router-dom";
import { wishlistApi } from "../../services/user/wishlistApi";
import { setBookshelfItems, clearBookshelf } from "../../store/bookshelfSlice";
import { clearCart } from "../../store/cartSlice";
import { useCart } from "../../hooks/useCart";
import { useDebounce } from "../../hooks/useDebounce";
import { publicApi } from "../../services/public/publicApi";
import {
  Search, ShoppingCart, Menu, X, Store, BookOpen, Heart, SquareLibrary,
  PackageSearch, Book, Settings, MapPinHouse, LockKeyhole, ChevronDown,
  Sparkles, User, Package, TrendingUp, FileText, LogIn, UserPlus,
  LogOut, Trophy, Star, SquarePen
} from "lucide-react";




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
const catalogLinks = [
  {
    label: "Best Sellers",
    path: "/bestsellers",
    image: "/badge.png",
  },
  {
    label: "New Arrivals",
    path: "/new-arrivals",
    icon: Sparkles,
  },
  {
    label: "Award Winners",
    path: "/award-winners",
    icon: Trophy,
  },
  {
    label: "Popular & Favourite",
    path: "/popular",
    icon: Star,
  },
  {
    label: "Trending",
    path: "/trending",
    icon: TrendingUp,
  },
  {
    label: "eBooks & PDFs",
    path: "/ebooks",
    icon: FileText,
  },
  {
    label: "Old/Used Books",
    path: "/old-used",
    icon: Book,
  },
  {
    label: "Reading Room",
    icon: BookOpen,
    dropdown: [
      {
        label: "News, Views & Analysis",
        path: "/reading-room/news-views-analysis",
      },
      {
        label: "Current Affairs",
        path: "/reading-room/current-affairs",
      },
      {
        label: "General Studies",
        path: "/reading-room/general-studies",
      },
      {
        label: "Quiz",
        path: "/reading-room/quiz",
      },
      {
        label: "Toppers Strategy",
        path: "/reading-room/toppers-strategy",
      },
    ],
  },
  {
    label: "Blogs",
    path: "/blogs",
    icon: SquarePen,
  },
];

const Navbar = () => {
  const { openAuthModal, user, logoutUser } = useAuth();
  const isLoggedIn = !!user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bounceCart, setBounceCart] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef(null);
  const mobileAccountDropdownRef = useRef(null);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const mobileCategoryDropdownRef = useRef(null);
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const dispatch = useDispatch();


  const MotionNavLink = motion(NavLink);
  const [readingRoomOpen, setReadingRoomOpen] = useState(false);

  // Derive selected category directly from the URL — no state sync needed
  const urlQuery = urlSearchParams.get("query") || "";
  const urlCategory = urlSearchParams.get("category") || "";
  const selectedCategory = urlCategory || (SEARCH_CATEGORIES.slice(1).includes(urlQuery) ? urlQuery : "");

  // Pending category: null = untouched, "" = user picked All Categories, other = specific category
  const [pendingCategory, setPendingCategory] = useState(null);

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

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!accountDropdownRef.current?.contains(e.target)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []); useEffect(() => {
    const handler = (e) => {
      const insideDesktop = accountDropdownRef.current?.contains(e.target);
      const insideMobile = mobileAccountDropdownRef.current?.contains(e.target);
      if (!insideDesktop && !insideMobile) {
        setAccountDropdownOpen(false);
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
    // pendingCategory: null = untouched, "" = All Categories, string = specific category
    // selectedCategory comes from the current URL
    const activeCat = pendingCategory !== null ? pendingCategory : selectedCategory;
    const cat = activeCat && activeCat !== "All Categories" ? activeCat : "";
    if (searchInput.trim()) {
      const url = cat
        ? `/search?query=${encodeURIComponent(searchInput.trim())}&category=${encodeURIComponent(cat)}`
        : `/search?query=${encodeURIComponent(searchInput.trim())}`;
      navigate(url);
      setShowSuggestions(false);
    } else if (cat) {
      navigate(`/search?query=${encodeURIComponent(cat)}`);
      setShowSuggestions(false);
    } else {
      // No input + All Categories or nothing — show all books
      navigate(`/search?query=all`);
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
            <Link
              to="/"
              className="shrink-0 font-black sm:text-2xl text-lg tracking-tighter cursor-pointer select-none flex items-center gap-1 justify-start lg:justify-start flex-1 lg:flex-initial"
            >
              <img
                src="/1.1 Primary - BKB Complete Logo PNG without Background SVG File.svg"
                alt="Books Ka Bazaar"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Search Bar */}
            <div ref={desktopSearchRef} className="hidden lg:flex flex-1 max-w-2xl mx-8 items-start gap-2">
              <div className="relative flex-1">
                <form onSubmit={handleSearchSubmit} className="flex items-center w-full border border-gray-200 rounded-md shadow-sm bg-white focus-within:border-[#E31E2E] focus-within:ring-1 focus-within:ring-[#E31E2E]/20 transition-all">

                  {/* Search icon */}
                  <div className="pl-3 shrink-0 text-gray-400">
                    <Search size={15} />
                  </div>

                  {/* Text input — fills remaining space */}
                  <input
                    type="text"
                    placeholder="Search by Title, Author, Publisher or ISBN..."
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setShowSuggestions(false);
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearchSubmit(e);
                      }
                    }}
                    className="flex-1 min-w-0 pl-2 pr-2 py-2.5 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />

                  {/* Category selector — inline sibling, never overlaps */}
                  <div ref={categoryDropdownRef} className="relative flex items-center shrink-0 border-l border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCategoryDropdownOpen((o) => !o)}
                      className="flex items-center gap-2 px-3 h-full py-2.5 w-[140px] text-xs font-semibold text-gray-600 cursor-pointer focus:outline-none whitespace-nowrap"
                    >
                      <span className="truncate flex-1 text-left">
                        {pendingCategory !== null
                          ? (pendingCategory || "All Categories")
                          : (selectedCategory || "All Categories")}
                      </span>
                      <ChevronDown size={12} className={`text-gray-400 shrink-0 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Category popover */}
                    <AnimatePresence>
                      {categoryDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scaleY: 0.92 }}
                          animate={{ opacity: 1, y: 0, scaleY: 1 }}
                          exit={{ opacity: 0, y: -8, scaleY: 0.92 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          style={{ transformOrigin: "top" }}
                          className="absolute right-0 top-full mt-1 w-[160px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                        >
                          {SEARCH_CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setPendingCategory(cat === "All Categories" ? "" : cat);
                                setCategoryDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${(pendingCategory !== null ? pendingCategory : selectedCategory) === (cat === "All Categories" ? "" : cat)
                                ? "bg-[#E31E2E]/5 text-[#E31E2E] font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </form>

                {/* Suggestions dropdown */}
                <AnimatePresence>
                  {showSuggestions && searchInput.trim().length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-left max-h-[420px] flex flex-col font-sans"
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
                                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop"; }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-[#E31E2E] transition-colors">{bk.title}</h4>
                                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">by {bk.author}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-bold text-[#E31E2E]">&#8377;{bk.price}</span>
                                  {bk.badge && (
                                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded capitalize">{bk.badge}</span>
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

              {/* Desktop Search Button */}
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="bg-[#E31E2E] cursor-pointer hover:bg-[#c41a27] active:bg-[#a8151f] text-white text-sm font-semibold px-6 py-[11px] rounded-md transition-all duration-200 shrink-0 shadow-sm hover:shadow-md"
                aria-label="Search"
              >
                Search
              </button>
            </div>

            {/* Actions - visible on desktop (lg and up) */}
            <div className="hidden lg:flex items-center gap-3">

              {/* Bookshelf Widget — icon top, label bottom */}
              <MotionNavLink
                to="/bookshelf"
                className="flex flex-col items-center gap-0.5 text-gray-700 hover:scale-[1.05] hover:text-[#E31E2E] transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SquareLibrary className="w-6 h-6 -rotate-90" />
                <span className="text-[11px] font-semibold">Bookshelf</span>
              </MotionNavLink>

              {/* Shopping Cart — icon top, label bottom */}
              <MotionNavLink
                ref={cartIconRef}
                to="/cart"
                className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-[#E31E2E] transition cursor-pointer relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={bounceCart ? { scale: [1, 1.15, 0.95, 1.03, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
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
                <span className="text-[11px] font-semibold">Cart</span>
              </MotionNavLink>

              {/* Orders / Track Order — icon top, label bottom */}
              <MotionNavLink
                to="/track-order"
                className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-[#E31E2E] transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PackageSearch className="w-6 h-6" />
                <span className="text-[11px] font-semibold">Track Orders</span>
              </MotionNavLink>
              {/* Divider */}
              <div className="h-9 w-px bg-gray-200 mx-1" />

              {/* Become Seller — outlined red button */}
              <Link
                to="/seller"
                className="flex items-center gap-2 px-4 py-2 border-2 border-[#E31E2E] text-[#E31E2E] rounded-lg font-bold text-sm hover:bg-[#E31E2E]/5 transition cursor-pointer whitespace-nowrap"
              >
                <Store size={16} />
                Sell With Us
              </Link>

              {/* Account Dropdown */}
              <div ref={accountDropdownRef} className="relative">
                <button
                  onClick={() => setAccountDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#E31E2E] text-white rounded-lg font-bold text-sm hover:bg-[#c41a27] transition cursor-pointer whitespace-nowrap shadow-sm"
                >
                  <User size={16} />
                  <span>Account</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${accountDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {accountDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scaleY: 0.92 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -8, scaleY: 0.92 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: "top" }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden"
                    >
                      {!isLoggedIn ? (
                        <>
                          <button
                            onClick={() => { console.log("Login clck"); openAuthModal("login"); setAccountDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#E31E2E] transition cursor-pointer"
                          >
                            <LogIn size={15} />
                            Login
                          </button>
                          <button
                            onClick={() => { openAuthModal("signup"); setAccountDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#E31E2E] transition cursor-pointer"
                          >
                            <UserPlus size={15} />
                            Sign Up
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-2.5 ">
                            <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.fullName || "User"}</p>
                          </div>
                          <div className="h-px bg-gray-200 mx-4" />
                          {[
                            { label: "Your Account", icon: <User size={15} />, path: "/profile" },
                            { label: "Personal Settings", icon: <Settings size={15} />, path: "/profile" },
                            { label: "Your Orders", icon: <Package size={15} />, path: "/profile" },
                            { label: "Your Wishlist", icon: <Heart size={15} />, path: "/wishlist" },
                            { label: "Your Addresses", icon: <MapPinHouse size={15} />, path: "/profile" },
                            { label: "Change Password", icon: <LockKeyhole size={15} />, path: "/changepassword" },
                          ].map(({ label, icon, path }) => (
                            <Link
                              key={label}
                              to={path}
                              onClick={() => setAccountDropdownOpen(false)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#E31E2E] transition cursor-pointer"
                            >
                              {icon}
                              {label}
                            </Link>
                          ))}

                          <div className="h-px bg-gray-200 mx-4" />
                          <button
                            onClick={() => { logoutUser(); setAccountDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition cursor-pointer"
                          >
                            <LogOut size={15} />
                            Logout
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Mobile/Tablet Actions (Heart, Cart, Profile User icon) - visible under lg */}
            <div className="lg:hidden flex items-center gap-3">

              {/* Heart/Bookshelf Icon */}
              <MotionNavLink
                to="/bookshelf"
                className="text-gray-700 p-1 cursor-pointer hover:text-[#E31E2E] transition-colors relative flex items-center justify-center"
                aria-label="Bookshelf"
                whileTap={{ scale: 0.95 }}
                animate={bounceBookshelf ? { scale: [1, 1.25, 0.9, 1.08, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <SquareLibrary className="w-6 h-6 -rotate-90" />
                {bookshelfItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#E31E2E] text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white">
                    {bookshelfItems.length}
                  </span>
                )}
              </MotionNavLink>

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
              {/*Track orders*/}
              <motion.button
                onClick={() => navigate("/track-order")}
                className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-[#E31E2E] transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PackageSearch className="w-6 h-6" />
              </motion.button>


              {/* Account Dropdown */}
              <div ref={mobileAccountDropdownRef} className="relative ">
                <button
                  onClick={() => setAccountDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg transition cursor-pointer whitespace-nowrap"
                >
                  {isLoggedIn ? (
                    <div className="w-8 h-8 rounded-full bg-[#E31E2E]/10 border border-[#E31E2E]/20 text-[#E31E2E] flex items-center justify-center font-bold text-sm uppercase shadow-sm hover:bg-[#E31E2E] hover:text-white hover:border-transparent transition-all duration-200">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                  ) : (
                    <User size={20} className="text-gray-600 hover:text-[#E31E2E]" />
                  )}
                </button>

                <AnimatePresence>
                  {accountDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scaleY: 0.92 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -8, scaleY: 0.92 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: "top" }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-[99999] py-1.5 overflow-hidden"
                    >
                      {!isLoggedIn ? (
                        <>
                          <button
                            onClick={() => { openAuthModal("login"); setAccountDropdownOpen(false); }}
                            className="w-full  flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#E31E2E] transition cursor-pointer"
                          >
                            <LogIn size={15} />
                            Login
                          </button>
                          <button
                            onClick={() => { openAuthModal("signup"); setAccountDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#E31E2E] transition cursor-pointer"
                          >
                            <UserPlus size={15} />
                            Sign Up
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="px-4 py-2.5 ">
                            <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.fullName || "User"}</p>
                          </div>
                          <div className="h-px bg-gray-200 mx-4" />
                          {[
                            { label: "Your Account", icon: <User size={15} />, path: "/profile" },
                            { label: "Personal Settings", icon: <Settings size={15} />, path: "/profile" },
                            { label: "Your Orders", icon: <Package size={15} />, path: "/profile" },
                            { label: "Your Wishlist", icon: <Heart size={15} />, path: "/wishlist" },
                            { label: "Your Addresses", icon: <MapPinHouse size={15} />, path: "/profile" },
                            { label: "Change Password", icon: <LockKeyhole size={15} />, path: "/changepassword" },
                          ].map(({ label, icon, path }) => (
                            <Link
                              key={label}
                              to={path}
                              onClick={() => setAccountDropdownOpen(false)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#E31E2E] transition cursor-pointer"
                            >
                              {icon}
                              {label}
                            </Link>
                          ))}

                          <div className="h-px bg-gray-200 mx-4" />
                          <button
                            onClick={() => { logoutUser(); setAccountDropdownOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition cursor-pointer"
                          >
                            <LogOut size={15} />
                            Logout
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
                placeholder="Search By Title, Author, Publisher Or ISBN..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => { if (e.key === "Escape") setShowSuggestions(false); }}
                className="w-full pl-8 pr-[110px] py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E31E2E] focus:ring-1 focus:ring-[#E31E2E]/20 transition-all shadow-sm"
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
                  <span className="max-w-[60px] truncate">
                    {pendingCategory !== null
                      ? (pendingCategory || "All Categories")
                      : (selectedCategory || "All Categories")}
                  </span>
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
                          // Just update the label — search triggers only on submit
                          setPendingCategory(cat === "All Categories" ? "" : cat);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${(pendingCategory !== null ? pendingCategory : selectedCategory) === (cat === "All Categories" ? "" : cat)
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

        {/* Tier 4: Catalog Sub-header Links & Dropdowns */}
        <div className="hidden lg:block border-b border-gray-100 bg-white py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[13px] font-bold text-gray-700 uppercase tracking-wide">
            <div className="flex items-center gap-6">
              {catalogLinks.map(({ label, path, icon: Icon, image, dropdown }) =>
                dropdown ? (
                  <div
                    key={label}
                    className="relative group"
                    onMouseEnter={() => setReadingRoomOpen(true)}
                    onMouseLeave={() => setReadingRoomOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setReadingRoomOpen((prev) => !prev)}
                      className="hover:text-[#E31E2E] transition cursor-pointer py-1.5 uppercase font-bold text-[13px] text-gray-700 flex items-center gap-1.5"
                    >
                      {image ? (
                        <img src={image} alt={label} className="w-4 h-4" />
                      ) : (
                        <Icon size={14} />
                      )}

                      {label}

                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${readingRoomOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    <div
                      className={`absolute left-0 top-full mt-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 ${readingRoomOpen
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                        }`}
                    >
                      {dropdown.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setReadingRoomOpen(false)}
                          className="block px-4 py-3 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-[#E31E2E] first:rounded-t-lg last:rounded-b-lg"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={path}
                    to={path}
                    className="hover:text-[#E31E2E] transition cursor-pointer py-1.5 uppercase font-bold text-[13px] text-gray-700 flex items-center gap-1.5"
                  >
                    {image ? (
                      <img src={image} alt={label} className="w-4 h-4" />
                    ) : (
                      <Icon size={14} />
                    )}

                    {label}
                  </Link>
                )
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
                {catalogLinks.map(({ label, path, icon: Icon, image }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-1 hover:text-[#E31E2E] cursor-pointer flex items-center gap-2"
                  >
                    {image ? (
                      <img src={image} alt={label} className="w-4 h-4" />
                    ) : (
                      Icon && <Icon size={14} />
                    )}
                    <span>{label}</span>
                  </Link>
                ))}

                {!isLoggedIn && (
                  <Link
                    to="/seller"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-1 hover:text-[#E31E2E] cursor-pointer flex items-center gap-2"
                  >
                    <Store size={16} />
                    <span>Sell With Us</span>
                  </Link>
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
