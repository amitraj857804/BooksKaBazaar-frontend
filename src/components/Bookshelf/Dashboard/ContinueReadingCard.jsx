import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Book,
  FileText,
} from "lucide-react";

const getBadge = (type) => {
  switch (type) {
    case "PDF":
      return {
        icon: FileText,
        color: "bg-red-100 text-[#E31E2E]",
      };

    case "Reading Room":
      return {
        icon: BookOpen,
        color: "bg-blue-100 text-blue-600",
      };

    default:
      return {
        icon: Book,
        color: "bg-gray-100 text-gray-700",
      };
  }
};

export default function ContinueReadingCard({ book }) {
  const badge = getBadge(book.type);

  const BadgeIcon = badge.icon;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="min-w-[270px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
    >
      {/* Cover */}

      <div className="relative overflow-hidden">

        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: .3 }}
          src={book.cover}
          alt={book.title}
          className="w-full h-60 object-cover"
        />

        <div
          className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}
        >
          <BadgeIcon size={12} />

          {book.type}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">

          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${book.progress}%`,
            }}
            transition={{
              duration: 1,
            }}
            className="h-full bg-[#E31E2E]"
          />

        </div>

      </div>

      {/* Details */}

      <div className="p-4">

        <h2 className="font-bold text-lg text-[#0d1117] line-clamp-1">

          {book.title}

        </h2>

        <p className="text-gray-500 text-sm">

          {book.author}

        </p>

        <div className="flex justify-between mt-4 text-sm">

          <span>

            Page {book.currentPage}/{book.totalPages}

          </span>

          <span className="font-semibold text-[#E31E2E]">

            {book.progress}%

          </span>

        </div>

        <p className="text-xs text-gray-400 mt-2">

          Last read {book.lastRead}

        </p>

        <button className="mt-5 w-full bg-[#E31E2E] hover:bg-red-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition">

          Continue

          <ArrowRight size={16} />

        </button>

      </div>

    </motion.div>
  );
}