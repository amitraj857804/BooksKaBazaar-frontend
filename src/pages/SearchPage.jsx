import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import BookCard from "../components/products/BookCard";
import SkeletonCard from "../components/products/SkeletonCard";
import { publicApi } from "../services/public/publicApi";
import { Search, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import { useCart } from "../hooks/useCart";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [books, setBooks] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const performSearchAndRecommendations = async () => {
      if (!query.trim()) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // 1. Fetch matching search results
        const searchData = await publicApi.searchBooks(query);
        let searchResultsArray = [];
        if (searchData && Array.isArray(searchData)) {
          searchResultsArray = searchData;
        } else if (searchData && searchData.success && Array.isArray(searchData.data)) {
          searchResultsArray = searchData.data;
        } else if (searchData && Array.isArray(searchData.data)) {
          searchResultsArray = searchData.data;
        }

        const mappedSearchResults = searchResultsArray.map((book) => ({
          id: book.bookId || book.id,
          title: book.bookTitle || book.title,
          author: book.authorName || book.author,
          price: parseFloat(book.price) || 0,
          imageURL: book.imageFileName
            ? `${API_BASE_URL}/public/books/${book.bookId || book.id}/image`
            : book.imageURL || "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop",
          category: book.category || book.badge || null,
          isbn: book.isbn,
          description: book.description,
          totalStock: book.totalStock,
          availableStock: book.availableStock,
          reservedStock: book.reservedStock,
          damagedStock: book.damagedStock,
        }));

        setBooks(mappedSearchResults);

        // 2. Fetch all books for computing related books
        let allBooksArray = [];
        try {
          const allData = await publicApi.getAllBooks();
          if (allData && Array.isArray(allData)) {
            allBooksArray = allData;
          } else if (allData && allData.success && Array.isArray(allData.data)) {
            allBooksArray = allData.data;
          } else if (allData && Array.isArray(allData.data)) {
            allBooksArray = allData.data;
          }
        } catch (e) {
          console.warn("⚠️ Failed to load all books for suggestions:", e.message);
        }

        const mappedAllBooks = allBooksArray.map((book) => ({
          id: book.bookId || book.id,
          title: book.bookTitle || book.title,
          author: book.authorName || book.author,
          price: parseFloat(book.price) || 0,
          imageURL: book.imageFileName
            ? `${API_BASE_URL}/public/books/${book.bookId || book.id}/image`
            : book.imageURL || "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop",
          category: book.category || book.badge || null,
          isbn: book.isbn,
          description: book.description,
          totalStock: book.totalStock,
          availableStock: book.availableStock,
          reservedStock: book.reservedStock,
          damagedStock: book.damagedStock,
        }));

        // Filter out books already present in the search results
        const resultIds = new Set(mappedSearchResults.map((b) => b.id));
        const nonResultBooks = mappedAllBooks.filter((b) => !resultIds.has(b.id));

        let computedRelated = [];

        if (mappedSearchResults.length > 0) {
          // If we have search matches, find other books in the same categories
          const matchedCategories = Array.from(
            new Set(mappedSearchResults.map((b) => b.category).filter(Boolean))
          );

          if (matchedCategories.length > 0) {
            computedRelated = nonResultBooks.filter((b) =>
              matchedCategories.some((cat) => b.category && b.category.toLowerCase() === cat.toLowerCase())
            );
          }

          // If we have too few matching categories, fill with bestsellers / general books
          if (computedRelated.length < 5) {
            const extraBooks = nonResultBooks.filter(
              (b) => !computedRelated.some((rb) => rb.id === b.id)
            );
            computedRelated = [...computedRelated, ...extraBooks];
          }
        } else {
          // If search matches is 0, recommend bestsellers/new arrivals/popular books
          try {
            const bestsellersData = await publicApi.getBestsellers();
            let bestsellersArray = [];
            if (bestsellersData && Array.isArray(bestsellersData)) {
              bestsellersArray = bestsellersData;
            } else if (bestsellersData && bestsellersData.success && Array.isArray(bestsellersData.data)) {
              bestsellersArray = bestsellersData.data;
            } else if (bestsellersData && Array.isArray(bestsellersData.data)) {
              bestsellersArray = bestsellersData.data;
            }
            computedRelated = bestsellersArray.map((book) => ({
              id: book.bookId || book.id,
              title: book.bookTitle || book.title,
              author: book.authorName || book.author,
              price: parseFloat(book.price) || 0,
              imageURL: book.imageFileName
                ? `${API_BASE_URL}/public/books/${book.bookId || book.id}/image`
                : book.imageURL || "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop",
              category: book.category || book.badge || null,
              isbn: book.isbn,
              description: book.description,
              totalStock: book.totalStock,
              availableStock: book.availableStock,
              reservedStock: book.reservedStock,
              damagedStock: book.damagedStock,
            }));
          } catch (e) {
            computedRelated = nonResultBooks;
          }
        }

        // Keep up to 6 recommended books
        setRelatedBooks(computedRelated.slice(0, 6));
      } catch (error) {
        console.error("❌ Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearchAndRecommendations();
  }, [query]);

  const handleAddToCart = (book) => {
    addToCart(book);
  };

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
        <section className="bg-slate-50/70 border-b border-slate-200/60 py-6 sm:py-6">
          <div className=" mx-auto px-4 sm:px-6 lg:px-28">

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Showing results for <span className="text-[#E31E2E] italic font-serif">"{query}"</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-medium font-sans">
              {isLoading
                ? "Scanning our shelves for matching titles, authors, and genres..."
                : `Found ${books.length} matching book${books.length === 1 ? "" : "s"} in our inventory.`
              }
            </p>
          </div>
        </section>

        {/* Main Results Grid */}
        <div className=" px-6 sm:px-10 lg:px-28 mx-auto
       py-6 sm:py-6">
          {isLoading ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3 font-sans">
                <BookOpen size={20} className="text-[#E31E2E]" />
                <span>Matching Books</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
                {Array(6).fill(null).map((_, idx) => (
                  <SkeletonCard key={idx} index={idx} />
                ))}
              </div>
            </div>
          ) : books.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3 font-sans">
                <BookOpen size={20} className="text-[#E31E2E]" />
                <span>Matching Books ({books.length})</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-4">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Related Books Section */}
              {relatedBooks.length > 0 && (
                <div className="mt-16 sm:mt-24 pb-8">
                  <div className="mb-6 border-b border-gray-100 pb-3 flex items-center justify-between font-sans">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles size={20} className="text-amber-500 fill-amber-500" />
                      <span>Related Books You Might Like</span>
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 -mt-4">
                    Discover popular books from similar genres and tags
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-4">
                    {relatedBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div>
              <div className="py-6 flex flex-col items-center text-center max-w-xl mx-auto">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-12 rounded-full bg-rose-50 flex items-center justify-center text-[#E31E2E] mb-8 "
                >
                  <AlertCircle size={40} />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-3 font-serif">
                  No matching books found
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed font-sans">
                  We couldn't find any books matching <span className="font-bold text-slate-700">"{query}"</span>. Please check your spelling or search for alternative keywords, genres, or authors.
                </p>
              </div>

              {/* Fallback Recommendations */}
              {relatedBooks.length > 0 && (
                <div className="w-full text-left mt-8 border-t border-gray-200/60 pt-10 sm:pt-16 pb-6">
                  <div className="mb-6 font-sans">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles size={20} className="text-amber-500 fill-amber-500" />
                      <span>Featured Recommendations</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Here are some of our popular customer favorites
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6 ">
                    {relatedBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default SearchPage;
