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
 * BookCard — shared card used on Home strips, BookGrid, search results, etc.
 *
 * Props
 * ─────
 * book          – book data object
 * onAddToCart   – optional external handler (legacy; internal handler takes precedence)
 * badge         – override label shown on the cover corner (e.g. "TRENDING", "NEW")
 * badgeColor    – CSS color string for the badge background (default: #E31E2E)
 * stripMode     – when true the card has a fixed narrow width for horizontal strips
 */
const BookCard = ({ book, onAddToCart, badge, badgeColor = "#E31E2E", stripMode = false }) => {
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

  // Pricing
  const currentPrice = parseFloat(price) || 0;
  const originalPrice = book.originalPrice ?? Math.round(currentPrice * 1.45);
  const discountPct = originalPrice > 0
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Resolved badge: prop > book.category
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
        // Heart particle burst
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

  // ── Uniform fixed dimensions — identical in strip & grid ──────────────────
  // w-[132px]/w-[150px] matches the homepage horizontal strip exactly.
  // Both strip and grid use the same values so cards look identical everywhere.
  const coverH  = "h-[185px] sm:h-[210px]";
  const wrapperW = "flex-shrink-0 w-[132px] sm:w-[150px]";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      onClick={handleCardClick}
      className={`${wrapperW} cursor-pointer group flex flex-col`}
    >
      {/* ── Cover ── */}
      <div className={`relative overflow-hidden bg-gray-50 w-full ${coverH} rounded-2xl border border-gray-100 shadow-sm`}>
        <img
          src={imageURL}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=300&h=450&fit=crop";
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

        {/* Wishlist — top-right, visible on hover */}
        <motion.button
          onClick={handleWishlistToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isInWishlist ? "Remove from Bookshelf" : "Add to Bookshelf"}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all cursor-pointer z-10 relative ${
            isInWishlist ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart
            size={13}
            className={`transition-colors duration-200 ${
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
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

        {/* Subtle dark gradient at bottom for depth */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* ── Info ── */}
      <div className="mt-2.5 flex flex-col flex-1 px-0.5">
        {/* Title */}
        <p className="text-[12px] sm:text-[13px] font-bold text-gray-900 line-clamp-1 group-hover:text-[#E31E2E] transition-colors leading-snug">
          {title}
        </p>

        {/* Author */}
        <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{author}</p>

        {/* Pricing */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[13px] font-black text-gray-900">₹{currentPrice.toFixed(0)}</span>
          {originalPrice > currentPrice && (
            <>
              <span className="text-[10px] font-medium text-gray-400 line-through">₹{originalPrice}</span>
              <span className="text-[9px] font-bold text-emerald-600">-{discountPct}%</span>
            </>
          )}
        </div>

        {/* Add to Cart — slides in on hover */}
        <motion.button
          ref={buttonRef}
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          className="mt-2.5 w-full h-8 rounded-xl bg-[#E31E2E] hover:bg-red-700 text-white text-[10px] font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 shadow-sm"
        >
          <ShoppingCart size={11} />
          {isInCart ? "Go to Cart" : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BookCard;
