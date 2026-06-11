import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useFlyToCart } from "../../hooks/useFlyToCart";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToBookshelf, removeFromBookshelf } from "../../store/bookshelfSlice";
import { useAuth } from "../../context/AuthContext";
import { wishlistApi } from "../../services/user/wishlistApi";

const BookCard = ({ book, onAddToCart }) => {
  const { title, author, price, imageURL, badge } = book;
  const buttonRef = useRef(null);
  const { handleFlyToCart } = useFlyToCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  
  const [particles, setParticles] = useState([]);
  const { bookshelfItems } = useSelector((state) => state.bookshelf);
  const isInWishlist = bookshelfItems.some((item) => item.id === book.id);

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
    // Trigger fly-to-cart animation
    handleFlyToCart(book, buttonRef.current);
    // Call callback if provided
    onAddToCart?.(book);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className="group h-full cursor-pointer max-w-[220px] sm:max-w-none mx-auto w-full"
      onClick={() => navigate(`/book/${book.id}`)}
    >
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-lg relative"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-200 aspect-[3/4] w-full max-h-[180px] sm:max-h-[200px] md:max-h-[220px]">
          <img
            src={imageURL}
            alt={title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop";
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Wishlist Toggle Button Overlay */}
          <div className="absolute top-2 left-2 z-20">
            <motion.button
              onClick={handleWishlistToggle}
              className="p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 transition-all shadow-md cursor-pointer relative flex items-center justify-center"
              aria-label={isInWishlist ? "Remove from Bookshelf" : "Add to Bookshelf"}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
            >
              <Heart 
                size={14} 
                className={`transition-colors duration-200 ${
                  isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
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

          {/* Badge */}
          {badge && (
            <div
              className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wide shadow-md"
              style={{ backgroundColor: "#E31E2E" }}
            >
              {badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-4 flex flex-col grow">
          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors h-10 sm:h-12 overflow-hidden">
            {title}
          </h3>

          {/* Author */}
          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
            by {author}
          </p>

          {/* Price */}
          <p className="text-base sm:text-lg font-bold text-gray-900 mb-3">
            ${price.toFixed(2)}
          </p>

          {/* Add to Cart Button */}
          <motion.button
            ref={buttonRef}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full py-2 px-3 rounded-lg font-semibold text-xs sm:text-sm text-white flex items-center justify-center gap-1.5 transition-all duration-300 hover:shadow-lg mt-auto"
            style={{ backgroundColor: "#E31E2E" }}
          >
            <ShoppingCart size={15} />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
