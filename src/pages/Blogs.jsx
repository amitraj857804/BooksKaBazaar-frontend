import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight, Search, TrendingUp, Feather } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const BLOG_POSTS = [
  {
    id: "top-fiction-2024",
    title: "10 Must-Read Fiction Books That Defined 2024",
    excerpt: "From sweeping family sagas to intimate character studies, these ten novels left an indelible mark on readers across the globe this year.",
    author: "Priya Sharma",
    authorRole: "Literary Editor",
    date: "July 18, 2026",
    readTime: "6 min read",
    category: "Book Lists",
    tags: ["fiction", "2024", "must-read", "recommendations"],
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=600&fit=crop",
    featured: true,
    embeddedBooks: [
      { id: 1, title: "The God of Small Things", author: "Arundhati Roy", price: 399, rating: 4.8, category: "Fiction", imageURL: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop" },
      { id: 2, title: "Midnight's Children", author: "Salman Rushdie", price: 449, rating: 4.6, category: "Fiction", imageURL: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop" },
    ],
  },
  {
    id: "reading-habits-science",
    title: "What Science Says About Daily Reading Habits",
    excerpt: "Research consistently shows that reading for just 20 minutes a day can significantly improve focus, empathy, and cognitive longevity.",
    author: "Dr. Arjun Mehra",
    authorRole: "Neuroscience Researcher",
    date: "July 15, 2026",
    readTime: "8 min read",
    category: "Science & Reading",
    tags: ["science", "habits", "brain", "focus"],
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=600&fit=crop",
    featured: false,
    embeddedBooks: [],
  },
  {
    id: "interview-ruskin-bond",
    title: "In Conversation with Ruskin Bond: Stories of the Hills",
    excerpt: "We sat down with the beloved author to talk about Mussoorie, the art of short fiction, and why simpler stories often hold the deepest truths.",
    author: "Kavya Nair",
    authorRole: "Senior Correspondent",
    date: "July 10, 2026",
    readTime: "10 min read",
    category: "Author Interviews",
    tags: ["author", "interview", "short-stories"],
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1200&h=600&fit=crop",
    featured: false,
    embeddedBooks: [
      { id: 3, title: "The Room on the Roof", author: "Ruskin Bond", price: 299, rating: 4.5, category: "Fiction", imageURL: "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=200&h=300&fit=crop" },
    ],
  },
  {
    id: "beginners-guide-non-fiction",
    title: "The Beginner's Guide to Non-Fiction: Where to Start",
    excerpt: "Non-fiction can feel daunting. Here's a curated roadmap for every kind of curious mind.",
    author: "Rohan Verma",
    authorRole: "Books Curator",
    date: "July 5, 2026",
    readTime: "5 min read",
    category: "Guides",
    tags: ["non-fiction", "beginners", "guide"],
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=600&fit=crop",
    featured: false,
    embeddedBooks: [],
  },
  {
    id: "childrens-books-parents",
    title: "5 Children's Books Every Parent Should Read First",
    excerpt: "Before you read these to your kids, read them yourself. These books contain layers of wisdom for grown-up readers too.",
    author: "Meera Iyer",
    authorRole: "Children's Books Specialist",
    date: "June 28, 2026",
    readTime: "4 min read",
    category: "Children & Family",
    tags: ["children", "family", "parenting"],
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop",
    featured: false,
    embeddedBooks: [],
  },
  {
    id: "rare-vintage-collecting",
    title: "The Art of Collecting Rare & Vintage Books in India",
    excerpt: "From first editions to hand-illustrated manuscripts, India's rare book market is thriving. Here's how to start.",
    author: "Vikram Anand",
    authorRole: "Rare Books Correspondent",
    date: "June 20, 2026",
    readTime: "7 min read",
    category: "Collecting",
    tags: ["rare", "vintage", "collecting"],
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=600&fit=crop",
    featured: false,
    embeddedBooks: [],
  },
];

const CATEGORIES = ["All", "Book Lists", "Author Interviews", "Science & Reading", "Guides", "Children & Family", "Collecting"];

const BlogCard = ({ post, index }) => {
  const navigate = useNavigate();
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={() => navigate(`/blogs/${post.id}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="h-44 overflow-hidden bg-gray-100">
        <img
          src={post.coverImage} alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=300&fit=crop"; }}
        />
      </div>
      <div className="p-5">
        <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#E31E2E] bg-red-50 px-2.5 py-1 rounded-full mb-3">
          {post.category}
        </span>
        <h2 className="font-serif font-black text-gray-900 text-base leading-snug mb-2 group-hover:text-[#E31E2E] transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-stone-400 font-semibold">
            <span className="flex items-center gap-1"><Calendar size={11} />{post.date}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
          </div>
          <ChevronRight size={16} className="text-gray-200 group-hover:text-[#E31E2E] transition-colors" />
        </div>
      </div>
    </motion.article>
  );
};

const Blogs = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featured = BLOG_POSTS.find((p) => p.featured);
  const filtered = BLOG_POSTS.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchQ = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ && !p.featured;
  });

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header — matches site editorial style */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-4">
            BooksKaBazaar · Editorial
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              {["Books Ka", "Bazaar", "Blog."].map((word, i) => (
                <div key={word} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    style={{ color: word === "Blog." ? "#E31E2E" : "#1c1917" }}
                    className="font-serif text-[clamp(1.8rem,6vw,2.8rem)] font-black leading-none tracking-tighter"
                  >
                    {word}
                  </motion.h1>
                </div>
              ))}
              <p className="text-stone-500 text-sm mt-4 max-w-sm">
                Reviews, interviews, reading guides, and everything in between.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E31E2E] focus:ring-1 focus:ring-[#E31E2E]/20 transition-all bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">

        {/* Featured Post */}
        {featured && !searchQuery && activeCategory === "All" && (
          <motion.article
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/blogs/${featured.id}`)}
            className="group relative rounded-3xl overflow-hidden mb-10 cursor-pointer shadow-md h-72 sm:h-80"
          >
            <img src={featured.coverImage} alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-9 max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} className="text-[#E31E2E]" />
                <span className="text-xs font-black uppercase tracking-widest text-red-400">Featured</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight mb-2 group-hover:text-red-300 transition-colors">
                {featured.title}
              </h2>
              <p className="text-sm text-gray-300 line-clamp-2 mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold">
                <span>{featured.author}</span><span>·</span><span>{featured.readTime}</span>
              </div>
            </div>
          </motion.article>
        )}

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#E31E2E] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#E31E2E] hover:text-[#E31E2E]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Post grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p className="text-lg font-black mb-1">No articles found</p>
            <p className="text-sm">Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blogs;
