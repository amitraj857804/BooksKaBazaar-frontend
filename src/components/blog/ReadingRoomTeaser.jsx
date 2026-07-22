import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * ReadingRoomTeaser
 * Props: variant — "sidebar" | "inline"
 */
const ReadingRoomTeaser = ({ variant = "inline" }) => {
  const navigate = useNavigate();

  if (variant === "sidebar") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="sticky top-28 rounded-2xl overflow-hidden shadow-sm border border-gray-100"
      >
        {/* Red header */}
        <div className="bg-[#E31E2E] p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-200">Reading Room</span>
          </div>
          <h3 className="text-base font-black leading-tight mb-1">Unlock Unlimited Reading</h3>
          <p className="text-sm text-red-100 leading-relaxed">
            Access 10,000+ titles like this one — instantly, on any device.
          </p>
        </div>

        {/* Body */}
        <div className="bg-white p-4 space-y-3">
          {["10,000+ titles", "Read on any device", "From ₹149/month"].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <Zap size={13} className="text-yellow-500 fill-yellow-400 shrink-0" />
              <span className="font-semibold">{f}</span>
            </div>
          ))}
          <button
            onClick={() => navigate("/reading-room")}
            className="w-full mt-2 py-2.5 rounded-xl bg-[#E31E2E] hover:bg-red-700 text-white text-sm font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            Explore Plans <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    );
  }

  // Inline
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-8 rounded-2xl bg-red-50 border border-red-100 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      <div className="w-11 h-11 rounded-xl bg-[#E31E2E] flex items-center justify-center shrink-0 shadow-sm shadow-red-200">
        <BookOpen size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-gray-900 leading-tight">
          Unlock unlimited access to 1,000+ titles like this one
        </p>
        <p className="text-xs text-stone-500 font-medium mt-0.5">
          Reading Room Pass — starting at ₹149/month. Cancel anytime.
        </p>
      </div>
      <button
        onClick={() => navigate("/reading-room")}
        className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E31E2E] hover:bg-red-700 text-white text-xs font-black transition-colors cursor-pointer whitespace-nowrap"
      >
        Get Pass <ChevronRight size={13} />
      </button>
    </motion.div>
  );
};

export default ReadingRoomTeaser;
