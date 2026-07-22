import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sun, Moon, Coffee, ChevronLeft, ChevronRight,
  BookOpen, ShoppingCart, ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MOCK_CHAPTERS = [
  {
    id: 1,
    title: "Chapter 1: The Beginning",
    content: `The morning light filtered through dusty curtains as Arjun opened the old leather-bound book for the first time. The pages were yellowed with age, each one carrying the faint scent of sandalwood and time. He had inherited it from his grandfather, a man who had believed that every book held a doorway to another world.

"Knowledge is the only treasure that multiplies when shared," his grandfather had often said, pressing a warm cup of chai into young Arjun's hands. Back then, Arjun had nodded obediently without truly understanding. Now, at thirty-two, holding the weight of those words along with the weight of the book, he finally grasped their meaning.

He settled into the worn armchair by the window and began to read. Outside, the city hummed its relentless morning song — auto-rickshaws, temple bells, the distant cry of a vegetable vendor. But none of it reached him anymore. He was already somewhere else entirely.`,
  },
  {
    id: 2,
    title: "Chapter 2: The Library",
    content: `The library was not what Vikram had expected. He had imagined towering stone columns, solemn-faced scholars, perhaps the echo of important thoughts bouncing off marble floors. Instead, he found a warm, chaotic place — full of debate, laughter, and the constant rustle of manuscripts being unrolled and compared.

A librarian, ancient in the way only truly learned people seem, spotted him immediately. His eyes, sharp despite the thick silver brows above them, scanned Vikram from sandal to topknot.

"You walked from Mithila?" he asked, without preamble.

"Four hundred and twelve kilometers," Vikram confirmed, trying not to wince. His feet were still raw.

The old man nodded slowly, as if weighing something invisible. "And what do you seek?"

It was the question Vikram had rehearsed for months. But standing here now, only three words came out: "I don't know."

The librarian smiled — the deepest, most satisfied smile Vikram had ever seen. "Good," he said. "Then you are ready."`,
  },
  {
    id: 3,
    title: "Chapter 3: Understanding",
    content: `Two years passed. Vikram read. He argued. He sat in silence for entire days, contemplating a single line of text until its meaning bloomed inside him like a lotus opening at dawn — slowly, inevitably, completely.

He made friends with scholars from lands whose names he had barely heard. A physician from the southern coast who believed the body and the mind were one territory with a porous border. A mathematician from Persia who spoke of numbers as if they were alive.

It was the mathematician, Farrukh, who gave Vikram the idea that would change everything.

"The library collects knowledge," Farrukh observed one evening, watching fireflies drift across the courtyard. "But who decides which knowledge is worth collecting? And who decides what is forgotten?"

Vikram had no answer. But the question embedded itself in him like a seed in dark soil, and began, quietly, to grow.`,
  },
];

const THEMES = {
  light: {
    bg: "bg-white", text: "text-gray-900", toolbar: "bg-gray-50 border-gray-200",
    page: "bg-white", border: "border-gray-200", label: "Light",
    banner: "bg-red-50 border-red-100 text-gray-800",
  },
  sepia: {
    bg: "bg-[#f4ede4]", text: "text-[#3d2b1f]", toolbar: "bg-[#ede3d6] border-[#c9b59a]",
    page: "bg-[#f4ede4]", border: "border-[#c9b59a]", label: "Sepia",
    banner: "bg-[#e8dac8] border-[#c9b59a] text-[#3d2b1f]",
  },
  dark: {
    bg: "bg-gray-950", text: "text-gray-100", toolbar: "bg-gray-900 border-gray-800",
    page: "bg-gray-950", border: "border-gray-800", label: "Dark",
    banner: "bg-gray-800 border-gray-700 text-gray-100",
  },
};

