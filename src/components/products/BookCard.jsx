import { motion } from "framer-motion";
import { useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { useFlyToCart } from "../../hooks/useFlyToCart";

const BookCard = ({ book, onAddToCart }) => {
  const { title, author, price, imageURL, badge } = book;
  const buttonRef = useRef(null);
  const { handleFlyToCart } = useFlyToCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
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
    >
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-lg"
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
