import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { BookGrid } from "../components/products";
import { publicApi } from "../services/public/publicApi";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/* ─── Full-width hero carousel ─── */
const HeroCarousel = ({ books, isLoading }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const slides = books.slice(0, 5);

  const go = (idx, dir) => { setDirection(dir); setCurrent(idx); };
  const handlePrev = () => { clearInterval(timerRef.current); go((current - 1 + slides.length) % slides.length, -1); };
  const handleNext = () => { clearInterval(timerRef.current); go((current + 1) % slides.length, 1); };

  useEffect(() => {
    if (isLoading || slides.length < 2) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [isLoading, slides.length]);

  const imgVariants = {
    enter: (d) => ({ x: d > 0 ? "8%" : "-8%", opacity: 0 }),
    center: () => ({ x: "0%", opacity: 1 }),
    exit: (d) => ({ x: d > 0 ? "-8%" : "8%", opacity: 0 }),
  };
  const infoVariants = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const book = slides[current];

  return (
    <div className="flex flex-col lg:flex-row w-full " >

      {/* ── LEFT: editorial text ── */}
      <div
        className="flex flex-col justify-center px-8 sm:px-12 lg:px-12 sm:py-10 py-4 lg:py-8"
        style={{ flex: "0 0 35%", background: "#faf8f4" }}
      >
        {/* Category label */}
        <p style={{ letterSpacing: "0.18em" }}
          className="font-sans text-[9px] font-bold text-stone-400 uppercase mb-6">
          Category · Bestsellers
        </p>

        {/* Headline */}
        {["Books", "Worth", "Reading."].map((word, i) => (
          <div key={word} className="overflow-hidden">
            <motion.h1
              initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                color: word === "Reading." ? "#E31E2E" : "#1c1917",
              }}
              className="font-serif text-[clamp(2rem,7vw,2.8rem)] font-black leading-none tracking-tighter"
            >
              {word}
            </motion.h1>
          </div>
        ))}

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ transformOrigin: "left", height: 1, background: "#ddd8cf" }}
          className="my-4"
        />

        {/* Body */}
        <p style={{ letterSpacing: undefined }}
          className="font-sans text-stone-500 text-sm leading-relaxed sm:mb-6 mb-2 max-w-xs">
          A curated collection of titles our sellers have listed under Bestsellers — handpicked reads across every genre.
        </p>



        {/* Dot indicators */}
        {slides.length > 1 && (
          <div className="flex items-center gap-1.5  sm:mt-10 mt-6">
            {slides.map((_, i) => (
              <button key={i} onClick={() => go(i, i > current ? 1 : -1)}
                className="rounded-full transition-all duration-300"
                style={{ width: i === current ? 20 : 6, height: 6, background: i === current ? "#E31E2E" : "#d6d3d1" }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT: full-height cover image ── */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{
          minHeight: 300,
          boxShadow:
            "inset 28px 0 48px rgba(0,0,0,0.22), inset 60px 0 100px rgba(0,0,0,0.10)",
        }}
      >

        {/* Prev arrow */}
        {slides.length > 1 && (
          <button onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 shadow-md flex items-center justify-center text-stone-600 hover:text-[#E31E2E] hover:bg-white transition-all"
            aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Sliding cover image */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={imgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => { if (book) { navigate(`/book/${book.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
          >
            {isLoading ? (
              <div className="w-full h-full animate-pulse" style={{ background: "#e8e2d9" }} />
            ) : (
              <img
                src={book?.imageURL}
                alt={book?.title}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=800&h=600&fit=crop"; }}
                className="w-full h-full object-cover object-center"
              />
            )}
            {/* Dark overlay at bottom for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Book info overlay at bottom */}
        {!isLoading && book && (
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={infoVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-6 z-10"
            >
              <p className="font-sans text-white/60 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">
                {book.author}
              </p>
              <p className="font-serif text-white font-black text-lg leading-tight mb-1">
                {book.title}
              </p>
              <p className="font-sans text-[#ff8080] font-black text-sm">
                ₹{book.price?.toFixed(0)}
              </p>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Next arrow */}
        {slides.length > 1 && (
          <button onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 shadow-md flex items-center justify-center text-stone-600 hover:text-[#E31E2E] hover:bg-white transition-all"
            aria-label="Next">
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Page ─── */
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
          const data = await publicApi.getBestsellers();
          if (data && Array.isArray(data)) booksArray = data;
          else if (data && data.success && Array.isArray(data.data)) booksArray = data.data;
          else if (data && Array.isArray(data.data)) booksArray = data.data;
        } catch (apiError) {
          console.warn("⚠️ Bestsellers API not available, falling back:", apiError.message);
          const allData = await publicApi.getAllBooks();
          let all = [];
          if (allData && Array.isArray(allData)) all = allData;
          else if (allData && allData.success && Array.isArray(allData.data)) all = allData.data;
          else if (allData && Array.isArray(allData.data)) all = allData.data;

          booksArray = all.filter((b) => {
            const cat = (b.category || "").toLowerCase();
            const title = (b.bookTitle || "").toLowerCase();
            return cat.includes("bestseller") || cat.includes("classic") || cat.includes("popular") || title.includes("gatsby") || title.includes("mockingbird");
          });
          if (booksArray.length === 0) booksArray = all.slice(0, 8);
        }

        setBooks(booksArray.map((book) => ({
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
        })));
      } catch (error) {
        console.error("❌ Failed to fetch bestsellers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBestsellers();
  }, []);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col"
      style={{ background: "#faf8f4" }}
    >
      <Navbar />

      <div className="flex-grow">

        {/* ── HERO with slideshow — floating card ── */}
        <div className="px-6 sm:px-10 lg:px-16 mx-auto sm:py-8 py-6 sm:h-[300px] md:h-[350px] lg:h-[400px]">
          <section
            className="relative overflow-hidden"
            style={{
              borderRadius: 24,
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.13), 0 8px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.06)",
              background: "#faf8f4",
            }}
          >
            <HeroCarousel books={books} isLoading={isLoading} />
          </section>
        </div>

        {/* ── ALL BOOKS GRID (unchanged) ── */}
        <div id="all-books" className=" mx-auto sm:py-10 mt-2 py-4 -mb-4">
          <BookGrid
            books={books}
            isLoading={isLoading}
            onAddToCart={(book) => addToCart(book)}
            eyebrow="Bestsellers · Full List"
            title="All Bestsellers"
            subtitle="Browse the complete collection of bestseller books available on BooksKaBazaar."
          />
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default Bestsellers;
