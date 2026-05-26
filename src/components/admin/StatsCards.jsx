import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Package, AlertTriangle, Archive, RefreshCw } from "lucide-react";

const StatsCards = ({ stats = {}, isLoading = false }) => {
  const {
    totalBooks = 0,
    totalAvailable = 0,
    lowStockCount = 0,
    outOfStockCount = 0,
    totalReserved = 0,
    totalDamaged = 0,
    turnoverRate = 0,
  } = stats;

  const cards = useMemo(
    () => [
      {
        id: 1,
        title: "Unique Book Titles",
        value: totalBooks.toLocaleString(),
        growth: null, // Removed for inventory stats if irrelevant, or you can map it
        unit: "titles in catalog",
        icon: BookOpen,
        bgGradient: "from-blue-50 to-cyan-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        growthColor: "text-blue-600",
      },
      {
        id: 2,
        title: "Total Available Stock",
        value: totalAvailable.toLocaleString(),
        growth: turnoverRate,
        unit: "turnover rate",
        icon: Package,
        bgGradient: "from-green-50 to-emerald-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        growthColor: "text-green-600",
      },
      {
        id: 3,
        title: "Stock Warnings",
        value: outOfStockCount.toLocaleString(),
        growth: lowStockCount,
        unit: "items low on stock",
        icon: AlertTriangle,
        bgGradient: "from-orange-50 to-amber-50",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        growthColor: "text-orange-600",
      },
      {
        id: 4,
        title: "Non-Sellable Stock",
        value: totalDamaged.toLocaleString(),
        growth: totalReserved,
        unit: "items currently reserved",
        icon: Archive,
        bgGradient: "from-red-50 to-rose-50",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        growthColor: "text-red-600",
      },
    ],
    [totalBooks, totalAvailable, turnoverRate, outOfStockCount, lowStockCount, totalDamaged, totalReserved]
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-8 h-8 text-red-600" />
          </motion.div>
        </div>
      )}

      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`bg-linear-to-br ${card.bgGradient} rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}
          >
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className={`${card.iconBg} p-3 rounded-lg`}
                role="img"
                aria-label={card.title}
              >
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </motion.div>
            </div>

            {/* Growth/Secondary Indicator */}
            {card.growth !== null && (
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200/50 relative z-10">
                <div className="flex items-center gap-1">
                  {/* Using secondary data styling rather than just "% Growth" */}
                  <span className={`text-sm font-semibold ${card.growthColor}`}>
                    {card.growth}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium">{card.unit}</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsCards;
