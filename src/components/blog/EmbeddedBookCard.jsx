import { motion } from "framer-motion";
import { Star, ShoppingCart, BookOpen, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import toast from "react-hot-toast";

/**
 * EmbeddedBookCard
 * A compact book card designed to sit inside blog posts.
 *
 * Props:
 *   book          — { id, title, author, price, imageURL, rating, category }
 *   hasActivePass — boolean
 */
const EmbeddedBookCard = ({ book, hasActivePass = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleBuy = (e) => {
    e.stopPropagation();
    addToCart({ ...book, quantity: 1 });
    toast.success(`"${book.title}" added to cart!`, { icon: "📦" });
  };

  const handleRead = (e) => {
    e.stopPropagation();
    if (hasActivePass) {
      navigate(`/reading-room/reader/${book.id}`);
    } else {
      navigate("/reading-room");
    }
  };

  const stars = Math.round(book.rating || 4);

  return (
    <motion.div
      whileHover={{ y: -2, shadow: "lg" }}
      className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all my-6"
    >
      {/* Cover */}
      <div
        className="w-20 h-28 rounded-xl overflow-hidden shrink-0 shadow-sm cursor-pointer"
        onClick={() => navigate(`/book/${book.id}`)}
      >
        <img
          src={book.imageURL}
          alt={book.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop";
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {book.category && (
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-1.5">
              {book.category}
            </span>
          )}
          <h4
            className="font-black text-gray-900 text-sm leading-tight mb-0.5 cursor-pointer hover:text-[#E31E2E] transition-colors"
            onClick={() => navigate(`/book/${book.id}`)}
          >
            {book.title}
          </h4>
          <p className="text-xs text-gray-500 font-medium mb-2">by {book.author}</p>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < stars ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
              />
            ))}
            <span className="text-[10px] text-gray-400 font-semibold ml-1">({book.rating || "4.0"})</span>
          </div>

          <p className="text-base font-black text-[#E31E2E]">₹{book.price}</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleBuy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E31E2E] hover:bg-red-700 text-white text-[11px] font-black transition-colors cursor-pointer"
          >
            <ShoppingCart size={11} />
            Buy Physical
          </button>
          <button
            onClick={handleRead}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-colors cursor-pointer ${
              hasActivePass
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            {hasActivePass ? <BookOpen size={11} /> : <Lock size={11} />}
            {hasActivePass ? "Read Now" : "Get Pass"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmbeddedBookCard;
