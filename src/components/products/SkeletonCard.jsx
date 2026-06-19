import { motion } from "framer-motion";

const SkeletonCard = () => {
  // Container with sequential element reveals
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0,
      },
    },
  };

  // Individual element animations with pulse effect
  const elementVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="h-full max-w-[240px] sm:max-w-none mx-auto w-full"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden p-3.5 h-full flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          {/* Image Skeleton */}
          <motion.div
            className="w-full bg-gray-200 rounded-xl h-[190px] sm:h-[210px] md:h-[230px]"
            variants={elementVariants}
            whileInView={{
              opacity: [0.6, 0.8, 0.6],
              transition: { duration: 2, repeat: Infinity, delay: 0 },
            }}
          />

          {/* Content Skeleton */}
          <div className="flex flex-col space-y-2.5">
            {/* Rating Skeleton */}
            <motion.div
              className="h-3 rounded-md w-1/2 bg-gray-200"
              variants={elementVariants}
              whileInView={{
                opacity: [0.6, 0.8, 0.6],
                transition: { duration: 2, repeat: Infinity, delay: 0.1 },
              }}
            />

            {/* Title Skeleton */}
            <motion.div
              className="h-4.5 rounded-md w-11/12 bg-gray-200"
              variants={elementVariants}
              whileInView={{
                opacity: [0.6, 0.8, 0.6],
                transition: { duration: 2, repeat: Infinity, delay: 0.2 },
              }}
            />

            {/* Author Skeleton */}
            <motion.div
              className="h-3 rounded-md w-2/5 bg-gray-200"
              variants={elementVariants}
              whileInView={{
                opacity: [0.6, 0.8, 0.6],
                transition: { duration: 2, repeat: Infinity, delay: 0.3 },
              }}
            />

            {/* Price Skeleton */}
            <motion.div
              className="h-5 rounded-md w-1/3 bg-gray-200"
              variants={elementVariants}
              whileInView={{
                opacity: [0.6, 0.8, 0.6],
                transition: { duration: 2, repeat: Infinity, delay: 0.4 },
              }}
            />
          </div>
        </div>

        {/* Buttons Row Skeleton */}
        <div className="flex items-center gap-2 mt-4 pt-1">
          {/* Heart button skeleton */}
          <motion.div
            className="w-10 h-10 rounded-xl bg-gray-200 shrink-0"
            variants={elementVariants}
            whileInView={{
              opacity: [0.6, 0.8, 0.6],
              transition: { duration: 2, repeat: Infinity, delay: 0.5 },
            }}
          />
          {/* Add to cart button skeleton */}
          <motion.div
            className="flex-1 h-10 rounded-xl bg-gray-200"
            variants={elementVariants}
            whileInView={{
              opacity: [0.6, 0.8, 0.6],
              transition: { duration: 2, repeat: Infinity, delay: 0.6 },
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonCard;
