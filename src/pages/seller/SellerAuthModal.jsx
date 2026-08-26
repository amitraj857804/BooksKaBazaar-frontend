import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation , Link } from "react-router-dom";
import SellerLogin from "./SellerLogin";
import SellerRegister from "./SellerRegister";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";
import { Store, TrendingUp, ShieldCheck, Star, CheckCircle2, BookOpen } from "lucide-react";

/* ─────────────────────────────────────────── */
const AdminAuthModal = () => {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ If seller is already logged in, skip auth and go straight to dashboard
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/seller/dashboard", { replace: true });
    }
  }, [navigate]);

  // Sync login/register mode from URL path
  useEffect(() => {
    setMode(location.pathname === "/seller-register" ? "register" : "login");
  }, [location.pathname]);

  const switchMode = (m) => {
    setMode(m);
    navigate(m === "register" ? "/seller-register" : "/seller-login");
  };

  const navigateToSellerLanPage = () => {
    navigate("/seller");
  };

  const stats = [
    { val: "10K+", label: "Active Sellers" },
    { val: "1M+",  label: "Books Listed"  },
    { val: "98%",  label: "Satisfaction"  },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#fafafa" }}>
      <SellerNavbar />

      <style>{`
        .auth-scroll::-webkit-scrollbar { display: none; }
        .auth-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes floatY2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .float-1 { animation: floatY  3s ease-in-out infinite; }
        .float-2 { animation: floatY2 4s ease-in-out 0.8s infinite; }
        .float-3 { animation: floatY  3.5s ease-in-out 1.5s infinite; }
      `}</style>

      {/* Page background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-60 -right-60 w-[800px] h-[800px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 65%)" }} />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 65%)" }} />
      </div>

      {/* Centred card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl flex rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 32px 80px -16px rgba(220,38,38,0.12), 0 0 0 1px rgba(0,0,0,0.04)" }}
        >

          {/* ══════ LEFT BRAND PANEL ══════ */}
          <div
            className="hidden lg:flex flex-col w-[380px] shrink-0 relative overflow-hidden p-10"
            style={{ background: "linear-gradient(145deg, #dc2626 0%, #b91c1c 45%, #7f1d1d 100%)" }}
          >
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-black/10" />
            <div className="absolute top-1/2 right-0 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

            {/* Logo */}
            <div onClick={navigateToSellerLanPage}
              className="relative z-10 flex justify-center  items-center cursor-pointer group"
            >
              <Link
                to="/seller"
                className="shrink-0 font-black border-1 border-white/40 shadow-lg p-2 rounded-full sm:text-2xl text-lg tracking-tighter cursor-pointer select-none flex items-center gap-1 justify-start lg:justify-start flex-1 lg:flex-initial"
              >
                <img
                  src="/favicon no bg.png"
                  alt="Books Ka Bazaar"
                  className="h-16 w-auto object-contain"
                />
              </Link>
              <div>
                
              </div>
            </div>

            {/* Floating icon cluster */}
            <div className="relative z-10 flex justify-center mb-10">
              <div className="relative w-44 h-44">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-xl" />
                <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm float-1">
                  <BookOpen size={28} className="text-white" />
                </div>
                <div className="absolute top-8 right-2 w-12 h-12 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm float-2">
                  <TrendingUp size={20} className="text-white/80" />
                </div>
                <div className="absolute bottom-2 left-10 w-14 h-14 bg-white/20 border border-white/25 rounded-2xl flex items-center justify-center backdrop-blur-sm float-3">
                  <ShieldCheck size={22} className="text-white" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 border-2 border-white/30 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <Store size={32} className="text-white" />
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="relative z-10 mb-8">
              <h2 className="text-white font-extrabold text-2xl leading-tight mb-3">
                Grow Your<br />
                <span className="text-red-200">Book Selling</span> Business
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Join India's fastest growing book marketplace and reach thousands of eager readers.
              </p>
            </div>

            {/* Stats */}
            <div className="relative z-10 grid grid-cols-3 gap-3 mb-8">
              {stats.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/15 border border-white/20 rounded-xl p-3 text-center backdrop-blur-sm"
                >
                  <p className="text-white font-extrabold text-lg leading-none">{s.val}</p>
                  <p className="text-white/60 text-[10px] mt-1 font-medium leading-tight">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust pills */}
            <div className="relative z-10 flex flex-col gap-2">
              {["No setup fee — Free to list", "Secure & fast payouts", "Nationwide delivery network"].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-green-300 shrink-0" />
                  <span className="text-white/70 text-xs">{t}</span>
                </div>
              ))}
            </div>

            
          </div>

          {/* ══════ RIGHT FORM PANEL ══════ */}
          <div className="flex-1 bg-white flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto auth-scroll px-6 sm:px-10 py-8 max-h-[88vh]">

              

              {/* Contextual heading */}
              <div className="mb-8">
                <AnimatePresence mode="wait">
                  {mode === "login" ? (
                    <motion.div key="h-login"
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back!</h1>
                      <p className="text-sm text-gray-500">Sign in to your seller dashboard.</p>
                    </motion.div>
                  ) : (
                    <motion.div key="h-register"
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h1>
                      <p className="text-sm text-gray-500">Start selling books on Books Ka Bazaar today.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tab Switcher */}
              <div className="relative flex mb-8 rounded-xl border border-gray-100 bg-gray-50 p-1 gap-1"
                style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)" }}
              >
                <motion.div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-red-600 rounded-lg"
                  style={{ boxShadow: "0 4px 14px -4px rgba(220,38,38,0.5)" }}
                  animate={{ x: mode === "register" ? "calc(100% + 2px)" : "0%" }}
                  transition={{ type: "spring", stiffness: 420, damping: 38 }}
                />
                <button onClick={() => switchMode("login")}
                  className={`relative z-10 flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                    mode === "login" ? "text-white" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Login
                </button>
                <button onClick={() => switchMode("register")}
                  className={`relative z-10 flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                    mode === "register" ? "text-white" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  Register
                </button>
              </div>

              {/* Form */}
              <AnimatePresence mode="wait" initial={false}>
                {mode === "login" ? (
                  <motion.div key="login"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  >
                    <SellerLogin isInModal={true} />
                  </motion.div>
                ) : (
                  <motion.div key="register"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  >
                    <SellerRegister isInModal={true} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          
          </div>

        </motion.div>
      </div>

      <SellerFooter />
    </div>
  );
};

export default AdminAuthModal;
