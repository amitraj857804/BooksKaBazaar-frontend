import { motion } from "framer-motion";
import { BarChart3, Users, ShoppingBag, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Sales",
      value: "$24,580",
      change: "+12.5%",
      icon: TrendingUp,
      color: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Total Books",
      value: "156",
      change: "+8 new",
      icon: ShoppingBag,
      color: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Total Orders",
      value: "342",
      change: "+24 today",
      icon: ShoppingBag,
      color: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Active Users",
      value: "1,284",
      change: "+52 today",
      icon: Users,
      color: "bg-orange-100",
      textColor: "text-orange-600",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Retrieve admin data for personalized greeting
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  const sellerName = adminData.sellerName || "Admin";
  const sellerEmail = adminData.email || "";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-r from-red-500 to-red-600 rounded-xl p-8 text-white shadow-lg flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {sellerName}!</h1>
          <p className="text-red-100">
            You have 12 pending orders and 4 new customer inquiries.
          </p>
        </div>
        
        {/* Display Seller Email on the Right Side (Optional check) */}
        {sellerEmail && (
          <div className="hidden md:block bg-red-800/30 rounded-lg py-2 px-4 border border-red-400/30 backdrop-blur-sm">
            <p className="text-sm text-red-100 font-medium">Logged in as</p>
            <p className="font-semibold text-white">{sellerEmail}</p>
          </div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={item}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((order) => (
            <div
              key={order}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">Order #{1001 + order}</p>
                <p className="text-sm text-gray-500">
                  Customer name • Today at {10 + order}:00 AM
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${(Math.random() * 100 + 50).toFixed(2)}
                </p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
