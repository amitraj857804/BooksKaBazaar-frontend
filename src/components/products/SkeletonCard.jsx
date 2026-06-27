import { motion } from "framer-motion";

const SkeletonCard = () => {
  // Smooth, hardware-accelerated opacity pulse in unison
  const pulseAnimation = {
    initial: { opacity: 0.4 },
    animate: {
      opacity: [0.4, 0.85, 0.4],
    },
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="h-full max-w-[240px] sm:max-w-none mx-auto w-full">
      <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden p-3.5 h-full flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          {/* Image Skeleton */}
          <motion.div
            className="w-full bg-gray-200 rounded-xl h-[190px] sm:h-[210px] md:h-[230px]"
            {...pulseAnimation}
          />

          {/* Content Skeleton */}
          <div className="flex flex-col space-y-2.5">
            {/* Rating Skeleton */}
            <motion.div
              className="h-3 rounded-md w-1/2 bg-gray-200"
              {...pulseAnimation}
            />

            {/* Title Skeleton */}
            <motion.div
              className="h-4.5 rounded-md w-11/12 bg-gray-200"
              {...pulseAnimation}
            />

            {/* Author Skeleton */}
            <motion.div
              className="h-3 rounded-md w-2/5 bg-gray-200"
              {...pulseAnimation}
            />

            {/* Price Skeleton */}
            <motion.div
              className="h-5 rounded-md w-1/3 bg-gray-200"
              {...pulseAnimation}
            />
          </div>
        </div>

        {/* Buttons Row Skeleton */}
        <div className="flex items-center gap-2 mt-4 pt-1">
          {/* Heart button skeleton */}
          <motion.div
            className="w-10 h-10 rounded-xl bg-gray-200 shrink-0"
            {...pulseAnimation}
          />
          {/* Add to cart button skeleton */}
          <motion.div
            className="flex-1 h-10 rounded-xl bg-gray-200"
            {...pulseAnimation}
          />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
