import { Clock3 } from "lucide-react";
import { motion } from "framer-motion";

export default function ReadingGoalCard({
  completed,
  goal,
}) {
  const percentage =
    (completed / goal) * 100;

  return (
    <div className="border rounded-xl p-6 bg-white">

      <div className="flex items-center gap-2 text-[#E31E2E] font-semibold">

        <Clock3 size={20} />

        Today's Goal

      </div>

      <h2 className="text-3xl font-bold mt-6">

        {goal} mins

      </h2>

      <p className="text-gray-500 mt-2">

        Read every day to keep your streak alive.

      </p>

      <div className="mt-8">

        <div className="flex justify-between">

          <span>

            {completed}/{goal} mins

          </span>

          <span>

            {Math.round(percentage)}%

          </span>

        </div>

        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${percentage}%`,
            }}
            transition={{
              duration: 1,
            }}
            className="bg-[#E31E2E] h-full"
          />

        </div>

      </div>

      <div className="mt-8 rounded-xl bg-red-50 p-4">

        <p className="font-semibold text-[#E31E2E]">

          🔥 Great job!

        </p>

        <p className="text-sm text-gray-600 mt-2">

          Only {goal - completed} minutes left to complete today's goal.

        </p>

      </div>

    </div>
  );
}