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
      className="group h-full cursor-pointer"
    >
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-lg"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-200 h-64 sm:h-72">
          <img
            src={imageURL}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badge */}
          {badge && (
            <div
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wide shadow-md"
              style={{ backgroundColor: "#E31E2E" }}
            >
              {badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col grow">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
            {title}
          </h3>

          {/* Author */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">
            by {author}
          </p>

          {/* Price */}
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            ${price.toFixed(2)}
          </p>

          {/* Add to Cart Button */}
          <motion.button
            ref={buttonRef}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full py-2.5 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg mt-auto"
            style={{ backgroundColor: "#E31E2E" }}
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
