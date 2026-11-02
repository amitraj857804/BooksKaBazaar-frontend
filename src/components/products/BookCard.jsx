import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useFlyToCart } from "../../hooks/useFlyToCart";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToBookshelf, removeFromBookshelf } from "../../store/bookshelfSlice";
import { useAuth } from "../../context/AuthContext";
import { wishlistApi } from "../../services/user/wishlistApi";
import { useCart } from "../../hooks/useCart";

/**
 * BookCard — uniform card used across Home strips, BookGrid, search results, etc.
 *
 * Props
 * ─────
 * book          – book data object
 * onAddToCart   – optional external handler (legacy)
 * badge         – override label shown on the cover corner (e.g. "TRENDING", "NEW")
 * badgeColor    – CSS color string for the badge background (default: #E31E2E)
 * stripMode     – kept for backward-compat; layout is always the same now
 */
const BookCard = ({ book, onAddToCart, badge, badgeColor = "#E31E2E" }) => {
  const { title, author, price, imageURL, category } = book;

  const buttonRef = useRef(null);
  const { handleFlyToCart } = useFlyToCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { cartItems, addToCart } = useCart();

  const [particles, setParticles] = useState([]);
  const { bookshelfItems } = useSelector((state) => state.bookshelf);
  const isInWishlist = bookshelfItems.some((item) => item.id === book.id);
  const isInCart = cartItems.some((item) => item.id === book.id);

  // ── Pricing ────────────────────────────────────────────────────────────────
  const currentPrice = parseFloat(price) || 0;
  const originalPrice = book.originalPrice ?? Math.round(currentPrice * 1.45);
  const discountPct =
    originalPrice > 0
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  // ── Delivery date (3–4 days from today) ────────────────────────────────────
  const deliveryDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  })();

  // ── Resolved badge ─────────────────────────────────────────────────────────
  const resolvedBadge = badge ?? (category || book.badge) ?? null;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { openAuthModal("login"); return; }

    try {
      if (isInWishlist) {
        dispatch(removeFromBookshelf(book.id));
        await wishlistApi.remove(book.id);
      } else {
        const newParticles = Array.from({ length: 6 }).map(() => ({
          id: Math.random(),
          destX: (Math.random() - 0.5) * 50,
          destY: -80 - Math.random() * 50,
          scale: 0.5 + Math.random() * 0.7,
          delay: Math.random() * 0.15,
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);
        dispatch(addToBookshelf(book));
        await wishlistApi.add(book.id);
      }
    } catch (err) {
      console.warn("⚠️ Wishlist sync failed:", err.message);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      navigate("/cart");
    } else {
      handleFlyToCart(book, buttonRef.current);
      addToCart(book);
    }
  };

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      onClick={handleCardClick}
      className="flex-shrink-0 w-[160px] sm:w-[175px] cursor-pointer group flex flex-col bg-white  rounded-xl  transition-shadow duration-200"
    >
      {/* ── Cover ── */}
      <div className="relative w-full h-[200px] sm:h-[200px] rounded-t-xl flex items-center justify-center px-5 overflow-hidden bg-white">
        <img
          src={imageURL}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=300&h=450&fit=crop";
          }}
          className="h-[90%] w-full object-contain transition-transform duration-500 group-hover:scale-105"
          style={{ boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.18)" }}
        />

        {/* Badge — top-left */}
        {resolvedBadge && (
          <span
            className="absolute top-2 left-2 px-1.5 py-0.5 text-white text-[8px] font-black uppercase tracking-wider rounded shadow-sm z-10"
            style={{ background: badgeColor }}
          >
            {resolvedBadge}
          </span>
        )}

      </div>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 px-2.5  pb-2.5 ">
        {/* Title */}
        <p className="text-[13px] sm:text-[13px] font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#E31E2E] transition-colors">
          {title}
        </p>

        {/* Author */}
        <p className="text-[12px] text-gray-500 font-medium truncate">{author}</p>

        {/* Sold by */}
        <p className="text-[12px] text-gray-400 truncate">Sold by <span className="font-semibold text-gray-500">Books Ka Bazaar</span></p>

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-[15px] font-black text-gray-900">₹{currentPrice.toFixed(0)}</span>
          {originalPrice > currentPrice && (
            <>
              <span className="text-[13px] font-medium text-gray-400 line-through">₹{originalPrice}</span>
              <span className="text-[13px] font-bold text-[#E31E2E]">({discountPct}%)</span>
            </>
          )}
        </div>

        {/* Delivery */}
        <p className="text-[12px] text-gray-400 mt-0.5">
          Delivery by <span className="font-medium text-gray-600">{deliveryDate}</span>
        </p>

        {/* ── Action row: heart + Add to Cart ── */}
        <div className="flex items-center gap-1.5 mt-2">
          {/* Wishlist heart button */}
          <motion.button
            onClick={handleWishlistToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            aria-label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`relative flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
              isInWishlist
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200 hover:border-red-300 hover:bg-red-50"
            }`}
          >
            <Heart
              size={16}
              className={`transition-colors duration-200 ${
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-400"
              }`}
            />
            {/* Heart particle burst */}
            <AnimatePresence>
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute pointer-events-none select-none text-[10px]"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{ x: p.destX, y: p.destY, opacity: [1, 0.8, 0], scale: p.scale }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: p.delay }}
                >
                  ❤️
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.button>

          {/* Add to Cart button */}
          <motion.button
            ref={buttonRef}
            onClick={handleAddToCart}
            whileTap={{ scale: 0.96 }}
            className="flex-1 h-8 rounded-lg bg-[#E31E2E] hover:bg-red-700 text-white text-[10px] font-black flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm"
          >
            <ShoppingCart size={10} />
            {isInCart ? "Go to Cart" : "Add to Cart"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
