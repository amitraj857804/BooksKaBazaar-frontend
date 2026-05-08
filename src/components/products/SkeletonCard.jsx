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
      className="h-full"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col border border-gray-100 hover:shadow-md transition-shadow duration-300">
        {/* Image Skeleton */}
        <motion.div
          className="h-64 sm:h-72 w-full bg-gray-300"
          variants={elementVariants}
          whileInView={{
            opacity: [0.6, 0.8, 0.6],
            transition: { duration: 2, repeat: Infinity, delay: 0 },
          }}
        />

        {/* Content Skeleton */}
        <div className="p-4 sm:p-5 flex flex-col grow space-y-3">
          {/* Title Line 1 */}
          <motion.div
            className="h-6 rounded-md w-4/5 bg-gray-300"
            variants={elementVariants}
            whileInView={{
              opacity: [0.6, 0.8, 0.6],
              transition: { duration: 2, repeat: Infinity, delay: 0.1 },
            }}
          />

          {/* Title Line 2 */}
          <motion.div
            className="h-6 rounded-md w-3/5 bg-gray-300"
            variants={elementVariants}
            whileInView={{
              opacity: [0.6, 0.8, 0.6],
              transition: { duration: 2, repeat: Infinity, delay: 0.2 },
            }}
          />

          {/* Author Skeleton */}
          <motion.div
            className="h-4 rounded-md w-2/5 bg-gray-300 mt-1"
            variants={elementVariants}
            whileInView={{
              opacity: [0.6, 0.8, 0.6],
              transition: { duration: 2, repeat: Infinity, delay: 0.3 },
            }}
          />

          {/* Price Skeleton */}
          <motion.div
            className="h-8 rounded-md w-1/3 bg-gray-300 mt-1"
            variants={elementVariants}
            whileInView={{
              opacity: [0.6, 0.8, 0.6],
              transition: { duration: 2, repeat: Infinity, delay: 0.4 },
            }}
          />

          {/* Button Skeleton */}
          <motion.div
            className="h-10 rounded-lg w-full bg-gray-300 mt-auto"
            variants={elementVariants}
            whileInView={{
              opacity: [0.6, 0.8, 0.6],
              transition: { duration: 2, repeat: Infinity, delay: 0.5 },
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonCard;
