import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  // Container animation with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Text elements animation
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Book image floating animation
  const floatingVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <section className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            className="flex flex-col justify-center space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Subtitle */}
            <motion.div variants={textVariants} className="flex items-center gap-3">
              <div className="w-12 h-1 bg-red-600 rounded-full"></div>
              <span className="text-red-600 font-semibold uppercase tracking-widest text-sm">
                Welcome to BooksKaBazaar
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={textVariants}
              className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
            >
              Your Gateway to <span className="text-red-600">Infinite Stories</span>
            </motion.h1>

            {/* Subtitle Text */}
            <motion.p
              variants={textVariants}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Discover thousands of books across every genre. From timeless classics to contemporary bestsellers, find your next great read at BooksKaBazaar.
            </motion.p>

            {/* CTA Button with Hover Scale */}
            <motion.div variants={textVariants} className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transition-shadow flex items-center gap-2 group"
              >
                Start Reading
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:border-red-600 hover:text-red-600 transition-colors"
              >
                Explore Categories
              </motion.button>
            </motion.div>

            {/* Stats or Feature List */}
            <motion.div
              variants={textVariants}
              className="flex gap-8 pt-8 text-sm"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-600">50K+</span>
                <span className="text-gray-600">Books Available</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-600">100K+</span>
                <span className="text-gray-600">Happy Readers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-600">24/7</span>
                <span className="text-gray-600">Support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - 3D Book Stack Visualization */}
          <motion.div
            className="flex items-center justify-center"
            variants={floatingVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              animate={floatingAnimation}
              className="relative w-full aspect-square max-w-md"
            >
              {/* Book Stack Placeholder with CSS */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Back book - Blue */}
                <div className="absolute w-32 h-48 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-2xl transform -rotate-12 -translate-x-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-center px-4">Novel</span>
                  </div>
                </div>

                {/* Middle book - Green */}
                <div className="absolute w-32 h-48 bg-gradient-to-br from-green-600 to-green-800 rounded-lg shadow-xl transform translate-y-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-center px-4">Poetry</span>
                  </div>
                </div>

                {/* Front book - Red */}
                <div className="absolute w-32 h-48 bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-2xl transform rotate-12 translate-x-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-center px-4">Science</span>
                  </div>
                </div>
              </div>

              {/* Decorative background circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-red-100 rounded-full opacity-20 blur-3xl"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
