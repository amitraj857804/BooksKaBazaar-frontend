import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useFlyToCart } from "../../hooks/useFlyToCart";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToBookshelf, removeFromBookshelf } from "../../store/bookshelfSlice";
import { useAuth } from "../../context/AuthContext";
import { wishlistApi } from "../../services/user/wishlistApi";
import { useCart } from "../../hooks/useCart";

const BookCard = ({ book, onAddToCart }) => {
  const { title, author, price, imageURL, category, badge } = book;
  const buttonRef = useRef(null);
  const { handleFlyToCart } = useFlyToCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { cartItems } = useCart();

  const [particles, setParticles] = useState([]);
  const { bookshelfItems } = useSelector((state) => state.bookshelf);
  const isInWishlist = bookshelfItems.some((item) => item.id === book.id);
  const isInCart = cartItems.some((item) => item.id === book.id);

  // Fallbacks for rating and reviews to match the premium design
  const rating = book.rating || 5;
  const reviewCount = book.reviewsCount || ((book.id * 7) % 5) + 2;

  // Calculate pricing values based on ₹ (Rupees)
  const currentPrice = price;
  const originalPrice = Math.round(currentPrice * 1.45);
  const discountPercent = ((originalPrice - currentPrice) / originalPrice * 100).toFixed(2);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal("login");
      return;
    }

    try {
      if (isInWishlist) {
        dispatch(removeFromBookshelf(book.id));
        await wishlistApi.remove(book.id);
      } else {
        // Generate particles
        const newParticles = Array.from({ length: 6 }).map((_, i) => ({
          id: Math.random(),
          destX: (Math.random() - 0.5) * 50, // -25 to 25
          destY: -80 - Math.random() * 50,  // -80 to -130
          scale: 0.5 + Math.random() * 0.7,
          delay: Math.random() * 0.15,
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 1000);

        dispatch(addToBookshelf(book));
        await wishlistApi.add(book.id);
      }
    } catch (err) {
      console.warn("⚠️ Syncing wishlist with backend failed, using local state: ", err.message);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      navigate("/cart");
    } else {
      // Trigger fly-to-cart animation
      handleFlyToCart(book, buttonRef.current);
      // Call callback if provided
      onAddToCart?.(book);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="group h-full cursor-pointer max-w-[240px] sm:max-w-none mx-auto w-full flex flex-col justify-between bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden p-3.5"
      onClick={() => {
        navigate(`/book/${book.id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <div className="flex flex-col gap-3">
        {/* Fixed-height cover container to keep sizes consistent across different grid layouts */}
        <div className="relative overflow-hidden bg-gray-50 w-full h-[190px] sm:h-[210px] md:h-[230px] rounded-xl border border-gray-100/30">
          <img
            src={imageURL}
            alt={title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=300&h=450&fit=crop";
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {(category || badge) && (
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#E31E2E] text-white rounded text-[9px] font-black uppercase tracking-wider shadow-xs z-10">
              {category || badge}
            </span>
          )}
        </div>

        {/* Info Block */}
        <div className="flex flex-col space-y-1">
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-gray-500 font-bold">
            <span>{rating} / 5 ({reviewCount})</span>
            <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[#E31E2E] transition-colors leading-snug">
            {title}
          </h3>

          {/* Author */}
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider truncate">
            {author}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-sm sm:text-base font-black text-gray-900">
              ₹{currentPrice.toFixed(0)}
            </span>
            <span className="text-[10px] font-semibold text-gray-400 line-through">
              ₹{originalPrice.toFixed(0)}
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              ({discountPercent}%)
            </span>
          </div>

          {/* Delivery Banner */}
          
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-2 mt-4 pt-1">
        {/* Wishlist Heart Button */}
        <motion.button
          onClick={handleWishlistToggle}
          className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:border-red-200 text-gray-400 hover:text-[#E31E2E] transition-all flex items-center justify-center cursor-pointer shrink-0 relative shadow-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isInWishlist ? "Remove from Bookshelf" : "Add to Bookshelf"}
        >
          <Heart
            size={18}
            className={`transition-colors duration-200 ${
              isInWishlist ? "fill-red-500 text-red-500 border-none" : "text-gray-400"
            }`}
          />
          {/* Floating heart particles */}
          <AnimatePresence>
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute pointer-events-none select-none text-[10px]"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: p.destX,
                  y: p.destY,
                  opacity: [1, 0.8, 0],
                  scale: p.scale,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: p.delay,
                }}
              >
                ❤️
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.button>

        {/* Go to Cart / Add to Cart Button */}
        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="flex-1 h-10 rounded-xl font-black text-xs text-white flex items-center justify-center gap-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-red-50 bg-[#E31E2E] hover:bg-red-700 cursor-pointer shadow-sm uppercase tracking-wide"
        >
          <span>{isInCart ? "Go to Cart" : "Add to Cart"}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BookCard;
