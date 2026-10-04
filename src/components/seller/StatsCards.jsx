import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Package, AlertTriangle, Archive, RefreshCw, PenLine } from "lucide-react";

const StatsCards = ({ stats = {}, isLoading = false, onAddBook }) => {
  const {
    totalBooks = 0,
    totalAvailable = 0,
    lowStockCount = 0,
    outOfStockCount = 0,
    totalReserved = 0,
    totalDamaged = 0,
  } = stats;

  const cards = useMemo(
    () => [
      {
        id: 1,
        title: "Total Books",
        value: totalBooks,
        sub: `${totalBooks} live · ${totalDamaged} draft · ${totalReserved} inactive`,
        subColors: ["text-green-600", "text-gray-400", "text-orange-500"],
        icon: BookOpen,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-500",
      },
      {
        id: 2,
        title: "Total Stock",
        value: totalAvailable.toLocaleString("en-IN"),
        sub: "Across all books",
        subColor: "text-gray-400",
        icon: Package,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-400",
      },
      {
        id: 3,
        title: "Out of Stock",
        value: outOfStockCount,
        sub: "Books",
        subColor: "text-gray-400",
        icon: AlertTriangle,
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
      },
      {
        id: 4,
        title: "Low Stock",
        value: lowStockCount,
        sub: "Books",
        subColor: "text-gray-400",
        icon: Archive,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-400",
      },
      {
        id: 5,
        title: "Draft Listings",
        value: totalDamaged,
        sub: "Not published",
        subColor: "text-gray-400",
        icon: PenLine,
        iconBg: "bg-gray-50",
        iconColor: "text-gray-400",
      },
    ],
    [totalBooks, totalAvailable, outOfStockCount, lowStockCount, totalDamaged, totalReserved]
  );

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
            <RefreshCw className="w-6 h-6 text-red-600" />
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-2"
            >
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <Icon size={18} className={card.iconColor} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</p>
              </div>
              {/* sub line — special case for Total Books */}
              {card.id === 1 ? (
                <p className="text-xs">
                  <span className="text-green-600 font-medium">{totalBooks} live</span>
                  <span className="text-gray-400"> · {totalDamaged} draft</span>
                  <span className="text-orange-500"> · {totalReserved} inactive</span>
                </p>
              ) : (
                <p className={`text-xs ${card.subColor}`}>{card.sub}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsCards;
