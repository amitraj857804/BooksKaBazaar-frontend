import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Store, LogIn, UserPlus, TrendingUp, Package, DollarSign,
  Globe, Zap, ArrowRight, Star, ShieldCheck, CheckCircle2,
} from "lucide-react";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";

/* ── animation presets ── */
const fadeUp   = { hidden: { opacity: 0, y: 32 },  visible: { opacity: 1, y: 0,  transition: { duration: 0.55 } } };
const fadeLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0,  transition: { duration: 0.65 } } };
const fadeRight= { hidden: { opacity: 0, x:  40 }, visible: { opacity: 1, x: 0,  transition: { duration: 0.65 } } };
const stagger  = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: Store,      title: "Your Online Store",  desc: "Reach thousands of book lovers with your curated collection from one powerful dashboard." },
  { icon: TrendingUp, title: "Track Sales",         desc: "Monitor inventory, orders and revenue in real-time with intuitive analytics." },
  { icon: Package,    title: "Manage Inventory",    desc: "Add, update and organise your entire book catalogue in minutes, not hours." },
  { icon: DollarSign, title: "Increase Revenue",    desc: "Smart pricing tools and promotional features to maximise every sale." },
  { icon: Globe,      title: "Nationwide Reach",    desc: "Deliver to customers across every corner of India through our logistics network." },
  { icon: Zap,        title: "Easy Operations",     desc: "Streamlined workflows so you can focus on books, not busywork." },
];

const steps = [
  { n: "01", Icon: UserPlus,  title: "Register & Verify",  desc: "Create your seller account, verify your email, and get approved by our team." },
  { n: "02", Icon: Package,   title: "List Your Books",     desc: "Upload your collection with photos, descriptions and competitive pricing." },
  { n: "03", Icon: TrendingUp, title: "Start Earning",      desc: "Accept orders, manage fulfilment and watch your revenue grow." },
];

const testimonials = [
  { name: "Priya Sharma",    store: "Sharma Books, Delhi",       text: "Listed 400+ books and doubled my monthly revenue within 3 months!", rating: 5 },
  { name: "Rajan Mehta",     store: "Classic Reads, Mumbai",     text: "The easiest platform to manage inventory. Customer support is excellent.", rating: 5 },
  { name: "Anita Krishnan",  store: "Page Turner, Bangalore",    text: "Nationwide reach changed my business completely. Highly recommended!", rating: 5 },
];

