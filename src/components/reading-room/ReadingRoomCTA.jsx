import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ShoppingCart, Sparkles, Lock, Zap, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ReadingRoomCTA = ({ book, hasActivePass = false, onAddToCart, onOpenReader }) => {
  const navigate = useNavigate();
  const [showHybridInfo, setShowHybridInfo] = useState(false);

  const handleReadAction = () => {
    if (hasActivePass) {
      if (onOpenReader) onOpenReader(book?.id);
      else navigate(`/reading-room/reader/${book?.id}`);
    } else {
      navigate("/reading-room");
    }
  };

  const handleBuyAndRead = () => {
    if (onAddToCart) onAddToCart();
    toast.success("Added to cart! Read digitally right away with a Pass.", { icon: "📦", duration: 3000 });
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Divider */}
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-gray-100" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Also available digitally</span>
        <span className="h-px flex-1 bg-gray-100" />
      </div>

      {/* Hybrid Bundle Badge */}
      <motion.button
        onClick={() => setShowHybridInfo(!showHybridInfo)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-left group cursor-pointer"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className="shrink-0 w-7 h-7 rounded-full bg-[#E31E2E] flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-[#E31E2E] leading-tight">Hybrid Bundle Available</p>
          <p className="text-[11px] text-red-400 font-medium mt-0.5 leading-snug">
            Buy Physical &amp; Read Digitally instantly while it ships!
          </p>
        </div>
        <Zap size={14} className="text-red-300 shrink-0 group-hover:text-[#E31E2E] transition-colors" />
      </motion.button>

      {/* Hybrid Info Popup */}
      <AnimatePresence>
        {showHybridInfo && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="relative bg-white border border-red-100 rounded-2xl p-4 shadow-lg"
          >
            <button onClick={() => setShowHybridInfo(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={14} />
            </button>
            <p className="text-xs font-black text-[#E31E2E] mb-1">What is the Hybrid Bundle?</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Order the physical book and start reading the digital version <span className="font-bold text-[#E31E2E]">immediately</span> in our
              Reading Room — no waiting for delivery.
            </p>
            <button
              onClick={handleBuyAndRead}
              className="mt-3 w-full py-2 rounded-xl bg-[#E31E2E] hover:bg-red-700 text-white text-xs font-black transition-colors cursor-pointer"
            >
              Add Physical to Cart + Open Reading Room
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Read in Reading Room CTA */}
      <motion.button
        onClick={handleReadAction}
        className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl font-black text-sm transition-all cursor-pointer ${
          hasActivePass
            ? "bg-[#E31E2E] hover:bg-red-700 text-white shadow-md shadow-red-100"
            : "border-2 border-dashed border-red-300 text-[#E31E2E] hover:bg-red-50 bg-white"
        }`}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
      >
        {hasActivePass ? (
          <><BookOpen size={17} /><span>Open in Reader</span></>
        ) : (
          <><Lock size={15} /><span>Get a Reading Room Pass to Read</span></>
        )}
      </motion.button>

      {!hasActivePass && (
        <p className="text-center text-[11px] text-gray-400 font-medium">
          Unlimited reads from ₹149/month.{" "}
          <button onClick={() => navigate("/reading-room")} className="text-[#E31E2E] font-bold hover:underline cursor-pointer">
            Explore Plans →
          </button>
        </p>
      )}
    </div>
  );
};

export default ReadingRoomCTA;
