import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, ArrowLeft, Star, Calendar, Building, Barcode, CheckCircle2, AlertCircle, BookOpen, Share2, MapPin, ShieldCheck, CreditCard, Truck, Leaf, ThumbsUp, Flag, ChevronRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { wishlistApi } from "../services/user/wishlistApi";
import { publicApi } from "../services/public/publicApi";
import { addToBookshelf, removeFromBookshelf } from "../store/bookshelfSlice";
import { useCart } from "../hooks/useCart";
import { useFlyToCart } from "../hooks/useFlyToCart";
import toast from "react-hot-toast";
import BookReviews from "../components/products/BookReviews";
import AuthorBooks from "../components/products/AuthorBooks";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, openAuthModal } = useAuth();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [particles, setParticles] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const addToCartButtonRef = useRef(null);

  const { bookshelfItems } = useSelector((state) => state.bookshelf);
  const { handleFlyToCart } = useFlyToCart();
  const { addToCart, cartItems, updateQty, removeItemFromCart } = useCart();

  const numericBookId = parseInt(bookId, 10);
  const isInWishlist = bookshelfItems.some((item) => item.id === numericBookId);
  const cartItem = cartItems.find((item) => item.id === numericBookId);

  // Delivery states
  const [pincode, setPincode] = useState("122009");
  const [isEditingPincode, setIsEditingPincode] = useState(false);
  const [tempPincode, setTempPincode] = useState("");
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 33, seconds: 46 });

  // Tabs state
  const [activeTab, setActiveTab] = useState("description");

  // Reviews state
  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewerName: "Sarthak",
      rating: 5,
      date: "June 11, 2026",
      comment: "good book",
      helpfulCount: 2,
      reported: false,
    },
    {
      id: 2,
      reviewerName: "User",
      rating: 5,
      date: "April 27, 2026",
      comment: "Highly recommended for literature enthusiasts. The pacing is perfect.",
      helpfulCount: 0,
      reported: false,
    }
  ]);

  // Recommendations state
  const [authorBooks, setAuthorBooks] = useState([]);

  // Timer Effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diffMs = endOfDay - now;
      if (diffMs <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Recommendations Effect
  useEffect(() => {
    const fetchAuthorBooks = async () => {
      if (!book) return;
      try {
        const response = await publicApi.getAllBooks();
        let allBooks = [];
        if (response && response.success && response.data) {
          allBooks = response.data;
        } else if (response && response.data) {
          allBooks = response.data;
        } else if (Array.isArray(response)) {
          allBooks = response;
        }

        const mappedBooks = allBooks.map((b) => ({
          id: b.bookId,
          title: b.bookTitle,
          author: b.authorName,
          price: parseFloat(b.price) || 0,
          category: b.category,
          imageURL: b.imageFileName
            ? `${API_BASE_URL}/public/books/${b.bookId}/image`
            : "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=400&h=600&fit=crop",
        }));

        let filtered = mappedBooks.filter(
          (b) => b.author === book.author && b.id !== book.id
        );

        if (filtered.length === 0) {
          filtered = mappedBooks.filter(
            (b) => b.category === book.category && b.id !== book.id
          );
        }

        if (filtered.length === 0) {
          filtered = mappedBooks.filter((b) => b.id !== book.id);
        }

        setAuthorBooks(filtered.slice(0, 8));
      } catch (err) {
        console.warn("Failed to fetch author books recommendations:", err);
      }
    };

    fetchAuthorBooks();
  }, [book]);

  const handleApplyPincode = () => {
    if (tempPincode.trim().length === 6) {
      setPincode(tempPincode);
      setIsEditingPincode(false);
      toast.success(`Pincode updated to ${tempPincode}`);
    } else {
      toast.error("Please enter a valid 6-digit pincode");
    }
  };

  const handleHelpfulClick = (id) => {
    setReviews(
      reviews.map((r) =>
        r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
    toast.success("Thanks for your feedback!");
  };

  const handleReportClick = (id) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, reported: true } : r))
    );
    toast("Review reported to administrators.", { icon: "🚩" });
  };

  const handleNewReviewSubmit = (name, rating, comment) => {
    const newReview = {
      id: Math.random(),
      reviewerName: name,
      rating: rating,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      comment: comment,
      helpfulCount: 0,
      reported: false,
    };

    setReviews([newReview, ...reviews]);
    toast.success("Review submitted successfully!");
  };

  // Review Stats
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

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
          const imgUrl = bookData.imageFileName
            ? `${API_BASE_URL}/public/books/${bookData.bookId}/image`
            : "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=400&h=600&fit=crop";

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
            imageURL: imgUrl,
          });

          setActiveImage(imgUrl);
          setThumbnails([
            imgUrl,
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
            "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop",
            "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
          ]);
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

  const handleBuyNow = async () => {
    if (!book) return;
    await addToCart(book);
    navigate("/cart");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  };

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
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pb-16">
        <Navbar />
        <div className="max-w-[1360px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            {/* Breadcrumb skeleton */}
            <div className="h-4 w-36 bg-gray-200 rounded-md"></div>
            
            {/* Header row skeleton */}
            <div className="flex justify-between items-center pb-5 border-b border-gray-200">
              <div className="space-y-2">
                <div className="h-8 w-44 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-72 bg-gray-200 rounded-md"></div>
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-lg"></div>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-12 gap-8 lg:gap-12 pt-2">
              <div className="md:col-span-4 w-full max-w-[200px] md:max-w-[320px] aspect-[3/4] bg-gray-200 rounded-2xl mx-auto md:mx-0"></div>
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

  const currentPrice = book.price;
  // Mark up by ~45% to simulate standard retail pricing original MRP
  const originalPrice = Math.round(currentPrice * 1.45);
  const discountPercentage = ((originalPrice - currentPrice) / originalPrice) * 100;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <Navbar />

      <main className="max-w-[1360px] mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-6 uppercase tracking-wider">
          <span className="hover:text-[#E31E2E] cursor-pointer transition" onClick={() => navigate("/")}>Home</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-[#E31E2E]">{book?.category || "Book Details"}</span>
        </div>

        <div className="flex items-center justify-between pb-5 border-b border-gray-200 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Book Details</h1>
            <p className="text-sm text-gray-500 mt-1">
              Explore description, specifications, and reviews of the book.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#E31E2E] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Go Back</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col md:grid md:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 md:p-10 relative overflow-hidden">
          {/* Visual Left Column */}
          <div className="md:col-span-4 flex flex-col items-center">
            {/* Book Cover Container with floating animations */}
            <motion.div
              className="relative aspect-[3/4] w-full max-w-[200px] md:max-w-[320px] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 group border border-gray-100"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <img
                src={activeImage || book.imageURL}
                alt={book.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=400&h=600&fit=crop";
                }}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Horizontal Thumbnails Row (centered and matching the cover width) */}
            <div className="flex gap-2.5 mt-4 overflow-x-auto py-1 scrollbar-none justify-center w-full max-w-[200px] md:max-w-[320px]">
              {thumbnails.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-9 h-12 sm:w-11 sm:h-14 rounded-lg overflow-hidden cursor-pointer shadow-xs transition-all duration-200 border-2 shrink-0 ${activeImage === img ? "border-[#E31E2E] scale-102 shadow-sm" : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details Right Column */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div className="space-y-3.5">

              {/* Title & Wishlist Row */}
              <div className="flex items-start gap-4">
                <motion.button
                  onClick={handleWishlistToggle}
                  className="mt-1.5 p-3 rounded-full border border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-all cursor-pointer relative flex items-center justify-center shrink-0"
                  aria-label={isInWishlist ? "Remove from Bookshelf" : "Save to Bookshelf"}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart
                    size={20}
                    className={`transition-colors duration-200 ${isInWishlist ? "fill-red-500 text-red-500 border-none" : "text-gray-500"
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

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 leading-tight tracking-tight">
                    {book.title}
                  </h1>
                </div>
              </div>

              {/* Author Row */}
              <p className="text-base font-semibold text-gray-500 -mt-5 ml-16">
                by <span className="text-gray-800 underline decoration-gray-400 hover:text-[#E31E2E] hover:decoration-[#E31E2E] transition-colors cursor-pointer">{book.author}</span>
              </p>

              {/* Badges & Share Row */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  {/* English badge */}
                  <span className="px-3.5 py-1.5 border border-gray-200 bg-white text-gray-600 rounded-lg text-xs font-extrabold uppercase tracking-wider shadow-sm">
                    ENGLISH
                  </span>
                  {/* Rating badge */}
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold text-gray-700 shadow-sm">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span>{averageRating} <span className="text-gray-400 font-semibold">({reviews.length})</span></span>
                  </div>
                </div>
                {/* Share button */}
                <motion.button
                  onClick={handleShare}
                  className="p-2.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-[#E31E2E] hover:border-red-100 shadow-sm cursor-pointer"
                  title="Share book link"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Share2 size={16} />
                </motion.button>
              </div>

              {/* Format & Price Row */}
              <div className="space-y-1">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Paperback</p>
                <div className="flex items-baseline flex-wrap gap-2.5">
                  <span className="text-3xl font-black text-[#E31E2E]">₹{currentPrice.toFixed(0)}</span>
                  <span className="text-sm font-semibold text-gray-400 line-through">₹{originalPrice.toFixed(0)}</span>
                  <span className="text-sm font-black text-emerald-600 uppercase tracking-wide">{discountPercentage.toFixed(2)}% OFF</span>
                  <span className="text-xs text-gray-400 font-semibold self-center ml-1">(All inclusive*)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1 lg:w-[75%] ">
                {cartItem ? (
                  <>
                    {/* Quantity Selector */}
                    <div className="flex-1 md:h-14 py-4 flex items-center justify-between bg-[#E31E2E] text-white rounded-xl px-6 font-black text-sm shadow-md">
                      <button
                        onClick={() => {
                          if (cartItem.quantity === 1) {
                            removeItemFromCart(cartItem);
                          } else {
                            updateQty(cartItem, cartItem.quantity - 1);
                          }
                        }}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer flex items-center justify-center select-none text-lg font-bold w-8 h-8"
                      >
                        -
                      </button>
                      <span className="text-base select-none w-8 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => updateQty(cartItem, cartItem.quantity + 1)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer flex items-center justify-center select-none text-lg font-bold w-8 h-8"
                      >
                        +
                      </button>
                    </div>

                    {/* Go to Cart Button */}
                    <motion.button
                      onClick={() => navigate("/cart")}
                      className="flex-1 md:h-14 py-4 px-6 rounded-xl font-black text-sm border border-[#E31E2E] text-[#E31E2E] bg-white hover:bg-red-50/50 flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>GO TO CART</span>
                      <span className="text-lg font-bold">→</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      ref={addToCartButtonRef}
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`flex-1 md:h-14 py-4 px-6 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${isOutOfStock
                        ? "bg-gray-300 shadow-none cursor-not-allowed"
                        : "bg-[#E31E2E] hover:bg-red-700 hover:shadow-lg hover:shadow-red-100"
                        }`}
                      whileHover={isOutOfStock ? {} : { scale: 1.02 }}
                      whileTap={isOutOfStock ? {} : { scale: 0.98 }}
                    >
                      <ShoppingCart size={18} />
                      <span>{isOutOfStock ? "Out of Stock" : "ADD TO CART"}</span>
                    </motion.button>

                    <motion.button
                      onClick={handleBuyNow}
                      disabled={isOutOfStock}
                      className={`flex-1 md:h-14 py-4 px-6 rounded-xl font-black text-sm border flex items-center justify-center gap-2.5 transition-all cursor-pointer ${isOutOfStock
                        ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                        : "border-[#E31E2E] text-[#E31E2E] bg-white hover:bg-red-50/50"
                        }`}
                      whileHover={isOutOfStock ? {} : { scale: 1.02 }}
                      whileTap={isOutOfStock ? {} : { scale: 0.98 }}
                    >
                      <span>BUY NOW</span>
                    </motion.button>
                  </>
                )}
              </div>



              {/* Delivery Options Section */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">DELIVERY OPTIONS</h3>

                {/* Pincode display / change */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-500 shrink-0" />
                  {isEditingPincode ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempPincode}
                        onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="border border-gray-300 rounded-xl px-3 py-1 text-xs w-28 focus:outline-none focus:border-[#E31E2E]"
                        placeholder="122009"
                      />
                      <button
                        onClick={handleApplyPincode}
                        className="text-xs font-bold text-[#E31E2E] hover:underline cursor-pointer"
                      >
                        APPLY
                      </button>
                      <button
                        onClick={() => setIsEditingPincode(false)}
                        className="text-xs text-gray-400 hover:underline cursor-pointer"
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">{pincode}</span>
                      <button
                        onClick={() => {
                          setTempPincode(pincode);
                          setIsEditingPincode(true);
                        }}
                        className="text-[#E31E2E] font-bold text-xs hover:underline cursor-pointer uppercase tracking-wider"
                      >
                        CHANGE
                      </button>
                    </div>
                  )}
                </div>



                {/* Small disclaimer */}
                <p className="text-sm text-gray-400 leading-normal font-medium max-w-lg">
                  *COD & Shipping Charges may apply on certain items. Review final details at checkout.
                </p>
              </div>
            </div>
          </div>

          {/* About The Book Tabbed Section (Full Width) */}
          <div className="col-span-12 space-y-6 pt-6 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-700 font-serif">About The Book</h2>
            <div className="flex items-center gap-6 border-b border-gray-100 pb-2">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-2 text-sm font-semibold transition-all relative cursor-pointer ${activeTab === "description" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                Description
                {activeTab === "description" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E31E2E]"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("author")}
                className={`pb-2 text-sm font-semibold transition-all relative cursor-pointer ${activeTab === "author" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                Author
                {activeTab === "author" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E31E2E]"
                  />
                )}
              </button>
            </div>

            <div className="min-h-[30px]">
              {activeTab === "description" ? (
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-medium max-w-5xl">
                    {book.description || "An unforgettable literary work that captures readers with its immersive characters and captivating storyline."}
                  </p>

                 
                </div>

              ) : (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-gray-800">{book.author}</h4>
                 
                </div>
              )}
            </div>
            {/* Details banner block */}
            <div className="bg-gray-100 border border-gray-200/50 py-4 px-6 mt-10 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 tracking-wide leading-relaxed">
              <span className="font-bold text-gray-900">ISBN 13</span> - {book.isbn || "9781526678720"}{" "}
              <span className="text-gray-500 px-1.5">|</span>{" "}
              <span className="font-bold text-gray-900">Publication Date</span> - {book.publicationYear ? `12-05-${book.publicationYear}` : "26-03-2026"}{" "}
              <span className="text-gray-500 px-1.5">|</span>{" "}
              <span className="font-bold text-gray-900">Pages</span> - {((book.id * 17) % 200) + 200}{" "}
              <span className="text-gray-500 px-1.5">|</span>{" "}
              <span className="font-bold text-gray-900">Weight</span> - {((book.id * 13) % 150) + 200} grams{" "}
              <span className="text-gray-500 px-1.5">|</span>{" "}
              <span className="font-bold text-gray-900">Dimensions</span> - 129x198x22.13 mm{" "}
              <span className="text-gray-500 px-1.5">|</span>{" "}
              <span className="font-bold text-gray-900">Publisher</span> -{" "}
              <span className="text-blue-600 underline cursor-pointer hover:text-blue-800 font-bold">
                {book.publisher || "Bloomsbury Publishing India Pvt Ltd"}
              </span>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 text-center mt-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="md:w-24 md:h-24 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-orange-500 bg-orange-50/20">
                  <ShieldCheck className="w-6 h-6 md:w-12 md:h-12" />
                </div>
                <span className="text-xs font-bold text-gray-700">Piracy-free</span>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="md:w-24 md:h-24 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-orange-500 bg-orange-50/20">
                  <Star className="w-6 h-6 md:w-12 md:h-12" />
                </div>
                <span className="text-xs font-bold text-gray-700">Assured Quality</span>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="md:w-24 md:h-24 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-orange-500 bg-orange-50/20">
                  <CreditCard className="w-6 h-6 md:w-12 md:h-12" />
                </div>
                <span className="text-xs font-bold text-gray-700">Secure Transactions</span>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="md:w-24 md:h-24 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-orange-500 bg-orange-50/20">
                  <Truck className="w-6 h-6 md:w-12 md:h-12" />
                </div>
                <span className="text-xs font-bold text-gray-700">Fast Delivery</span>
              </div>

              <div className="flex flex-col items-center space-y-2 col-span-2 sm:col-span-1">
                <div className="md:w-24 md:h-24 w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-orange-500 bg-orange-50/20">
                  <Leaf className="w-6 h-6 md:w-12 md:h-12" />
                </div>
                <span className="text-xs font-bold text-gray-700">Sustainably Printed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings & Reviews Section */}
        <BookReviews
          reviews={reviews}
          onHelpfulClick={handleHelpfulClick}
          onReportClick={handleReportClick}
          onSubmitReview={handleNewReviewSubmit}
        />

        {/* More Books By The Author */}
        <AuthorBooks authorBooks={authorBooks} />
      </main>
    </div>
  );
};

export default BookDetails;