/* ─────────────────────────────────────── */
const SellerLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <SellerNavbar />

      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle red mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)" }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left text */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded-full mb-8 shadow-sm"
              >
                <Star size={10} className="fill-red-500 text-red-500" />
                India's #1 Book Selling Platform
              </motion.div>

              <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                Grow Your{" "}
                <span className="relative">
                  <span className="text-red-600">Book Selling</span>
                  {/* underline squiggle */}
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 300 6" preserveAspectRatio="none">
                    <path d="M0,3 Q75,0 150,3 Q225,6 300,3" stroke="#fca5a5" strokeWidth="2.5" fill="none" />
                  </svg>
                </span>{" "}
                Business
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
                Join <strong className="text-gray-700">10,000+</strong> book sellers who trust BooksKaBazaar to reach more customers, manage their inventory, and grow revenue — all from one simple dashboard.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 12px 30px -8px rgba(220,38,38,0.45)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/seller-register")}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-base flex items-center gap-2.5 cursor-pointer transition-colors shadow-lg shadow-red-200"
                >
                  <UserPlus size={20} /> Start Selling Today
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/seller-login")}
                  className="px-8 py-4 bg-white border-2 border-gray-200 hover:border-red-300 text-gray-700 hover:text-red-600 rounded-xl font-bold text-base flex items-center gap-2.5 cursor-pointer transition-all"
                >
                  <LogIn size={20} /> Seller Login
                </motion.button>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                {["No setup fee", "Free to list", "Secure payouts"].map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-green-500" />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right visual */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-[420px] h-[420px]">
                {/* Outer spinning dashed ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-dashed border-red-200"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                {/* Middle ring */}
                <motion.div
                  className="absolute inset-8 rounded-full border border-red-100"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                {/* Centre card */}
                <div className="absolute inset-16 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 shadow-2xl shadow-red-300/40 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Store size={72} className="text-white/90" />
                  </motion.div>
                </div>

                {/* Floating stat badges */}
                {[
                  { pos: { top: "2%", right: "-6%" },  label: "10K+ Sellers",    bg: "bg-white",     text: "text-gray-800" },
                  { pos: { bottom: "10%", left: "-8%" }, label: "₹50Cr+ Revenue", bg: "bg-red-600",   text: "text-white" },
                  { pos: { top: "45%", right: "-10%" }, label: "1M+ Books",       bg: "bg-red-50",    text: "text-red-700" },
                ].map((b, i) => (
                  <motion.div
                    key={i}
                    className={`absolute px-3 py-2 rounded-xl border border-gray-100 shadow-lg text-xs font-bold ${b.bg} ${b.text}`}
                    style={b.pos}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
                  >
                    {b.label}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stat bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-10 border-t border-gray-100"
          >
            {[
              { val: "10K+",   label: "Active Sellers" },
              { val: "1M+",    label: "Books Listed" },
              { val: "₹50Cr+", label: "Revenue Generated" },
              { val: "98%",    label: "Seller Satisfaction" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-extrabold text-red-600">{s.val}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-red-600 font-bold text-xs uppercase tracking-[0.18em] mb-4 bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
              Why Us
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              A complete toolkit built specifically for book sellers in India
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 24px 48px -12px rgba(220,38,38,0.12)" }}
                className="bg-white border border-gray-100 rounded-2xl p-8 transition-all group cursor-default hover:border-red-200"
              >
                <div className="w-13 h-13 w-14 h-14 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-300">
                  <Icon size={24} className="text-red-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-red-600 font-bold text-xs uppercase tracking-[0.18em] mb-4 bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
              Get Started
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Ready in 3 Simple Steps</h2>
            <p className="text-lg text-gray-500">From registration to your first sale in no time</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-red-200 via-red-400 to-red-200 z-0" />

            {steps.map(({ n, Icon, title, desc }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10"
              >
                <div className="bg-white border-2 border-gray-100 hover:border-red-200 rounded-2xl p-8 text-center transition-all hover:shadow-lg hover:shadow-red-50 group">
                  {/* Number bubble */}
                  <div className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-extrabold mx-auto mb-6 shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                    {n}
                  </div>
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 transition-colors">
                    <Icon size={20} className="text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="bg-red-600 py-24 relative overflow-hidden">
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-extrabold text-white mb-4">What Our Sellers Say</h2>
            <p className="text-lg text-red-100">Real results from real book sellers</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map(({ name, store, text, rating }, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold text-white text-sm">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <p className="text-red-200 text-xs">{store}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-2 rounded-full mb-8">
              <ShieldCheck size={13} className="text-green-500" />
              Free to Join — No Hidden Fees
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Ready to Start Your
              <br />
              <span className="text-red-600">Seller Journey?</span>
            </h2>
            <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
              Join thousands of book sellers growing their business on BooksKaBazaar. Your next customer is waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 16px 40px -8px rgba(220,38,38,0.4)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/seller-register")}
                className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 cursor-pointer transition-colors shadow-lg shadow-red-200"
              >
                <UserPlus size={22} /> Create Seller Account
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/seller-login")}
                className="px-10 py-5 bg-white border-2 border-gray-200 hover:border-red-300 text-gray-700 hover:text-red-600 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 cursor-pointer transition-all"
              >
                <LogIn size={22} /> Login to Dashboard
              </motion.button>
            </div>

            {/* Mini trust row */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-400">
              {["10,000+ active sellers", "₹50Cr+ paid out", "Secure & reliable"].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-500" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <SellerFooter />
    </div>
  );
};

export default SellerLanding;
