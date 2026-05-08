import { useMemo } from "react";
import { motion } from "framer-motion";
import { IndianRupee, BookOpen, Package, Users, TrendingUp } from "lucide-react";

const StatsCards = ({ stats = {} }) => {
  const {
    totalRevenue = 24580,
    revenueGrowth = 12.5,
    totalBooks = 156,
    booksGrowth = 8,
    activeOrders = 342,
    ordersGrowth = 24,
    customerGrowth = 1284,
    newCustomers = 52,
  } = stats;

  const cards = useMemo(
    () => [
      {
        id: 1,
        title: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        growth: revenueGrowth,
        unit: "this month",
        icon: IndianRupee,
        bgGradient: "from-green-50 to-emerald-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        growthColor: "text-green-600",
      },
      {
        id: 2,
        title: "Total Books",
        value: totalBooks.toLocaleString(),
        growth: booksGrowth,
        unit: "new this month",
        icon: BookOpen,
        bgGradient: "from-blue-50 to-cyan-50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        growthColor: "text-blue-600",
      },
      {
        id: 3,
        title: "Active Orders",
        value: activeOrders.toLocaleString(),
        growth: ordersGrowth,
        unit: "today",
        icon: Package,
        bgGradient: "from-purple-50 to-pink-50",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        growthColor: "text-purple-600",
      },
      {
        id: 4,
        title: "Customer Growth",
        value: customerGrowth.toLocaleString(),
        growth: newCustomers,
        unit: "new signups",
        icon: Users,
        bgGradient: "from-orange-50 to-red-50",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        growthColor: "text-orange-600",
      },
    ],
    [totalRevenue, revenueGrowth, totalBooks, booksGrowth, activeOrders, ordersGrowth, customerGrowth, newCustomers]
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`bg-linear-to-br ${card.bgGradient} rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
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

            {/* Growth Indicator */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-200/50">
              <div className="flex items-center gap-1">
                <TrendingUp className={`w-4 h-4 ${card.growthColor}`} />
                <span className={`text-sm font-semibold ${card.growthColor}`}>
                  +{card.growth}%
                </span>
              </div>
              <p className="text-xs text-gray-600">{card.unit}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsCards;