const ReadingRoomReader = ({ book, onClose, onAddToCart }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(18);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const contentRef = useRef(null);

  const t = THEMES[theme];
  const chapter = MOCK_CHAPTERS[currentChapterIndex];
  const progress = Math.round(((currentChapterIndex + 1) / MOCK_CHAPTERS.length) * 100);

  // Content Protection
  useEffect(() => {
    const preventCopy = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "c") e.preventDefault(); };
    const preventContextMenu = (e) => e.preventDefault();
    const preventSelectStart = (e) => { if (contentRef.current?.contains(e.target)) e.preventDefault(); };
    document.addEventListener("keydown", preventCopy);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("selectstart", preventSelectStart);
    return () => {
      document.removeEventListener("keydown", preventCopy);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("selectstart", preventSelectStart);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart();
    else toast.success("Added to cart with 10% Pass Member discount!", { icon: "📦" });
    setShowBanner(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[9999] flex flex-col ${t.bg}`}
    >
      {/* Toolbar */}
      <div className={`shrink-0 flex items-center justify-between px-4 py-2.5 border-b ${t.toolbar} gap-3`}>
        {/* Left: Close + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose || (() => navigate(-1))}
            className={`p-1.5 rounded-lg hover:bg-black/10 transition-colors cursor-pointer shrink-0 ${t.text}`}
          >
            <X size={18} />
          </button>
          <div className="min-w-0">
            <p className={`text-xs font-black truncate ${t.text}`}>{book?.title || "Reading Room"}</p>
            <p className={`text-[10px] opacity-60 truncate ${t.text}`}>{book?.author}</p>
          </div>
        </div>

        {/* Center: Chapter nav */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentChapterIndex((i) => Math.max(i - 1, 0))}
            disabled={currentChapterIndex === 0}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 ${t.text} hover:bg-black/10`}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowChapterMenu((v) => !v)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${t.text} hover:bg-black/10 transition-colors cursor-pointer`}
            >
              <BookOpen size={13} />
              <span className="hidden sm:inline">{chapter.title}</span>
              <span className="sm:hidden">Ch. {currentChapterIndex + 1}</span>
              <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {showChapterMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 w-64 rounded-xl border shadow-xl z-50 py-1 overflow-hidden ${t.toolbar}`}
                >
                  {MOCK_CHAPTERS.map((ch, i) => (
                    <button
                      key={ch.id}
                      onClick={() => { setCurrentChapterIndex(i); setShowChapterMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                        i === currentChapterIndex ? "text-[#E31E2E] bg-red-50/50" : `${t.text} hover:bg-black/5`
                      }`}
                    >
                      {ch.title}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setCurrentChapterIndex((i) => Math.min(i + 1, MOCK_CHAPTERS.length - 1))}
            disabled={currentChapterIndex === MOCK_CHAPTERS.length - 1}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 ${t.text} hover:bg-black/10`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Font + Theme */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => setFontSize((p) => Math.max(p - 2, 12))} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black cursor-pointer hover:bg-black/10 ${t.text}`}>A-</button>
          <button onClick={() => setFontSize((p) => Math.min(p + 2, 28))} className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black cursor-pointer hover:bg-black/10 ${t.text}`}>A+</button>
          <div className={`flex items-center rounded-lg border overflow-hidden ${t.border}`}>
            <button onClick={() => setTheme("light")} title="Light" className={`w-7 h-7 flex items-center justify-center cursor-pointer transition-colors ${theme === "light" ? "bg-yellow-100 text-yellow-600" : `hover:bg-black/5 ${t.text}`}`}><Sun size={13} /></button>
            <button onClick={() => setTheme("sepia")} title="Sepia" className={`w-7 h-7 flex items-center justify-center cursor-pointer transition-colors ${theme === "sepia" ? "bg-amber-100 text-amber-700" : `hover:bg-black/5 ${t.text}`}`}><Coffee size={13} /></button>
            <button onClick={() => setTheme("dark")} title="Dark" className={`w-7 h-7 flex items-center justify-center cursor-pointer transition-colors ${theme === "dark" ? "bg-gray-700 text-gray-100" : `hover:bg-black/5 ${t.text}`}`}><Moon size={13} /></button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-gray-200/40 shrink-0">
        <motion.div className="h-full bg-[#E31E2E]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>

      {/* Content */}
      <div ref={contentRef} className={`flex-1 overflow-y-auto ${t.page} select-none`} style={{ userSelect: "none", WebkitUserSelect: "none" }}>
        <div className="max-w-2xl mx-auto px-6 py-10 sm:py-16">
          <motion.div key={currentChapterIndex} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h2 className={`font-serif font-black mb-8 text-center ${t.text}`} style={{ fontSize: `${fontSize + 4}px`, lineHeight: 1.3 }}>
              {chapter.title}
            </h2>
            {chapter.content.split("\n\n").map((para, i) => (
              <p key={i} className={`mb-6 leading-relaxed font-serif ${t.text}`} style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}>
                {para}
              </p>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Sticky conversion banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className={`shrink-0 border-t flex items-center justify-between px-4 py-3 gap-3 ${t.banner}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingCart size={15} className="shrink-0 text-[#E31E2E]" />
              <p className="text-xs font-semibold leading-tight">
                <span className="font-black">Enjoying this book?</span> Order the Physical Copy —{" "}
                <span className="font-black text-[#E31E2E]">10% off</span> for Pass Members.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleAddToCart} className="px-3 py-1.5 rounded-lg bg-[#E31E2E] hover:bg-red-700 text-white text-[11px] font-black transition-colors cursor-pointer whitespace-nowrap">
                Add to Cart
              </button>
              <button onClick={() => setShowBanner(false)} className="p-1 rounded cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReadingRoomReader;
