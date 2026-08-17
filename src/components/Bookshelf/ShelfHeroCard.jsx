import { motion } from "framer-motion";
import {
  Clock3,
  Flame,
  ArrowRight,
  FileText,
  Book,
  BookOpen,
} from "lucide-react";

import BookProgressRing from "./BookProgressRing";
import ReadingGoalCard from "./Dashboard/ReadingGoalCard.jsx";

const currentReading = {
  title: "Atomic Habits",
  author: "James Clear",

  cover:
    "https://images-na.ssl-images-amazon.com/images/I/81F90H7hnML.jpg",

  type: "PDF",

  currentPage: 146,
  totalPages: 320,

  progress: 46,

  lastRead: "2 hours ago",

  estimatedTimeLeft: "4h 20m",

  streak: 18,

  goalMinutes: 30,

  completedMinutes: 18,
};

const getBadge = (type) => {
  switch (type) {
    case "PDF":
      return <FileText size={14} />;
    case "Reading Room":
      return <BookOpen size={14} />;
    default:
      return <Book size={14} />;
  }
};

export default function ShelfHeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-red-50 border border-gray-200 rounded-2xl shadow-sm p-8"
    >
      {/* Header */}

      <div className="flex justify-between items-start">

        <div>

          <h1 className="text-3xl font-bold text-[#0d1117]">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Continue where you left off.
          </p>

        </div>

        <div className="flex items-center gap-3 bg-white rounded-xl border px-5 py-3">

          <Flame
            className="text-[#E31E2E]"
            size={24}
          />

          <div>

            <p className="text-xs uppercase text-gray-500">
              Reading Streak
            </p>

            <h3 className="text-xl font-bold text-[#0d1117]">
              {currentReading.streak} Days
            </h3>

          </div>

        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-10">

        {/* Cover */}

        <BookProgressRing
          cover={currentReading.cover}
          progress={currentReading.progress}
        />

        {/* Details */}

        <div className="lg:col-span-1">

          <div className="flex items-center gap-2">

            <span className="bg-red-100 text-[#E31E2E] px-3 py-1 rounded-full flex items-center gap-2 text-xs font-semibold">

              {getBadge(currentReading.type)}

              {currentReading.type}

            </span>

          </div>

          <h2 className="mt-5 text-3xl font-bold text-[#0d1117]">

            {currentReading.title}

          </h2>

          <p className="text-gray-500">

            {currentReading.author}

          </p>

          <div className="space-y-3 mt-7">

            <div className="flex justify-between">

              <span className="text-gray-500">

                Page

              </span>

              <span>

                {currentReading.currentPage} / {currentReading.totalPages}

              </span>

            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${currentReading.progress}%`,
                }}
                transition={{
                  duration: 1,
                }}
                className="bg-[#E31E2E] h-full"
              />

            </div>

            <div className="flex justify-between text-sm">

              <span>

                Last Read

              </span>

              <span>

                {currentReading.lastRead}

              </span>

            </div>

            <div className="flex justify-between text-sm">

              <span>

                Estimated Left

              </span>

              <span>

                {currentReading.estimatedTimeLeft}

              </span>

            </div>

          </div>

          <button className="mt-8 bg-[#E31E2E] text-white rounded-xl px-6 py-3 font-semibold flex items-center gap-3 hover:bg-red-700 transition">

            Continue Reading

            <ArrowRight size={18} />

          </button>

        </div>

        {/* Goal */}

        <ReadingGoalCard
          completed={currentReading.completedMinutes}
          goal={currentReading.goalMinutes}
        />

      </div>

    </motion.div>
  );
}