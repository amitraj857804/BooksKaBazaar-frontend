import { motion } from "framer-motion";

const pulse = {
  initial: { opacity: 0.45 },
  animate: { opacity: [0.45, 0.8, 0.45] },
  transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
};

/* Matches BookCard's uniform fixed dimensions */
const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[132px] sm:w-[150px] flex flex-col">
    {/* Cover */}
    <motion.div
      className="w-full h-[185px] sm:h-[210px] rounded-2xl bg-gray-200"
      {...pulse}
    />
    {/* Info lines */}
    <div className="mt-2.5 flex flex-col gap-1.5 px-0.5">
      <motion.div className="h-2.5 rounded w-11/12 bg-gray-200" {...pulse} />
      <motion.div className="h-2   rounded w-2/5   bg-gray-200" {...pulse} />
      <motion.div className="h-2.5 rounded w-1/3   bg-gray-200 mt-0.5" {...pulse} />
      <motion.div className="h-7   rounded-xl bg-gray-200 mt-1" {...pulse} />
    </div>
  </div>
);

export default SkeletonCard;
