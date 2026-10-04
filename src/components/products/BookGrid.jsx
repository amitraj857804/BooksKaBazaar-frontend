import { motion } from "framer-motion";
import BookCard from "./BookCard";
import SkeletonCard from "./SkeletonCard";

/**
 * BookGrid — full-page responsive book grid using the shared BookCard.
 *
 * Props
 * ─────
 * books       – array of book objects
 * isLoading   – show skeleton placeholders
 * onAddToCart – legacy external handler (BookCard handles it internally)
 * title       – section heading
 * subtitle    – section sub-heading
 * eyebrow     – tiny label above the heading
 * badge       – forwarded to every BookCard (e.g. "TRENDING")
 * badgeColor  – forwarded to every BookCard
 */
const BookGrid = ({
  books = [],
  isLoading = false,
  onAddToCart,
  title = "Browse the Collection",
  subtitle = "Explore our curated selection of books",
  eyebrow = "",
  badge,
  badgeColor,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  const displayItems = isLoading ? Array(12).fill(null) : books;

  return (
    <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">

        {/* Section Header */}
        <div className="mb-7 sm:mb-9 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            {eyebrow && (
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#E31E2E] mb-2">
                {eyebrow}
              </p>
            )}
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-1 h-7 rounded-full flex-shrink-0 bg-[#E31E2E]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                {title}
              </h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed ml-4">{subtitle}</p>
          </div>
        </div>

        {/* Grid — flex-wrap so fixed-width cards tile naturally */}
        <motion.div
          className="flex flex-wrap gap-3.5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayItems.map((book, index) =>
            isLoading ? (
              <motion.div key={index} variants={itemVariants} className="flex-shrink-0 w-[132px] sm:w-[150px]">
                <SkeletonCard index={index} />
              </motion.div>
            ) : (
              <motion.div key={book.id} variants={itemVariants}>
                <BookCard
                  book={book}
                  onAddToCart={onAddToCart}
                  badge={badge}
                  badgeColor={badgeColor}
                />
              </motion.div>
            )
          )}
        </motion.div>

        {/* Empty state */}
        {!isLoading && books.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No books available at the moment.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BookGrid;
