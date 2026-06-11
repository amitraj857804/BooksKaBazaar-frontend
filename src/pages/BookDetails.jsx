import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, ArrowLeft, Star, Calendar, Building, Barcode, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { wishlistApi } from "../services/user/wishlistApi";
import { publicApi } from "../services/public/publicApi";
import { addToBookshelf, removeFromBookshelf } from "../store/bookshelfSlice";
import { useCart } from "../hooks/useCart";
import { useFlyToCart } from "../hooks/useFlyToCart";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, openAuthModal } = useAuth();
  
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [particles, setParticles] = useState([]);
  const addToCartButtonRef = useRef(null);
  
  const { bookshelfItems } = useSelector((state) => state.bookshelf);
  const { handleFlyToCart } = useFlyToCart();
  const { addToCart } = useCart();
  
  const numericBookId = parseInt(bookId, 10);
  const isInWishlist = bookshelfItems.some((item) => item.id === numericBookId);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setIsLoading(true);
        const response = await publicApi.getBookById(numericBookId);
        
        let bookData = null;
        if (response && response.success && response.data) {
          bookData = response.data;
        } else if (response && response.data) {
          bookData = response.data;
        } else {
          bookData = response;
        }

        if (bookData) {
          setBook({
            id: bookData.bookId,
            title: bookData.bookTitle,
            author: bookData.authorName,
            isbn: bookData.isbn,
            description: bookData.description,
            category: bookData.category,
            publisher: bookData.publisher,
            publicationYear: bookData.publicationYear,
            price: parseFloat(bookData.price) || 0,
            totalStock: bookData.totalStock,
            availableStock: bookData.availableStock,
            imageURL: bookData.imageFileName
              ? `${API_BASE_URL}/public/books/${bookData.bookId}/image`
              : "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=400&h=600&fit=crop",
          });
        } else {
          toast.error("Book details not found");
          navigate("/");
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
        toast.error("Failed to load book details");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [numericBookId, navigate]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      openAuthModal("login");
      return;
    }

    try {
      const bookPayload = {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        imageURL: book.imageURL,
        badge: book.category,
      };

      if (isInWishlist) {
        dispatch(removeFromBookshelf(book.id));
        await wishlistApi.remove(book.id);
        toast.success("Removed from Bookshelf");
      } else {
        // Generate particles
        const newParticles = Array.from({ length: 6 }).map((_, i) => ({
          id: Math.random(),
          destX: (Math.random() - 0.5) * 60, // -30 to 30
          destY: -80 - Math.random() * 60,  // -80 to -140
          scale: 0.6 + Math.random() * 0.7,
          delay: Math.random() * 0.15,
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);

        dispatch(addToBookshelf(bookPayload));
        await wishlistApi.add(book.id);
        toast.success("Added to Bookshelf!");
      }
    } catch (err) {
      console.warn("⚠️ Syncing wishlist with backend failed, using local state: ", err.message);
    }
  };

  const handleAddToCart = () => {
    if (!book) return;
    
    const cartItem = {
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      imageURL: book.imageURL,
      quantity: 1,
    };

    // Trigger fly-to-cart animation
    handleFlyToCart(cartItem, addToCartButtonRef.current);
    
    // Add to cart (handles guest/db sync)
    addToCart(book);
    toast.success("Added to Cart!");
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
              <div className="md:col-span-4 h-[450px] bg-gray-200 rounded-2xl"></div>
              <div className="md:col-span-8 space-y-6">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-10 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-20 w-full bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  const isOutOfStock = book.availableStock <= 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#E31E2E] transition-colors mb-8 group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Bookstore</span>
        </button>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 md:p-10 relative overflow-hidden">
          {/* Visual Left Column */}
          <div className="md:col-span-4 flex flex-col items-center">
            {/* Book Cover Container with floating animations */}
            <motion.div 
              className="relative aspect-[3/4] w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 group border border-gray-100"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <img
                src={book.imageURL}
                alt={book.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=400&h=600&fit=crop";
                }}
                className="w-full h-full object-cover"
              />

              {/* Wishlist Heart overlay */}
              <div className="absolute top-4 left-4 z-20">
                <motion.button
                  onClick={handleWishlistToggle}
                  className="p-2.5 rounded-full bg-white/95 text-gray-400 hover:text-red-500 transition-all shadow-lg cursor-pointer relative flex items-center justify-center"
                  aria-label={isInWishlist ? "Remove from Bookshelf" : "Add to Bookshelf"}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                >
                  <Heart 
                    size={18} 
                    className={`transition-colors duration-200 ${
                      isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`} 
                  />
                  {/* Floating heart particles */}
                  <AnimatePresence>
                    {particles.map((p) => (
                      <motion.span
                        key={p.id}
                        className="absolute pointer-events-none select-none text-sm"
                        initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                        animate={{ 
                          x: p.destX, 
                          y: p.destY, 
                          opacity: [1, 0.8, 0], 
                          scale: p.scale 
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          duration: 0.8, 
                          ease: "easeOut",
                          delay: p.delay 
                        }}
                      >
                        ❤️
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Stock Status Pill */}
              <div className="absolute bottom-4 left-4">
                {isOutOfStock ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide">
                    <AlertCircle size={12} />
                    Out Of Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide">
                    <CheckCircle2 size={12} />
                    In Stock
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Details Right Column */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              {/* Category Badge */}
              {book.category && (
                <span className="inline-block px-3 py-1 bg-red-50 text-[#E31E2E] rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-red-100/30">
                  {book.category}
                </span>
              )}

              {/* Title & Author */}
              <h1 className="text-3xl sm:text-4xl font-serif font-black text-gray-900 leading-tight mb-2 tracking-tight">
                {book.title}
              </h1>
              <p className="text-lg text-gray-500 font-medium mb-5">
                by <span className="text-gray-800 font-semibold">{book.author}</span>
              </p>

              {/* Ratings and Reviews (Design Mockup) */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">4.8 / 5.0</span>
                <span className="text-xs text-gray-400 font-semibold border-l border-gray-200 pl-4">Verified Customer Reviews</span>
              </div>

              {/* Price Banner */}
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 mb-8 flex items-baseline gap-2.5 max-w-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">${book.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-[#E31E2E]" />
                  About This Book
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-normal max-w-3xl">
                  {book.description || "No description available for this book."}
                </p>
              </div>

              {/* Specifications/Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-gray-100 py-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 text-gray-500 rounded-xl">
                    <Barcode size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">ISBN</span>
                    <span className="text-xs font-extrabold text-gray-700">{book.isbn || "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 text-gray-500 rounded-xl">
                    <Building size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Publisher</span>
                    <span className="text-xs font-extrabold text-gray-700">{book.publisher || "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 text-gray-500 rounded-xl">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Published Year</span>
                    <span className="text-xs font-extrabold text-gray-700">{book.publicationYear || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full">
              <motion.button
                ref={addToCartButtonRef}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                  isOutOfStock 
                    ? "bg-gray-300 shadow-none cursor-not-allowed" 
                    : "bg-[#E31E2E] hover:bg-red-700 hover:shadow-lg hover:shadow-red-100"
                }`}
                whileHover={isOutOfStock ? {} : { scale: 1.02 }}
                whileTap={isOutOfStock ? {} : { scale: 0.98 }}
              >
                <ShoppingCart size={18} />
                <span>{isOutOfStock ? "Out of Stock" : "Add to Shopping Cart"}</span>
              </motion.button>

              <motion.button
                onClick={handleWishlistToggle}
                className={`py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all border cursor-pointer ${
                  isInWishlist
                    ? "bg-red-50 text-[#E31E2E] border-red-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart size={18} className={isInWishlist ? "fill-red-500 text-red-500" : ""} />
                <span>{isInWishlist ? "In Bookshelf" : "Save to Bookshelf"}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;
