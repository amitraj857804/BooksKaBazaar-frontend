import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  Mail, Phone, MapPin, Send, ArrowRight, Heart, ShieldCheck 
} from "lucide-react";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-900 mt-auto">
      {/* Top Banner section */}
      <div className="border-b border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E31E2E]/10 border border-[#E31E2E]/25 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-[#E31E2E]" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm tracking-wide">100% SECURE PAYMENTS</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Your transactions are protected by industry-standard encryption.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E31E2E]/10 border border-[#E31E2E]/25 flex items-center justify-center shrink-0">
              <Heart size={20} className="text-[#E31E2E]" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm tracking-wide">MADE FOR BOOK LOVERS</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Explore bestsellers, academics, fiction and more in premium print.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-[#E31E2E] flex items-center justify-center shadow-lg shadow-[#E31E2E]/20 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-black text-xl italic font-serif">B</span>
              </div>
              <span className="text-white font-black text-lg uppercase tracking-wider font-sans group-hover:text-white/90 transition">
                BooksKa<span className="text-[#E31E2E]">Bazaar</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              Discover endless stories, shop curated collections, and read without limits. We deliver premium quality editions right to your doorstep.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#E31E2E] hover:border-[#E31E2E] transition-all duration-300 shadow-sm"
              >
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#E31E2E] hover:border-[#E31E2E] transition-all duration-300 shadow-sm"
              >
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M23.95 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#E31E2E] hover:border-[#E31E2E] transition-all duration-300 shadow-sm"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#E31E2E] hover:border-[#E31E2E] transition-all duration-300 shadow-sm"
              >
                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest">Quick Navigation</h4>
            <ul className="space-y-3.5 text-sm font-semibold">
              <li>
                <Link to="/" className="hover:text-[#E31E2E] transition-colors flex items-center gap-1 group">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E31E2E]" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/bookshelf" className="hover:text-[#E31E2E] transition-colors flex items-center gap-1 group">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E31E2E]" />
                  <span>My Bookshelf</span>
                </Link>
              </li>
              <li>
                <Link to="/bestsellers" className="hover:text-[#E31E2E] transition-colors flex items-center gap-1 group">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E31E2E]" />
                  <span>Bestsellers</span>
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-[#E31E2E] transition-colors flex items-center gap-1 group">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E31E2E]" />
                  <span>New Arrivals</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-5">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest">Categories</h4>
            <ul className="space-y-3.5 text-sm font-semibold">
              <li>
                <Link to="/search?query=Academics" className="hover:text-[#E31E2E] transition-colors flex items-center gap-1 group">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E31E2E]" />
                  <span>Academics</span>
                </Link>
              </li>
              <li>
                <Link to="/search?query=Fiction" className="hover:text-[#E31E2E] transition-colors flex items-center gap-1 group">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E31E2E]" />
                  <span>Fiction</span>
                </Link>
              </li>
              <li>
                <Link to="/search?query=Non-Fiction" className="hover:text-[#E31E2E] transition-colors flex items-center gap-1 group">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E31E2E]" />
                  <span>Non-Fiction</span>
                </Link>
              </li>
              <li>
                <Link to="/search?query=Kids" className="hover:text-[#E31E2E] transition-colors flex items-center gap-1 group">
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E31E2E]" />
                  <span>Kids & Comics</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-5">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-widest">Support & Contact</h4>
            <ul className="space-y-4 text-xs font-semibold">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#E31E2E] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Kurthaul, Patna,<br />Bihar - 804453, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#E31E2E] shrink-0" />
                <a href="tel:+918228904120" className="hover:text-[#E31E2E] transition">+91 82289 04120</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#E31E2E] shrink-0" />
                <a href="mailto:support@bookskabazaar.com" className="hover:text-[#E31E2E] transition">support@bookskabazaar.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter subscription section */}
        <div className="mt-14 pt-10 border-t border-slate-900 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center lg:text-left">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Stay updated on curated sales</h4>
            <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wide">Get exclusive discounts, new arrival alerts & curated reader logs.</p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full max-w-md flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#E31E2E] hover:bg-red-700 disabled:bg-slate-850 text-white font-extrabold text-sm rounded-xl flex items-center gap-2 transition duration-200 cursor-pointer shadow-lg shadow-[#E31E2E]/10"
            >
              <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Copyright & Pay Trust logos */}
      <div className="bg-slate-950/80 border-t border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} BooksKaBazaar. All rights reserved.
          </div>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition">Terms of Service</Link>
          </div>
          
          {/* SVG Payment badges */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Razorpay badge */}
            <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-900 px-2 py-1 border border-slate-800 rounded tracking-wider select-none">
              Razorpay
            </span>
            {/* Visa */}
            <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-900 px-2 py-1 border border-slate-800 rounded tracking-wider select-none">
              Visa
            </span>
            {/* Mastercard */}
            <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-900 px-2 py-1 border border-slate-800 rounded tracking-wider select-none">
              Mastercard
            </span>
            {/* RuPay */}
            <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-900 px-2 py-1 border border-slate-800 rounded tracking-wider select-none">
              RuPay
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
