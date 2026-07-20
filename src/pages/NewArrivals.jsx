import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { BookGrid } from "../components/products";
import { publicApi } from "../services/public/publicApi";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/* Slight rotation per card to create a natural fanned spread */
const CARD_ROTATIONS = [-6, -2, 2, 6];

/* ─── Single fanned arrival card ─── */
const ArrivalCard = ({ book, index, total }) => {
  const navigate = useNavigate();
  const rotate = CARD_ROTATIONS[index] ?? 0;
  const isCenter = index === 1 || index === 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotate - 4 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.55, delay: 0.08 * index + 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, y: -8, scale: 1.04, zIndex: 20, transition: { duration: 0.25 } }}
      onClick={() => { navigate(`/book/${book.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      className="group cursor-pointer relative"
      style={{ zIndex: isCenter ? 10 : 5 }}
    >
      {/* Card shadow / depth */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{
          width: 120,
          height: 175,
          boxShadow: "0 20px 50px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={book.imageURL}
          alt={book.title}
          onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=300&h=450&fit=crop"; }}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* NEW badge */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white"
          style={{ background: "linear-gradient(135deg, #E31E2E, #ff6b35)" }}>
          New
        </div>

        {/* Hover title */}
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-[10px] font-bold line-clamp-2 leading-tight">{book.title}</p>
          <p className="text-white/70 text-[9px] mt-0.5">₹{book.price?.toFixed(0)}</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Skeleton fanned card ─── */
const ArrivalSkeleton = ({ index }) => {
  const rotate = CARD_ROTATIONS[index] ?? 0;
  return (
    <div
      className="rounded-2xl animate-pulse"
      style={{ width: 120, height: 175, background: "#e8e2d9", transform: `rotate(${rotate}deg)` }}
    />
  );
};

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
          const data = await publicApi.getNewArrivals();
          if (data && Array.isArray(data)) booksArray = data;
          else if (data && data.success && Array.isArray(data.data)) booksArray = data.data;
          else if (data && Array.isArray(data.data)) booksArray = data.data;
        } catch (apiError) {
          console.warn("⚠️ New Arrivals API not available, falling back:", apiError.message);
          const allData = await publicApi.getAllBooks();
          let all = [];
          if (allData && Array.isArray(allData)) all = allData;
          else if (allData && allData.success && Array.isArray(allData.data)) all = allData.data;
          else if (allData && Array.isArray(allData.data)) all = allData.data;

          booksArray = all.filter((b) => {
            const cat = (b.category || "").toLowerCase();
            const title = (b.bookTitle || "").toLowerCase();
            return cat.includes("new") || cat.includes("arrival") || title.includes("mockingbird") || title.includes("rye");
          });
          if (booksArray.length === 0) {
            booksArray = [...all].sort((a, b) => (b.bookId || b.id) - (a.bookId || a.id)).slice(0, 6);
          }
        }

        setBooks(booksArray.map((book) => ({
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
        })));
      } catch (error) {
        console.error("❌ Failed to fetch new arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  /* Show up to 4 books in the fan */
  const fanBooks = books.slice(0, 4);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const currentMonth = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" }).toUpperCase();

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="min-h-screen flex flex-col" style={{ background: "#faf8f4" }}>
      <Navbar />

      <div className="flex-grow">
        {/* ── HERO: warm paper, no gradients, no glow blobs ── */}
        <section style={{ background: "linear-gradient(160deg, #fff9f5 0%, #ffffff 55%, #fff5f5 100%)", borderBottom: "1px solid #e8e2d9" }}>

          <div className="px-6 sm:px-10 lg:px-28 mx-auto">

            {/* Thin top rule */}
            <div style={{ borderBottom: "1px solid #ddd8cf" }} className="pt-16 mb-6  " />

            {/* Main split: text left, fan right */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 pb-6">

              {/* LEFT ── editorial text block */}
              <div className="flex-1 max-w-lg">

                {/* Month stamp */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45 }}
                  className="font-sans text-[10px] font-bold text-stone-400 uppercase mb-4"
                >
                  {currentMonth}
                </motion.p>

                {/* Headline */}
                <div className="overflow-hidden mb-2">
                  <motion.h1
                    initial={{ y: 32, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-[clamp(3rem,7vw,6rem)] font-black text-stone-900 leading-none tracking-tighter"
                  >
                    Just
                  </motion.h1>
                </div>
                <div className="overflow-hidden mb-7">
                  <motion.h1
                    initial={{ y: 32, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="font-serif text-[clamp(3rem,7vw,6rem)] font-black leading-none tracking-tighter text-[#E31E2E]"
                  >
                    Landed.
                  </motion.h1>
                </div>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ transformOrigin: "left", height: 1, background: "#ddd8cf" }}
                  className="mb-7"
                />

                {/* Body copy — honest, one sentence */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="font-sans text-stone-500 text-sm leading-relaxed mb-0 max-w-sm"
                >
                  The freshest titles from our sellers — added this week, before everyone else finds them.
                </motion.p>

               
              </div>

              {/* RIGHT ── fanned book covers — desktop only (hides on mobile to prevent overflow) */}
              <div className="hidden lg:flex flex-shrink-0 items-end justify-center gap-3 sm:gap-5 min-h-[210px] pb-2">
                {isLoading ? (
                  [0, 1, 2, 3].map((i) => <ArrivalSkeleton key={i} index={i} />)
                ) : (
                  fanBooks.map((book, i) => (
                    <ArrivalCard key={book.id} book={book} index={i} total={fanBooks.length} />
                  ))
                )}
              </div>
            </div>

            {/* Bottom accent rule with red dot */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: "#ddd8cf" }} />
              <span className="w-2 h-2 rounded-full" style={{ background: "#E31E2E" }} />
              <div className="h-px flex-1" style={{ background: "#ddd8cf" }} />
            </div>
          </div>
        </section>

        {/* ── FULL BOOK GRID ── */}
        <div id="all-books" className=" mx-auto py-2">
          <BookGrid
            books={books}
            isLoading={isLoading}
            onAddToCart={(book) => addToCart(book)}
            eyebrow="New Arrivals · Full List"
            title="All New Arrivals"
            subtitle="Every title freshly added to our shelves — browse the complete batch below."
          />
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default NewArrivals;
