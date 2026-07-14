import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Mail, Phone, MapPin, Send, ArrowRight,
  ShieldCheck, BookOpen, Store, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

const NAV = [
  { label: "Home",        to: "/" },
  { label: "Bestsellers", to: "/bestsellers" },
  { label: "New Arrivals",to: "/new-arrivals" },
  { label: "Bookshelf",   to: "/bookshelf" },
  { label: "About Us",    to: "/about" },
];

const CATEGORIES = [
  { label: "Academics",         to: "/search?query=Academics" },
  { label: "Fiction",           to: "/search?query=Fiction" },
  { label: "Non-Fiction",       to: "/search?query=Non-Fiction" },
  { label: "Children & Kids",   to: "/search?query=Kids" },
  { label: "Young Adults",      to: "/search?query=Young+Adults" },
  { label: "Comics & Graphic",  to: "/search?query=Comics" },
];

const SUPPORT = [
  { label: "FAQs",               to: "/faq" },
  { label: "Track Order",        to: "/profile?tab=orders" },
  { label: "Returns & Refunds",  to: "/returns" },
  { label: "Shipping Policy",    to: "/shipping" },
  { label: "Privacy Policy",     to: "/privacy" },
  { label: "Terms of Service",   to: "/terms" },
];

const NavLink = ({ to, label }) => (
  <li>
    <Link
      to={to}
      className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors duration-200 group text-sm"
    >
      <ChevronRight
        size={12}
        className="text-[#E31E2E] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
      />
      {label}
    </Link>
  </li>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you for subscribing!");
      setEmail("");
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <footer className="bg-[#0d1117] text-slate-400 font-sans mt-auto">

      {/* ── NEWSLETTER BAND ── */}
      <div className="border-b border-white/5" style={{ background: "linear-gradient(135deg, #E31E2E 0%, #b01220 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-white font-black text-xl tracking-tight mb-1">
              Stay in the loop
            </h3>
            <p className="text-red-100 text-sm font-medium">
              New arrivals, exclusive deals &amp; curated reading picks — straight to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full max-w-md flex gap-2 shrink-0">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white rounded-xl text-sm text-white placeholder:text-white focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3 bg-white text-[#E31E2E] font-extrabold text-sm rounded-xl flex items-center gap-2 hover:bg-red-100 disabled:opacity-60 transition-all duration-200 cursor-pointer whitespace-nowrap shadow-lg"
            >
              {isSubmitting ? "Joining…" : "Subscribe"}
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* ── MAIN LINKS GRID ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="space-y-6">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#E31E2E] flex items-center justify-center shadow-lg shadow-[#E31E2E]/30 group-hover:scale-105 transition-transform duration-300">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="text-white font-black text-xl tracking-tight">
                BooksKa<span className="text-[#E31E2E]">Bazaar</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              India&apos;s trusted multi-seller marketplace for books &amp; educational resources.
              Buy, sell, and discover knowledge — from new releases to rare editions.
            </p>

            {/* Contact details */}
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin size={15} className="text-[#E31E2E] shrink-0 mt-0.5" />
                <span className="leading-relaxed">Kurthaul, Patna, Bihar — 804453, India</span>
              </li>
              <li>
                <a href="tel:+918228904120" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                  <Phone size={15} className="text-[#E31E2E] shrink-0" />
                  +91 82289 04120
                </a>
              </li>
              <li>
                <a href="mailto:support@bookskabazaar.com" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                  <Mail size={15} className="text-[#E31E2E] shrink-0" />
                  support@bookskabazaar.com
                </a>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                {
                  label: "Facebook",
                  href: "https://facebook.com",
                  svg: <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />,
                },
                {
                  label: "Instagram",
                  href: "https://instagram.com",
                  custom: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  label: "Twitter",
                  href: "https://twitter.com",
                  svg: <path d="M23.95 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />,
                },
              ].map(({ label, href, svg, custom }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800/70 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#E31E2E] hover:border-[#E31E2E] transition-all duration-300"
                >
                  {custom ?? (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">{svg}</svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Explore</h4>
            <ul className="space-y-3">
              {NAV.map((item) => <NavLink key={item.to} {...item} />)}
              <li>
                <Link to="/seller" className="flex items-center gap-1.5 text-[#E31E2E] hover:text-red-400 transition-colors group text-sm font-semibold">
                  <Store size={13} className="shrink-0" />
                  Sell With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Categories</h4>
            <ul className="space-y-3">
              {CATEGORIES.map((item) => <NavLink key={item.to} {...item} />)}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Help &amp; Legal</h4>
            <ul className="space-y-3">
              {SUPPORT.map((item) => <NavLink key={item.to} {...item} />)}
            </ul>
          </div>
        </div>
      </div>

      {/* ── TRUST BADGES ROW ── */}
      <div className="border-t border-white/5 max-w-7xl mx-auto px-6 lg:px-10 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <ShieldCheck size={14} className="text-[#E31E2E]" />
            Secure Payments
          </div>
          <span className="text-slate-700">·</span>
          {["Razorpay", "Visa", "Mastercard", "RuPay", "UPI"].map((p) => (
            <span
              key={p}
              className="text-xs font-bold text-slate-500 bg-slate-800/60 border border-slate-700/50 px-3 py-1 rounded-md tracking-wide select-none"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* ── LEGAL DISCLAIMER ── */}
      <div className="border-t border-white/5" style={{ background: "linear-gradient(180deg, #0a0f18 0%, #0d1117 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">

          {/* Tagline — stacks gracefully on mobile */}
          <div className="mb-8 text-center">
            
            <p className="text-slate-300 text-sm font-semibold leading-relaxed">
              Books Ka Bazaar &mdash;{" "}
              <span className="text-[#E31E2E] font-black">India&apos;s Trusted Multi-Seller Marketplace</span>{" "}
              for Books &amp; Learning Resources
            </p>
          </div>

          {/* Disclaimer paragraphs — single column mobile, 3 col desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-800/40 rounded-2xl overflow-hidden mb-8">
            {[
              {
                num: "01",
                title: "Marketplace Notice",
                body: (
                  <>
                    <strong className="text-slate-300">Books Ka Bazaar</strong> is a technology-driven multi-seller marketplace connecting buyers and registered sellers of books &amp; educational resources across India. Unless specifically identified as{" "}
                    <strong className="text-slate-300">&lsquo;Sold by Books Ka Bazaar&rsquo;</strong>, Books Ka Bazaar is not the Seller of products listed by independent sellers on this Platform.
                  </>
                ),
              },
              {
                num: "02",
                title: "Seller Responsibility",
                body: "Product descriptions, pricing, availability, condition, and warranties are solely provided by and the responsibility of respective Sellers. Books Ka Bazaar makes no warranties, express or implied, regarding the accuracy of Seller listings.",
              },
              {
                num: "03",
                title: "Platform Policies",
                body: (
                  <>
                    All transactions are subject to our{" "}
                    <Link to="/returns" className="text-slate-300 hover:text-[#E31E2E] underline underline-offset-2 transition-colors font-medium">
                      Returns &amp; Refunds Policy
                    </Link>
                    ,{" "}
                    <Link to="/shipping" className="text-slate-300 hover:text-[#E31E2E] underline underline-offset-2 transition-colors font-medium">
                      Delivery &amp; Shipping Policy
                    </Link>
                    , and other applicable Platform policies.
                  </>
                ),
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="bg-slate-900/60 p-6 lg:p-7 space-y-3">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[#E31E2E] text-xs font-black tracking-widest opacity-60">{num}</span>
                  <span className="text-white text-xs font-bold uppercase tracking-wider">{title}</span>
                </div>
                <p className="text-slate-400 text-sm leading-[1.8]">{body}</p>
              </div>
            ))}
          </div>

          {/* Compliance + Grievance — stacks on mobile */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Badges — wrap on small screens */}
            <div className="flex flex-wrap gap-2">
              {[
                "IT Act, 2000",
                "Consumer Protection (E-Commerce) Rules, 2020",
                "Intermediary Platform",
              ].map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-semibold text-slate-400 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-full select-none whitespace-nowrap"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Grievance email */}
            <div className="text-sm text-slate-400 shrink-0">
              <span className="text-slate-500">Disputes &amp; Grievances: </span>
              <a
                href="mailto:grievance@bookskabazaar.com"
                className="text-slate-300 hover:text-[#E31E2E] transition-colors font-medium underline underline-offset-2"
              >
                grievance@bookskabazaar.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── COPYRIGHT BAR ── */}
      <div className="border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-slate-500 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} Books Ka Bazaar &mdash; AS Enterprises Pvt. Ltd. All rights reserved.
          </span>
          <div className="flex items-center gap-5 text-xs text-slate-600">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-slate-400 transition-colors">About Us</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
