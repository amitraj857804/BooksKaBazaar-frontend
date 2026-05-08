import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Hero from "../features/landing/Hero";
import { BookGrid } from "../components/products";
import { mockBooks } from "../utils/mockBooks";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setBooks(mockBooks);
      setIsLoading(false);
    }, 1500); // Simulate 1.5s loading time

    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (book) => {
    console.log("Added to cart:", book);
    // TODO: Implement cart functionality
  };

  // Page container animation
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-50 min-h-screen"
    >
      <Navbar />
      <Hero />
      <BookGrid
        books={books}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
      />
    </motion.div>
  );
};

export default Home;
