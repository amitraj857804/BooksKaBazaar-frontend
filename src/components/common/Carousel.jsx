import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselSkeleton = () => {
  return (
    <div className="w-full bg-white pb-4">
      <div className="w-full relative overflow-hidden h-[180px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gray-100 border-b border-gray-100 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-center text-left space-y-3.5 sm:space-y-5">
          {/* Badge Skeleton */}
          <motion.div
            className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-200 rounded-md"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0 }}
          />

          {/* Title Line 1 Skeleton */}
          <motion.div
            className="h-8 sm:h-12 w-2/3 sm:w-1/2 md:w-1/3 bg-gray-200 rounded-md"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          />

          {/* Title Line 2 Skeleton */}
          <motion.div
            className="h-8 sm:h-12 w-1/2 sm:w-1/3 md:w-1/4 bg-gray-200 rounded-md"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Button Skeleton */}
          <motion.div
            className="h-9 sm:h-11 w-24 sm:w-32 bg-gray-200 rounded-lg mt-2"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}
          />
        </div>
      </div>
      
      {/* Mock Dots Indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        <div className="h-1.5 w-6 bg-gray-200 rounded-full"></div>
        <div className="h-1.5 w-2.5 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

const Carousel = ({ isLoading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slides = [
    {
      id: "ramcharitmanas",
      image: "/ramcharitmanas_banner.png",
      title: "Crafted For Worship.",
      subtitle: "Designed To Be Treasured.",
      badge: "A Collector's Edition Of The Timeless Epic",
      ctaText: "BUY NOW",
      gradient: "from-[#8B0000]/30 via-transparent to-[#FCD34D]/10",
      ctaAction: () => {
        const grid = document.querySelector("#book-collection-section");
        if (grid) {
          grid.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    {
      id: "summer_sale",
      image: "/summer_sale_banner.png",
      title: "Summer Sale Bestsellers.",
      subtitle: "Up to 50% off on all items.",
      badge: "Exclusive Reading Festival Offer",
      ctaText: "SHOP NOW",
      gradient: "from-sky-900/20 via-transparent to-[#8B0000]/10",
      ctaAction: () => {
        const grid = document.querySelector("#book-collection-section");
        if (grid) {
          grid.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  ];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay logic
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, handleNext]);

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  // Framer Motion slide variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 260, damping: 26 },
        opacity: { duration: 0.5 }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 260, damping: 26 },
        opacity: { duration: 0.5 }
      }
    })
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="w-full bg-white pb-4">
      <div 
        className="w-full relative overflow-hidden h-[180px] sm:h-[300px] md:h-[350px] lg:h-[400px] group/carousel border-b border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center"
          >
            {/* Banner Image Background */}
            <img 
              src={currentSlide.image} 
              alt={currentSlide.title} 
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
            
            {/* Gradient Overlay for Text Readability */}
            <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient}`}></div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto w-full flex flex-col justify-center text-left select-none">
                
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#FCD34D] text-[#78350F] text-[9px] sm:text-xs md:text-sm font-extrabold px-3 py-1 sm:py-1.5 rounded-md border border-[#FCD34D]/25 self-start mb-2 sm:mb-4 shadow-sm"
                >
                  {currentSlide.badge}
                </motion.div>

                {/* Title & Subtitle */}
                <motion.h2 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#5C2E0B] leading-tight drop-shadow-sm font-serif"
                  style={{ color: currentSlide.id === "ramcharitmanas" ? "#FFE9A0" : "#2E3B5C" }}
                >
                  <span className="block">{currentSlide.title}</span>
                  <span className="block font-sans text-gray-800" style={{ color: currentSlide.id === "ramcharitmanas" ? "#FFFFFF" : "#4A5568" }}>
                    {currentSlide.subtitle}
                  </span>
                </motion.h2>

                {/* BUY NOW Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 sm:mt-6"
                >
                  <button
                    onClick={currentSlide.ctaAction}
                    className="px-6 py-2.5 sm:px-8 sm:py-3.5 bg-white text-gray-900 font-extrabold text-xs sm:text-sm rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer tracking-wider"
                    style={{ color: "#E31E2E" }}
                  >
                    {currentSlide.ctaText}
                  </button>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows positioned on edges */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-gray-50 text-gray-800 shadow-md border border-gray-100 flex items-center justify-center transition-all cursor-pointer z-20 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 scale-90 sm:scale-100 hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-gray-50 text-gray-800 shadow-md border border-gray-100 flex items-center justify-center transition-all cursor-pointer z-20 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 scale-90 sm:scale-100 hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

      </div>

      {/* Dots Indicator placed OUTSIDE/BELOW the container */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
              index === currentIndex 
                ? "bg-[#E31E2E] w-6" 
                : "bg-gray-300 hover:bg-gray-400 w-2.5"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
