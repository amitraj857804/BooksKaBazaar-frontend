import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Carousel from "../components/common/Carousel";
import { BookGrid } from "../components/products";
import { publicApi } from "../services/public/publicApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all books from backend
  useEffect(() => {
    const getBooks = async () => {
      try {
        setIsLoading(true);
        const data = await publicApi.getAllBooks();
        
        let booksArray = [];
        if (data && Array.isArray(data)) {
          booksArray = data;
        } else if (data && data.success && Array.isArray(data.data)) {
          booksArray = data.data;
        } else if (data && Array.isArray(data.data)) {
          booksArray = data.data;
        }

        const mappedBooks = booksArray.map((book) => ({
          id: book.bookId,
          title: book.bookTitle,
          author: book.authorName,
          price: parseFloat(book.price) || 0,
          imageURL: book.imageFileName 
            ? `${API_BASE_URL}/public/books/${book.bookId}/image`
            : "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop",
          badge: book.category || null,
          isbn: book.isbn,
          description: book.description,
          totalStock: book.totalStock,
          availableStock: book.availableStock,
          reservedStock: book.reservedStock,
          damagedStock: book.damagedStock,
        }));

        setBooks(mappedBooks);
      } catch (error) {
        console.error("❌ Failed to fetch public books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getBooks();
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
      <Carousel isLoading={isLoading} />
      <div id="book-collection-section">
        <BookGrid
          books={books}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
        />
      </div>
    </motion.div>
  );
};

export default Home;
