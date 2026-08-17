import { motion } from "framer-motion";

export default function BookProgressRing({
  cover,
  progress,
}) {
  const radius = 90;

  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (progress / 100) * circumference;

  return (
    <motion.div
      initial={{
        scale: .9,
      }}
      animate={{
        scale: 1,
      }}
      className="flex justify-center"
    >
      <div className="relative w-[220px] h-[220px]">

        <svg
          className="absolute inset-0 -rotate-90"
          width="220"
          height="220"
        >
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />

          <motion.circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#E31E2E"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{
              strokeDashoffset: circumference,
            }}
            animate={{
              strokeDashoffset: offset,
            }}
            transition={{
              duration: 1.2,
            }}
          />
        </svg>

        <div className="absolute inset-5 rounded-xl overflow-hidden shadow-lg">

          <img
            src={cover}
            className="w-full h-full object-cover"
            alt=""
          />

          <div className="absolute bottom-0 left-0 right-0 bg-[#0d1117]/80 text-white text-center py-2">

            {progress}% Read

          </div>

        </div>

      </div>
    </motion.div>
  );
}