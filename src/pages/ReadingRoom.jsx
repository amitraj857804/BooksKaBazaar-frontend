import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, ChevronRight, Crown, Users, Shield, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DigitalShelf from "../components/reading-room/DigitalShelf";
import ReadingRoomReader from "../components/reading-room/ReadingRoomReader";
import { useAuth } from "../context/AuthContext";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    icon: BookOpen,
    price: 149,
    period: "month",
    badge: null,
    features: [
      "Access to 500+ titles",
      "Read on any device",
      "1 book at a time",
      "Standard support",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    icon: Star,
    price: 299,
    period: "month",
    badge: "Most Popular",
    features: [
      "Access to 2,000+ titles",
      "Read on any device",
      "3 books simultaneously",
      "10% off physical books",
      "Priority support",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    icon: Crown,
    price: 499,
    period: "month",
    badge: "Best Value",
    features: [
      "Unlimited titles",
      "Read on any device",
      "Unlimited simultaneous reads",
      "15% off physical books",
      "Early access to new arrivals",
      "Dedicated account manager",
    ],
  },
];

const STATS = [
  { value: "10,000+", label: "Books Available", icon: BookOpen },
  { value: "50,000+", label: "Active Readers", icon: Users },
  { value: "99.9%",   label: "Uptime Guarantee", icon: Shield },
];

const USER_HAS_PASS = true;

const ReadingRoom = () => {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const [readerBook, setReaderBook] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("gold");

  const handleOpenReader = (bookId) => {
    setReaderBook({ id: bookId, title: "The God of Small Things", author: "Arundhati Roy", price: 399 });
  };

  const handleGetPlan = (planId) => {
    if (!user) { openAuthModal("signup"); return; }
    alert(`Redirecting to checkout for ${planId} plan...`);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        {/* Warm accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E31E2E]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 flex flex-col lg:flex-row items-center gap-12">
          {/* Left editorial text — mirrors Bestsellers style */}
          <div className="flex-1 max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-5">
              BooksKaBazaar · Reading Room
            </p>
            {["Read.", "Anywhere.", "Instantly."].map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.h1
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.65, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  style={{ color: word === "Instantly." ? "#E31E2E" : "#1c1917" }}
                  className="font-serif text-[clamp(2.2rem,7vw,3.2rem)] font-black leading-none tracking-tighter"
                >
                  {word}
                </motion.h1>
              </div>
            ))}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ transformOrigin: "left", height: 1, background: "#ddd8cf" }}
              className="my-5"
            />
            <p className="text-stone-500 text-sm leading-relaxed mb-7 max-w-sm">
              Access thousands of digital books with one Reading Room Pass. Start reading in seconds — no waiting, no shipping.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById("plans").scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3 rounded-xl bg-[#E31E2E] hover:bg-red-700 text-white font-black text-sm transition-colors cursor-pointer shadow-md shadow-red-100"
              >
                View Plans
              </button>
              {user && USER_HAS_PASS && (
                <button
                  onClick={() => document.getElementById("shelf").scrollIntoView({ behavior: "smooth" })}
                  className="px-7 py-3 rounded-xl border border-gray-200 text-gray-700 font-black text-sm hover:border-[#E31E2E] hover:text-[#E31E2E] transition-colors cursor-pointer"
                >
                  My Shelf →
                </button>
              )}
            </div>
          </div>

          {/* Right: Stats cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 w-full max-w-xs">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E31E2E]/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#E31E2E]" />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">{value}</p>
                  <p className="text-xs text-stone-500 font-semibold">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Digital Shelf ────────────────────────────────────────────── */}
      <section id="shelf" className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-serif font-black text-gray-900">My Digital Shelf</h2>
          <p className="text-stone-500 text-sm mt-1">Continue reading where you left off</p>
        </div>
        <DigitalShelf hasActivePass={USER_HAS_PASS} onOpenReader={handleOpenReader} />
      </section>

      {/* ── Plans ────────────────────────────────────────────────────── */}
      <section id="plans" className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 mb-3">Membership</p>
            <h2 className="text-3xl font-serif font-black text-gray-900 mb-3">Choose Your Pass</h2>
            <p className="text-stone-500 max-w-lg mx-auto text-sm">
              All plans include access to our full digital library. Upgrade or cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#E31E2E] shadow-xl shadow-red-50 scale-[1.02]"
                      : "border-gray-100 hover:border-red-200 hover:shadow-md"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#E31E2E] text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                      {plan.badge}
                    </div>
                  )}

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm ${isSelected ? "bg-[#E31E2E]" : "bg-gray-100"}`}>
                    <Icon size={18} className={isSelected ? "text-white" : "text-gray-600"} />
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-black text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-400 text-sm font-semibold">/{plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleGetPlan(plan.id); }}
                    className={`w-full py-2.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#E31E2E] hover:bg-red-700 text-white shadow-md"
                        : "border border-gray-200 text-gray-700 hover:border-[#E31E2E] hover:text-[#E31E2E]"
                    }`}
                  >
                    {isSelected ? "Get This Plan" : "Select Plan"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      {/* Reader Overlay */}
      <AnimatePresence>
        {readerBook && (
          <ReadingRoomReader book={readerBook} onClose={() => setReaderBook(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadingRoom;
