import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import BookCard from "../components/products/BookCard";
import { removeFromBookshelf, setBookshelfItems } from "../store/bookshelfSlice";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { wishlistApi } from "../services/user/wishlistApi";
import { useCart } from "../hooks/useCart";

const Bookshelf = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { addToCart } = useCart();
  const { bookshelfItems } = useSelector((state) => state.bookshelf);

  // Fetch wishlist from backend on load
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
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
        console.warn("⚠️ Fetching wishlist from backend failed: ", err.message);
      }
    };
    fetchWishlist();
  }, [user, dispatch]);

  const handleAddToCart = (book) => {
    addToCart(book);
  };

  const handleRemove = async (bookId) => {
    try {
      dispatch(removeFromBookshelf(bookId));
      await wishlistApi.remove(bookId);
    } catch (err) {
      console.warn("⚠️ Syncing wishlist removal failed: ", err.message);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-grow pb-16">
          <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-50 text-[#E31E2E] rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Heart size={28} className="text-[#E31E2E] animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Login to See Your Bookshelf</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Unlock your personal bookshelf to save, track, and purchase the books you love. Sign in to sync your wishlist across all devices.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => openAuthModal("login")}
                  className="w-full py-3 bg-[#E31E2E] hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md shadow-red-100 transition duration-200 cursor-pointer"
                >
                  Sign In / Login
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl text-sm transition duration-200 cursor-pointer"
                >
                  Explore Bookstore
                </button>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow pb-16">
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Navigation Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-6 uppercase tracking-wider">
            <span className="hover:text-[#E31E2E] cursor-pointer transition" onClick={() => navigate("/")}>Home</span>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="text-[#E31E2E]">My Bookshelf</span>
          </div>

          <div className="flex items-center justify-between pb-5 border-b border-gray-200 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Bookshelf</h1>
              <p className="text-sm text-gray-500 mt-1">
                You have {bookshelfItems.length} {bookshelfItems.length === 1 ? "book" : "books"} saved in your wishlist.
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

          <AnimatePresence mode="popLayout">
            {bookshelfItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-xl mx-auto mt-8"
              >
                <div className="w-16 h-16 bg-red-50 text-[#E31E2E] rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <Heart size={28} className="text-[#E31E2E]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Your Bookshelf is Empty</h2>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Add books to your personal collection while browsing our catalog. Save your favorites to read, review, or purchase later.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-[#E31E2E] text-white font-bold rounded-xl text-sm hover:bg-red-700 hover:shadow-lg shadow-red-100 transition duration-200 cursor-pointer"
                >
                  Browse Catalog
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6"
              >
                {bookshelfItems.map((book) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <BookCard book={book} onAddToCart={handleAddToCart} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Bookshelf;
