import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, RefreshCw, Play, CheckCircle, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_PASS = {
  name: "Gold Monthly Pass",
  renewsInDays: 12,
  booksReadThisMonth: 4,
};

const MOCK_BORROWED_BOOKS = [
  {
    id: 101,
    title: "The God of Small Things",
    author: "Arundhati Roy",
    progress: 68,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=180&fit=crop",
    category: "Fiction",
  },
  {
    id: 102,
    title: "Sapiens: A Brief History",
    author: "Yuval Noah Harari",
    progress: 23,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&h=180&fit=crop",
    category: "Non Fiction",
  },
  {
    id: 103,
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    progress: 91,
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=180&fit=crop",
    category: "Biography",
  },
];

const DigitalShelf = ({ hasActivePass = true, onOpenReader }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState(MOCK_BORROWED_BOOKS);

  const handleReturn = (bookId) => setBooks((prev) => prev.filter((b) => b.id !== bookId));
  const handleRead = (bookId) => {
    if (onOpenReader) onOpenReader(bookId);
    else navigate(`/reading-room/reader/${bookId}`);
  };

  if (!hasActivePass) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-red-200 bg-red-50/40 p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <BookOpen size={24} className="text-[#E31E2E]" />
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2">No Active Pass</h3>
        <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
          Get a Reading Room Pass to access thousands of digital books instantly.
        </p>
        <button
          onClick={() => navigate("/reading-room")}
          className="px-6 py-2.5 rounded-xl bg-[#E31E2E] hover:bg-red-700 text-white text-sm font-black transition-colors cursor-pointer"
        >
          Explore Plans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pass Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-5 text-white shadow-md"
        style={{ background: "linear-gradient(135deg, #E31E2E 0%, #b91c1c 100%)" }}
      >
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star size={13} className="text-yellow-300 fill-yellow-300" />
              <span className="text-xs font-black uppercase tracking-widest text-red-200">Active Pass</span>
            </div>
            <h3 className="text-xl font-black">{MOCK_PASS.name}</h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Clock size={13} className="text-red-200" />
              <span className="text-sm text-red-100 font-semibold">Renews in {MOCK_PASS.renewsInDays} days</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold text-red-200 uppercase tracking-wider mb-0.5">This Month</p>
            <p className="text-3xl font-black text-white">{MOCK_PASS.booksReadThisMonth}</p>
            <p className="text-xs text-red-200">books read</p>
          </div>
        </div>

        <div className="relative mt-4 flex items-center gap-3">
          <CheckCircle size={14} className="text-green-300 shrink-0" />
          <span className="text-xs font-semibold text-red-100">Unlimited reads · Priority access · Offline mode</span>
        </div>
      </motion.div>

      {/* Borrowed books */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
            <BookOpen size={17} className="text-[#E31E2E]" />
            Current Active Shelf
          </h3>
          <span className="text-xs text-gray-400 font-semibold">{books.length} books</span>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <BookOpen size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">Your shelf is empty</p>
            <p className="text-xs mt-1">Browse books and start reading!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex gap-3"
              >
                <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 shadow-sm">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1543565521-bcf289c60034?w=120&h=180&fit=crop"; }} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-900 leading-tight truncate">{book.title}</p>
                    <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{book.author}</p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-400 font-semibold">Progress</span>
                      <span className="text-[10px] font-black text-[#E31E2E]">{book.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "#E31E2E" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${book.progress}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleRead(book.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#E31E2E] hover:bg-red-700 text-white text-[11px] font-black transition-colors cursor-pointer"
                    >
                      <Play size={10} className="fill-white" />
                      Read Now
                    </button>
                    <button
                      onClick={() => handleReturn(book.id)}
                      className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#E31E2E] hover:border-red-200 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <RefreshCw size={10} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalShelf;
