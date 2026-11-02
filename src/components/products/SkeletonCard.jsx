import { motion } from "framer-motion";

const pulse = {
  initial: { opacity: 0.45 },
  animate: { opacity: [0.45, 0.8, 0.45] },
  transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
};

/* Matches the new BookCard dimensions */
const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[160px] sm:w-[175px] flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
    {/* Cover */}
    <motion.div
      className="w-full h-[200px] sm:h-[220px] bg-gray-200 rounded-t-xl"
      {...pulse}
    />
    {/* Info lines */}
    <div className="px-2.5 pt-2.5 pb-2.5 flex flex-col gap-1.5">
      <motion.div className="h-2.5 rounded w-full bg-gray-200" {...pulse} />
      <motion.div className="h-2.5 rounded w-3/4 bg-gray-200" {...pulse} />
      <motion.div className="h-2   rounded w-1/2  bg-gray-200" {...pulse} />
      <motion.div className="h-2   rounded w-2/3  bg-gray-200" {...pulse} />
      <motion.div className="h-2   rounded w-1/3  bg-gray-200 mt-0.5" {...pulse} />
      {/* Action row skeleton */}
      <div className="flex gap-1.5 mt-1.5">
        <motion.div className="h-7 w-7 rounded-full bg-gray-200" {...pulse} />
        <motion.div className="h-7 flex-1 rounded-lg bg-gray-200" {...pulse} />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
