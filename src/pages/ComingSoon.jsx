import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  BookOpen,
  Sparkles,
  Mail,
  ArrowRight,
  CheckCircle2,
  Search,
  Library,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

const instagramIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const twitterIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const linkedinIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const githubIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ComingSoon() {
  // Fixed target launch date to prevent resetting daily
  const [targetDate] = useState(() => {
    const envDate = import.meta.env.VITE_LAUNCH_DATE;
    if (envDate) {
      const parsed = Date.parse(envDate);
      if (!isNaN(parsed)) return parsed;
    }
    // Default fallback: exactly July 15, 2026 at 00:00:00
    return new Date("2026-07-15T00:00:00").getTime();
  });

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Calculate remaining time
  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      try {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              to_email: email,
              reply_to: "no-reply@bookskabazaar.com",
              subject: "Welcome to BooksKaBazaar!",
              message: "Thank you for subscribing to the BooksKaBazaar coming soon list. We will notify you once we launch!",
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send subscription mail via EmailJS.");
        }
      } catch (err) {
        console.error("EmailJS Error:", err);
      }
    } else {
      console.log("EmailJS credentials not set. Saving subscriber locally:", email);
    }

    // Transition state and save locally as fallback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      const subscribers = JSON.parse(localStorage.getItem("coming_soon_subscribers") || "[]");
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem("coming_soon_subscribers", JSON.stringify(subscribers));
      }
      setEmail("");
    }, 800);
  };


  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between overflow-hidden relative font-sans selection:bg-red-500/20 selection:text-red-700">
      
      {/* Light Ambient Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, -10, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-red-100 rounded-full blur-[100px] opacity-40"
        />
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-red-50 rounded-full blur-[120px] opacity-50"
        />
      </div>

      {/* Floating Interactive Background Books */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating Book 1 */}
        <motion.div
          initial={{ x: "10vw", y: "85vh", rotate: 0 }}
          animate={{
            y: ["85vh", "15vh"],
            rotate: [0, 360],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-red-500/10"
        >
          <BookOpen size={48} />
        </motion.div>

        {/* Floating Book 2 */}
        <motion.div
          initial={{ x: "85vw", y: "70vh", rotate: 45 }}
          animate={{
            y: ["70vh", "-10vh"],
            rotate: [45, -315],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-red-500/8"
        >
          <Book size={64} />
        </motion.div>

        {/* Floating Sparkles 1 */}
        <motion.div
          initial={{ x: "30vw", y: "90vh" }}
          animate={{
            y: ["90vh", "30vh"],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute text-red-400/20"
        >
          <Sparkles size={24} />
        </motion.div>

        {/* Floating Book 3 */}
        <motion.div
          initial={{ x: "75vw", y: "95vh", rotate: -15 }}
          animate={{
            y: ["95vh", "5vh"],
            rotate: [-15, 345],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-red-500/10"
        >
          <BookOpen size={56} />
        </motion.div>
      </div>

      {/* Header / Logo */}
      <header className="w-full max-w-7xl mx-auto px-6 pt-8 pb-4 flex justify-between items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5"
        >
          
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Books<span className="text-red-600">KaBazaar</span>
          </span>
        </motion.div>
        
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-semibold px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full shadow-sm"
        >
          Coming Soon
        </motion.span>
      </header>

      {/* Main Hero & Content */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center relative z-10 flex-grow">
        
        {/* Glow Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          The Ultimate Multi-Seller Book Marketplace
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900"
        >
          Buy & Sell Books <br />
          <span className="text-red-650 filter drop-shadow-sm">
            Through Registered Sellers
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-600 max-w-2xl text-base sm:text-lg md:text-xl mb-10 leading-relaxed font-normal"
        >
          Find your next read from trusted book vendors and individual sellers, or register as a seller to list your own books and reach book lovers everywhere.
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg w-full mb-12"
        >
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Mins", value: timeLeft.minutes },
            { label: "Secs", value: timeLeft.seconds },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl p-3 sm:p-5 flex flex-col justify-center items-center shadow-md"
            >
              <span className="text-2xl sm:text-4xl font-extrabold text-red-650 tracking-tight tabular-nums">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>


        {/* Newsletter Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="signup-form"
                onSubmit={handleSubscribe}
                className="space-y-2.5"
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-455">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-red-550/10 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Get Invite <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-xs text-red-650 text-left pl-1 font-semibold">{errorMsg}</p>
                )}
                <p className="text-[14px] text-slate-500 text-center mt-2.5">
                  Join buyers and sellers already waitlisted. No spam. Unsubscribe anytime.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-emerald-500/35 rounded-2xl p-6 text-center shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1.5">You're on the invite list!</h4>
                <p className="text-xs text-slate-650 max-w-sm mx-auto leading-relaxed">
                  Thank you! We've saved your spot. You'll be the first to know when sellers list and upload their book catalogs.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                >
                  Register another email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-24 pt-12 border-t border-slate-200"
        >
          {[
            {
              icon: <Users className="text-red-650" size={20} />,
              title: "Register as a Seller",
              desc: "Register as a verified seller to list your new, used, or rare books in minutes. Set your own pricing and reach buyers directly.",
            },
            {
              icon: <TrendingUp className="text-red-650" size={20} />,
              title: "Buy for Less",
              desc: "Compare listings from multiple registered sellers on one platform to find the best deals on any title.",
            },
            {
              icon: <MessageSquare className="text-red-650" size={20} />,
              title: "Seamless Trading",
              desc: "Interact with sellers, ask questions, negotiate pricing, and coordinate secure delivery options.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-5 text-left hover:border-red-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                {feature.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1">
                {feature.title}
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-red-500" />
              </h4>
              <p className="text-xs text-slate-650 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} BooksKaBazaar. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {[
            { icon: instagramIcon, link: "https://instagram.com" },
            { icon: twitterIcon, link: "https://twitter.com" },
            { icon: linkedinIcon, link: "https://linkedin.com" },
            { icon: githubIcon, link: "https://github.com" },
          ].map((social, i) => (
            <a
              key={i}
              href={social.link}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-red-200 text-slate-450 hover:text-red-650 flex items-center justify-center transition-all hover:scale-105 shadow-sm"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
