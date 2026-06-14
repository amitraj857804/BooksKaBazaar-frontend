import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { BookGrid } from "../components/products";
import { publicApi } from "../services/public/publicApi";
import { Trophy, Sparkles } from "lucide-react";
import { useCart } from "../hooks/useCart";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const Bestsellers = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setIsLoading(true);
        let booksArray = [];
        try {
          // Attempt to fetch from dedicated Bestsellers endpoint
          const data = await publicApi.getBestsellers();
          if (data && Array.isArray(data)) {
            booksArray = data;
          } else if (data && data.success && Array.isArray(data.data)) {
            booksArray = data.data;
          } else if (data && Array.isArray(data.data)) {
            booksArray = data.data;
          }
        } catch (apiError) {
          console.warn("⚠️ Dedicated Bestsellers API not available or failed. Falling back to filtering all books:", apiError.message);
          
          // Fallback: Fetch all books and filter on the frontend
          const allData = await publicApi.getAllBooks();
          let allBooksArray = [];
          if (allData && Array.isArray(allData)) {
            allBooksArray = allData;
          } else if (allData && allData.success && Array.isArray(allData.data)) {
            allBooksArray = allData.data;
          } else if (allData && Array.isArray(allData.data)) {
            allBooksArray = allData.data;
          }

          // Filter for books that are bestsellers based on category, title, or description
          booksArray = allBooksArray.filter((book) => {
            const category = (book.category || "").toLowerCase();
            const title = (book.bookTitle || "").toLowerCase();
            const desc = (book.description || "").toLowerCase();
            return (
              category.includes("bestseller") ||
              category.includes("classic") ||
              category.includes("popular") ||
              title.includes("gatsby") || // Gatsby is a mock classic/bestseller
              title.includes("mockingbird")
            );
          });

          // If no books match, use a slice of the main catalog as default bestsellers
          if (booksArray.length === 0) {
            booksArray = allBooksArray.slice(0, 4);
          }
        }

        const mappedBooks = booksArray.map((book) => ({
          id: book.bookId || book.id,
          title: book.bookTitle || book.title,
          author: book.authorName || book.author,
          price: parseFloat(book.price) || 0,
          imageURL: book.imageFileName
            ? `${API_BASE_URL}/public/books/${book.bookId || book.id}/image`
            : book.imageURL || "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop",
          badge: book.category || book.badge || "Bestseller",
          isbn: book.isbn,
          description: book.description,
          totalStock: book.totalStock,
          availableStock: book.availableStock,
          reservedStock: book.reservedStock,
          damagedStock: book.damagedStock,
        }));

        setBooks(mappedBooks);
      } catch (error) {
        console.error("❌ Failed to fetch bestsellers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  const handleAddToCart = (book) => {
    addToCart(book);
  };

  // Page entry animation
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-50 min-h-screen flex flex-col"
    >
      <Navbar />

      <div className="flex-grow">
        {/* Hero Banner Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 py-16 text-white shadow-lg">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E31E2E]/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none transform -translate-x-1/4 translate-y-1/4"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E31E2E]/20 border border-[#E31E2E]/30 text-[#E31E2E] text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Trophy size={14} className="text-[#E31E2E]" />
              <span>Top of the Charts</span>
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white mb-4"
            >
              Bestselling <span className="text-[#E31E2E]">Books</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg lg:text-xl font-medium leading-relaxed"
            >
              Explore our all-time favorites and highly demanded reads. These books are flying off the shelves!
            </motion.p>
          </div>
        </section>

        {/* Main Grid Section */}
        <div className="max-w-7xl mx-auto py-4">
          <BookGrid
            books={books}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Bestsellers;
