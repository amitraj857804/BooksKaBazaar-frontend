import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Store,
  LogIn,
  UserPlus,
  TrendingUp,
  Package,
  DollarSign,
  Globe,
  Zap,
  ArrowRight,
} from "lucide-react";

const SellerLanding = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Store,
      title: "Your Online Store",
      description: "Reach thousands of book lovers with your collection",
    },
    {
      icon: TrendingUp,
      title: "Track Sales",
      description: "Monitor inventory and sales in real-time",
    },
    {
      icon: Package,
      title: "Manage Inventory",
      description: "Easily add, update, and manage your book listings",
    },
    {
      icon: DollarSign,
      title: "Increase Revenue",
      description: "Expand your business and reach new customers",
    },
    {
      icon: Globe,
      title: "Nationwide Reach",
      description: "Sell to customers across the country",
    },
    {
      icon: Zap,
      title: "Easy Operations",
      description: "Simple tools to manage your seller business",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Store className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl font-bold">
                Books<span className="text-red-500">KaBazaar</span> Seller
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Grow Your Book
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                Selling Business
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of successful book sellers on BooksKaBazaar.
              Reach more customers, grow your sales, and build your brand.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/admin-register")}
                className="px-8 py-4 bg-gradient-to-r cursor-pointer from-red-600 to-red-700 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <UserPlus size={20} />
                Start Selling Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/admin-login")}
                className="px-8 py-4 bg-white/10 border cursor-pointer border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Seller Login
              </motion.button>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                <p className="text-3xl font-bold text-red-500">10K+</p>
                <p className="text-sm text-gray-400 mt-1">Active Sellers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                <p className="text-3xl font-bold text-red-500">1M+</p>
                <p className="text-sm text-gray-400 mt-1">Books Listed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                <p className="text-3xl font-bold text-red-500">₹50Cr+</p>
                <p className="text-sm text-gray-400 mt-1">Revenue Generated</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-96 hidden lg:block"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl backdrop-blur-3xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Store className="w-32 h-32 text-red-500 opacity-50" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-4">Why Sell With Us?</h3>
          <p className="text-xl text-gray-400">
            Get everything you need to succeed as a book seller
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:border-red-500/50 transition-all group"
              >
                <div className="bg-red-500/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition-colors">
                  <Icon className="text-red-500" size={28} />
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* How it Works */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl font-bold mb-4">Get Started in 3 Steps</h3>
          <p className="text-xl text-gray-400">
            Start your selling journey with BooksKaBazaar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: "1",
              title: "Register & Verify",
              description:
                "Sign up with your details and verify your email. Get approved by our superadmin to start selling.",
              icon: UserPlus,
            },
            {
              number: "2",
              title: "List Your Books",
              description:
                "Add your book collection to the platform with images, descriptions, and pricing.",
              icon: Package,
            },
            {
              number: "3",
              title: "Start Earning",
              description:
                "Receive orders, manage deliveries, and grow your revenue with our platform.",
              icon: TrendingUp,
            },
          ].map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-white/20 rounded-xl p-8">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <Icon className="text-red-500 mb-4" size={32} />
                  <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < 2 && (
                  <motion.div
                    className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="text-red-500/50" size={24} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-center"
        >
          <h3 className="text-4xl font-bold mb-4">Ready to Grow Your Business?</h3>
          <p className="text-xl text-red-100 mb-8">
            Join the largest book marketplace and reach customers across the nation
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin-register")}
            className="px-10 py-4 bg-white text-red-600 cursor-pointer rounded-lg font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center gap-2"
          >
            <UserPlus size={22} />
            Start Selling Now
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About BooksKaBazaar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => navigate("/admin-login")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Seller Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/admin-register")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Register Now
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BooksKaBazaar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellerLanding;
