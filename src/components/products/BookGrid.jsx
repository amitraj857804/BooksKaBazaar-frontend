import { motion } from "framer-motion";
import BookCard from "./BookCard";
import SkeletonCard from "./SkeletonCard";

const BookGrid = ({
  books = [],
  isLoading = false,
  onAddToCart,
  title = "Browse the Collection",
  subtitle = "Explore our curated selection of books",
  eyebrow = "",
}) => {
  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Show skeleton loaders while loading
  const displayItems = isLoading ? Array(6).fill(null) : books;

  return (
    <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">

        {/* Section Header */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            {/* Eyebrow label */}
            {eyebrow && (
              <p
                className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#E31E2E] mb-2"
              >
                {eyebrow}
              </p>
            )}
            {/* Red rule + heading inline */}
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-1 h-7 rounded-full flex-shrink-0" style={{ background: "#E31E2E" }} />
              <h2
                className="font-serif text-2xl sm:text-3xl font-black text-gray-900 leading-tight tracking-tight"
              >
                {title}
              </h2>
            </div>
            <p
              className="font-sans text-gray-500 text-sm leading-relaxed ml-4"
            >
              {subtitle}
            </p>
          </div>


        </div>

        {/* Book Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayItems.map((book, index) =>
            isLoading ? (
              <motion.div key={index} variants={itemVariants}>
                <SkeletonCard index={index} />
              </motion.div>
            ) : (
              <motion.div key={book.id} variants={itemVariants}>
                <BookCard
                  book={book}
                  onAddToCart={onAddToCart}
                />
              </motion.div>
            )
          )}
        </motion.div>

        {/* Empty State */}
        {!isLoading && books.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">
              No books available at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BookGrid;
