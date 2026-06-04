import { motion } from "framer-motion";
import BookCard from "./BookCard";
import SkeletonCard from "./SkeletonCard";

const BookGrid = ({ books = [], isLoading = false, onAddToCart }) => {
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
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Discover Our Collection
          </h2>
          <p className="text-gray-600 text-lg">
            Explore our carefully curated selection of books
          </p>
        </div>

        {/* Book Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayItems.map((book, index) =>
            isLoading ? (
              <motion.div key={index} variants={itemVariants}>
                <SkeletonCard />
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
