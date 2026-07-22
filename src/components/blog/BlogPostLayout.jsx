import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReadingRoomTeaser from "./ReadingRoomTeaser";

/**
 * BlogPostLayout
 * Full blog post layout wrapper. Children can include text nodes
 * and <EmbeddedBookCard /> or <ReadingRoomTeaser /> components.
 *
 * Props:
 *   post — {
 *     title, author, authorRole, date, readTime,
 *     coverImage, category, tags: string[],
 *     excerpt
 *   }
 *   children — React nodes (post body with embedded components)
 */
const BlogPostLayout = ({ post, children }) => {
  const navigate = useNavigate();

  return (
    <article className="bg-white min-h-screen">
      {/* ── Cover Hero ─────────────────────────────────────────────────── */}
      <div className="relative h-64 sm:h-80 lg:h-[420px] overflow-hidden bg-gray-900">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover opacity-70"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop";
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/blogs")}
          className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          All Articles
        </button>

        {/* Category badge */}
        {post.category && (
          <div className="absolute top-5 right-5">
            <span className="px-3 py-1 rounded-full bg-[#E31E2E] text-white text-xs font-black uppercase tracking-wider">
              {post.category}
            </span>
          </div>
        )}

        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-7 sm:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight max-w-3xl"
          >
            {post.title}
          </motion.h1>
        </div>
      </div>

      {/* ── Meta strip ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center gap-4 text-xs text-gray-500 font-semibold">
          <div className="flex items-center gap-1.5">
            <User size={13} />
            <span className="text-gray-700 font-bold">{post.author}</span>
            {post.authorRole && <span className="text-gray-400">· {post.authorRole}</span>}
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={13} />
            {post.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={13} />
            {post.readTime}
          </div>
        </div>
      </div>

      {/* ── Two-column layout: Content + Sidebar ─────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex gap-10 items-start">

        {/* ── Main Content ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Excerpt / lead */}
          {post.excerpt && (
            <p className="text-lg text-gray-600 font-medium leading-relaxed border-l-4 border-[#E31E2E] pl-4 mb-8 italic">
              {post.excerpt}
            </p>
          )}

          {/* Inline Reading Room teaser (early in post) */}
          <ReadingRoomTeaser variant="inline" />

          {/* Post body */}
          <div className="prose prose-gray max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-700 prose-strong:text-gray-900">
            {children}
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <Tag size={13} className="text-gray-400 shrink-0" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-red-50 hover:text-[#E31E2E] transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <aside className="hidden lg:block w-72 shrink-0">
          <ReadingRoomTeaser variant="sidebar" />
        </aside>
      </div>
    </article>
  );
};

export default BlogPostLayout;
