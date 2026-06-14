import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { BookGrid } from "../components/products";
import { publicApi } from "../services/public/publicApi";
import { Sparkles, Clock } from "lucide-react";
import { useCart } from "../hooks/useCart";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const NewArrivals = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setIsLoading(true);
        let booksArray = [];
        try {
          // Attempt to fetch from dedicated New Arrivals endpoint
          const data = await publicApi.getNewArrivals();
          if (data && Array.isArray(data)) {
            booksArray = data;
          } else if (data && data.success && Array.isArray(data.data)) {
            booksArray = data.data;
          } else if (data && Array.isArray(data.data)) {
            booksArray = data.data;
          }
        } catch (apiError) {
          console.warn("⚠️ Dedicated New Arrivals API not available or failed. Falling back to filtering all books:", apiError.message);

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

          // Filter books that are marked as new arrivals based on category/badge/title,
          // or sort by bookId descending to show newly uploaded books
          booksArray = allBooksArray.filter((book) => {
            const category = (book.category || "").toLowerCase();
            const title = (book.bookTitle || "").toLowerCase();
            const desc = (book.description || "").toLowerCase();
            return (
              category.includes("new") ||
              category.includes("arrival") ||
              title.includes("mockingbird") || // Mockingbird and rye are new in mock data
              title.includes("rye")
            );
          });

          // If no specific books match, sort general books by ID descending (newest first)
          if (booksArray.length === 0) {
            booksArray = [...allBooksArray].sort((a, b) => (b.bookId || b.id) - (a.bookId || a.id)).slice(0, 4);
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
          badge: book.category || book.badge || "New Arrival",
          isbn: book.isbn,
          description: book.description,
          totalStock: book.totalStock,
          availableStock: book.availableStock,
          reservedStock: book.reservedStock,
          damagedStock: book.damagedStock,
        }));

        setBooks(mappedBooks);
      } catch (error) {
        console.error("❌ Failed to fetch new arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
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
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-16 text-white shadow-lg">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none transform -translate-x-1/4 translate-y-1/4"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/25 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Sparkles size={14} className="text-indigo-300 animate-pulse" />
              <span>Fresh Off The Press</span>
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white mb-4"
            >
              New <span className="text-[#E31E2E]">Arrivals</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg lg:text-xl font-medium leading-relaxed"
            >
              Stay ahead of the curve. Be the first to explore and experience our latest literary additions.
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

export default NewArrivals;
