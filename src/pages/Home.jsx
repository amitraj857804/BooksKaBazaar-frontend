import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Carousel from "../components/common/Carousel";
import { publicApi } from "../services/public/publicApi";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Newspaper,
  Feather,
  Tablet,
  Clock,
  Calendar,
} from "lucide-react";
import BookCard from "../components/products/BookCard";
import { BLOG_POSTS } from "./Blogs";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// ─── Utility: map raw book from API ────────────────────────────────────────────
const mapBook = (book) => ({
  id: book.bookId || book.id,
  title: book.bookTitle || book.title,
  author: book.authorName || book.author,
  price: parseFloat(book.price) || 0,
  originalPrice: Math.round((parseFloat(book.price) || 0) * 1.45),
  imageURL: book.imageFileName
    ? `${API_BASE_URL}/public/books/${book.bookId || book.id}/image`
    : book.imageURL ||
    "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop",
  category: book.category || book.badge || null,
  badge: book.category || book.badge || null,
  isbn: book.isbn,
  description: book.description,
  totalStock: book.totalStock,
  availableStock: book.availableStock,
});

const extractArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.success && Array.isArray(data.data)) return data.data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// ─── Horizontal scrolling book strip ──────────────────────────────────────────
const HorizontalBookStrip = ({ books, isLoading, badge, badgeColor = "#E31E2E" }) => {
  const stripRef = useRef(null);

  const scroll = (dir) => {
    stripRef.current?.scrollBy({ left: dir * 170, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex gap-3.5 overflow-hidden px-0.5 py-2">
        {Array(7).fill(null).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[132px] sm:w-[150px]">
            <div className="w-full h-[185px] sm:h-[210px] rounded-2xl bg-gray-100 animate-pulse" />
            <div className="mt-2.5 h-2.5 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="mt-1.5 h-2.5 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="mt-1.5 h-2.5 w-2/3 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute -left-4 top-[95px] z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer"
        aria-label="Scroll left"
      >
        <ChevronLeft size={15} className="text-gray-600" />
      </button>

      <div ref={stripRef} className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-3 px-0.5">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            badge={badge}
            badgeColor={badgeColor}
            stripMode
          />
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        className="absolute -right-4 top-[95px] z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer"
        aria-label="Scroll right"
      >
        <ChevronRight size={15} className="text-gray-600" />
      </button>
    </div>
  );
};



// ─── Categories Section ──────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Fiction", count: "12,345+", color: "#FFF3E0", icon: "📚", query: "fiction" },
  { name: "Non-Fiction", count: "18,765+", color: "#E8F5E9", icon: "📖", query: "non-fiction" },
  { name: "Self Help", count: "8,224+", color: "#E0F7FA", icon: "🧠", query: "self help" },
  { name: "Business", count: "6,786+", color: "#EDE7F6", icon: "💼", query: "business" },
  { name: "Kids", count: "7,345+", color: "#FCE4EC", icon: "🧸", query: "kids" },
  { name: "Biography", count: "4,321+", color: "#FFF9C4", icon: "👤", query: "biography" },
  { name: "Academic", count: "9,876+", color: "#E0F2F1", icon: "🎓", query: "academic" },
  { name: "Comics", count: "2,345+", color: "#FFEBEE", icon: "🎨", query: "comics" },
];

const CategoriesSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-6 rounded-full bg-[#E31E2E] flex-shrink-0" />
            <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 tracking-tight">
              Explore Books by Categories
            </h2>
          </div>
          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-1 text-[12px] font-bold text-gray-500 hover:text-[#E31E2E] transition-colors cursor-pointer"
          >
            View All Categories <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.name}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/search?query=${encodeURIComponent(cat.query)}`)}
              className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
              style={{ background: cat.color }}
            >
              <span className="text-2xl sm:text-3xl">{cat.icon}</span>
              <div className="text-center">
                <p className="text-[10px] sm:text-[12px] font-bold text-gray-800 leading-tight">{cat.name}</p>
                <p className="text-[8px] sm:text-[10px] text-gray-500 font-medium mt-0.5">{cat.count} Books</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Reading Room Section ────────────────────────────────────────────────────
const READING_ROOM_TABS = [
  "News", "Views & Analysis", "Current Affairs", "General Studies", "Business", "Science & Tech", "Books & Culture",
];

const READING_ROOM_ARTICLES = [
  {
    id: 1, category: "Current Affairs",
    title: "India's Digital Leap: Transforming Lives and Livelihoods",
    date: "10 May 2024", readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
  },
  {
    id: 2, category: "Views & Analysis",
    title: "Global Economy 2024: Challenges and Opportunities Ahead",
    date: "08 May 2024", readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
  },
  {
    id: 3, category: "General Studies",
    title: "Understanding the Constitution: Rights and Duties",
    date: "06 May 2024", readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop",
  },
  {
    id: 4, category: "News",
    title: "Space Exploration: India's Journey to the Stars",
    date: "04 May 2024", readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop",
  },
];

const ReadingRoomSection = () => {
  const [activeTab, setActiveTab] = useState("News");
  const navigate = useNavigate();

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-lg">🗞️</span>
            <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 tracking-tight">Reading Room</h2>
          </div>
          <button
            onClick={() => navigate("/reading-room")}
            className="flex items-center gap-1 text-[12px] font-bold text-gray-500 hover:text-[#E31E2E] transition-colors cursor-pointer"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mb-4 ml-7">Read News, Views &amp; Analysis on a wide range of topics.</p>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
          {READING_ROOM_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${activeTab === tab
                  ? "bg-[#E31E2E]/10 border-[#E31E2E]/30 text-[#E31E2E]"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
            >
              {tab === "News" && <Newspaper size={11} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {READING_ROOM_ARTICLES.map((article) => (
              <motion.div
                key={article.id}
                whileHover={{ y: -3 }}
                onClick={() => navigate("/reading-room")}
                className="group cursor-pointer"
              >
                <div className="rounded-xl overflow-hidden h-[130px] sm:h-[150px] mb-2.5 border border-gray-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop"; }}
                  />
                </div>
                <p className="text-[10px] font-bold text-emerald-600 mb-1">{article.category}</p>
                <p className="text-[12px] font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#E31E2E] transition-colors">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1"><Calendar size={9} />{article.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock size={9} />{article.readTime}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => navigate("/reading-room")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-all cursor-pointer"
          >
            <ChevronRight size={14} className="text-gray-500" />
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── Blog Section ────────────────────────────────────────────────────────────
const BlogSection = () => {
  const navigate = useNavigate();
  const displayPosts = BLOG_POSTS.slice(0, 4);

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 tracking-tight">From Our Blog</h2>
          </div>
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-1 text-[12px] font-bold text-[#E31E2E] hover:text-red-700 transition-colors cursor-pointer"
          >
            View All Blogs <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Blog cards */}
          <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-2 gap-4">
            {displayPosts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -3 }}
                onClick={() => { navigate(`/blogs/${post.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="group cursor-pointer"
              >
                <div className="rounded-xl overflow-hidden h-[110px] sm:h-[130px] mb-2.5 border border-gray-200">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop"; }}
                  />
                </div>
                <p className="text-[12px] font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#E31E2E] transition-colors mb-1.5">
                  {post.title}
                </p>
                <button className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-[#E31E2E] transition-colors cursor-pointer uppercase tracking-wider">
                  Read More <ArrowRight size={10} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Write Your Own Blog CTA */}
          <div className="sm:col-span-1 flex flex-col">
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-2xl overflow-hidden border border-gray-200 flex-1 relative cursor-pointer group"
              onClick={() => navigate("/blogs")}
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                minHeight: 220,
              }}
            >
              <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                <div>
                  <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-widest mb-2.5 flex items-center gap-1">
                    💡 Have Something to Say?
                  </p>
                  <h3 className="text-white font-black text-[22px] leading-tight mb-0.5">
                    Write Your Own
                  </h3>
                  <p className="text-yellow-400 font-black text-[19px] leading-tight mb-3">Blog</p>
                  <p className="text-gray-300 text-[11px] leading-relaxed">
                    Every experience holds a lesson. Every idea has the power to inspire. Share your knowledge, stories, research, and expertise to help others learn, grow, and see the world from a new perspective.
                  </p>
                </div>
                <button className="mt-4 w-full py-2.5 rounded-xl bg-[#E31E2E] text-white text-[11px] font-black hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                  <Feather size={12} /> Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── EBooks Section ──────────────────────────────────────────────────────────
const EBOOK_COVERS = [
  { title: "Ikigai", author: "Héctor García", cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop" },
  { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop" },
  { title: "Sapiens", author: "Yuval Noah Harari", cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=200&h=300&fit=crop" },
  { title: "Deep Work", author: "Cal Newport", cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop" },
  { title: "The 5 AM Club", author: "Robin Sharma", cover: "https://images.unsplash.com/photo-1543965170-e2057a3b6e9e?w=200&h=300&fit=crop" },
  { title: "The Power of Now", author: "Eckhart Tolle", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop" },
];

const EBooksSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Left CTA */}
          <div className="sm:w-52 flex-shrink-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Tablet size={19} className="text-[#E31E2E]" />
              <h2 className="font-bold text-[16px] text-gray-900">EBooks &amp; PDFs</h2>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
              Read Anywhere, Anytime. Download eBooks &amp; PDFs instantly and enjoy on any device.
            </p>
            <button
              onClick={() => navigate("/reading-room")}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-800 text-gray-800 text-[11px] font-black hover:bg-gray-800 hover:text-white transition-all cursor-pointer"
            >
              Explore EBooks
            </button>
          </div>

          {/* Right: ebook strip */}
          <div className="flex-1 relative overflow-hidden">
            <div className="flex items-center justify-end mb-3">
              <button
                onClick={() => navigate("/reading-room")}
                className="text-[11px] font-bold text-gray-400 hover:text-[#E31E2E] transition-colors cursor-pointer flex items-center gap-0.5"
              >
                View All <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
              {EBOOK_COVERS.map((book, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.03 }}
                  onClick={() => navigate("/reading-room")}
                  className="flex-shrink-0 w-[110px] cursor-pointer group"
                >
                  <div className="relative w-full h-[148px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#E31E2E] text-white text-[8px] font-black rounded uppercase">
                      PDF
                    </span>
                  </div>
                  <p className="mt-1.5 text-[10px] font-bold text-gray-800 line-clamp-1">{book.title}</p>
                  <p className="text-[9px] text-gray-400 truncate">{book.author}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Main Home Component ─────────────────────────────────────────────────────
const Home = () => {
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Safety timeout — always clear loading within 6s even if backend is slow
    const safetyTimer = setTimeout(() => setIsLoading(false), 6000);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await publicApi.getAllBooks();
        const arr = extractArray(data).map(mapBook);

        // Use different slices/shuffles so each section feels distinct
        const mid = Math.floor(arr.length / 2);
        const shuffled = [...arr].sort(() => Math.random() - 0.5);

        setTrendingBooks(arr.slice(0, 12));       // first 12
        setNewArrivals(shuffled.slice(0, 10));    // random 10
        setBestsellers(arr.slice(mid, mid + 10)); // middle 10
      } catch (error) {
        console.error("❌ Failed to fetch books:", error);
      } finally {
        clearTimeout(safetyTimer);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => clearTimeout(safetyTimer);
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
      className="min-h-screen flex flex-col bg-gray-50"
    >
      <Navbar />

      <div className="flex-grow">
        {/* 1. Hero Carousel */}
        <Carousel isLoading={isLoading} />

        {/* 2. Trending This Week */}
        <section className="py-7 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-6 rounded-full bg-[#E31E2E] flex-shrink-0" />
                <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 tracking-tight">Trending This Week</h2>
              </div>
              <button
                onClick={() => { window.location.href = "/bestsellers"; window.scrollTo({ top: 0 }); }}
                className="text-[12px] font-bold text-gray-500 hover:text-[#E31E2E] transition-colors cursor-pointer flex items-center gap-0.5"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <HorizontalBookStrip books={trendingBooks} isLoading={isLoading} badge="TRENDING" badgeColor="#E31E2E" />
          </div>
        </section>

        {/* 3. New Arrivals */}
        <section className="py-7 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-6 rounded-full bg-[#E31E2E] flex-shrink-0" />
                <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 tracking-tight">New Arrivals</h2>
              </div>
              <button
                onClick={() => { window.location.href = "/new-arrivals"; window.scrollTo({ top: 0 }); }}
                className="text-[12px] font-bold text-gray-500 hover:text-[#E31E2E] transition-colors cursor-pointer flex items-center gap-0.5"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <HorizontalBookStrip books={newArrivals} isLoading={isLoading} badge="NEW" badgeColor="#22c55e" />
          </div>
        </section>

        {/* 4. Categories */}
        <CategoriesSection />

        {/* 5. Best Sellers */}
        <section className="py-7 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-6 rounded-full bg-[#E31E2E] flex-shrink-0" />
                <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 tracking-tight">Best Sellers</h2>
              </div>
              <button
                onClick={() => { window.location.href = "/bestsellers"; window.scrollTo({ top: 0 }); }}
                className="text-[12px] font-bold text-gray-500 hover:text-[#E31E2E] transition-colors cursor-pointer flex items-center gap-0.5"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <HorizontalBookStrip books={bestsellers} isLoading={isLoading} badge={null} />
          </div>
        </section>

        {/* 6. Reading Room */}
        <ReadingRoomSection />

        {/* 7. From Our Blog */}
        <BlogSection />

        {/* 8. EBooks & PDFs */}
        <EBooksSection />
      </div>

      <Footer />
    </motion.div>
  );
};

export default Home;
