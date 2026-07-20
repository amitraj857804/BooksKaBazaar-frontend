import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Mail, Phone, MapPin, ArrowRight,
  ShieldCheck, BookOpen, Store, ChevronRight, MessageCircle
} from "lucide-react";

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
  { label: "Terms of Use",       to: "/terms-of-use" },
  { label: "Terms & Conditions", to: "/terms-conditions" },
  { label: "Seller Terms & Conditions",  to: "/seller-terms" },
  { label: "Disclaimer",         to: "/disclaimer" },
];

const POLICIES = [
 
  { label: "Privacy Policy",             to: "/privacy" },
  { label: "Returns & Refunds",          to: "/returns" },
  { label: "Delivery & Shipping",        to: "/shipping" },
  
  { label: "Digital Products Policy",    to: "/digital-products-policy" },
  { label: "IP & Copyright Policy",      to: "/ip-policy" },
  { label: "Prohibited Items Policy",    to: "/prohibited-items" },
  { label: "Cancellation Policy",        to: "/cancellation" },
  { label: "Payment & Wallet Policy",    to: "/payment-policy" },
  { label: "Grievance Redressal",        to: "/grievance" },
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


/* ── Accordion section: collapsed on < lg, always open on lg ── */
const FooterSection = ({ title, children, spanFull = false }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${spanFull ? "col-span-1 md:col-span-1 lg:col-span-1 " : ""}`}>
      {/* Header — clickable only on < lg */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3.5 lg:py-0 lg:cursor-default group"
        aria-expanded={open}
      >
        <h4 className="text-white font-bold text-sm uppercase tracking-widest text-left">
          {title}
        </h4>
        {/* Chevron — only visible < lg */}
        <ChevronRight
          size={14}
          className={`text-slate-500 transition-transform duration-300 lg:hidden ${
            open ? "rotate-90" : "rotate-0"
          }`}
        />
      </button>

      {/* Links — always visible on lg, toggled on < lg */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:!max-h-none lg:!opacity-100 lg:mt-4 ${
          open ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0 lg:mt-4"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const Footer = () => {

  return (
    <footer className="bg-[#0d1117] text-slate-400 font-sans mt-auto">


      {/* ── MAIN LINKS GRID ── */}
      <div className="px-6 sm:px-10 lg:px-28 mx-auto pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-6 gap-y-0 md:gap-y-10 md:gap-x-10 lg:gap-8 divide-y divide-white/5 md:divide-y-0">

          {/* Brand column — last on sm/md, first on lg */}
          <div className="space-y-6 order-last py-6 md:col-span-3 md:order-last lg:col-span-1 lg:order-first lg:py-0">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#E31E2E] flex items-center justify-center shadow-lg shadow-[#E31E2E]/30 group-hover:scale-105 transition-transform duration-300">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="text-[#E31E2E] font-black text-xl tracking-tight">
                Books Ka Bazaar
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

            {/* Connect CTA */}
            <div className="space-y-2">
              <p className="text-slate-500 text-xs leading-relaxed">
                Have a question or want to get in touch? We'd love to hear from you.
              </p>
              <Link
                to="/connect"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold text-sm rounded-full transition-all hover:opacity-90"
                style={{ background: "#E31E2E" }}
              >
                <MessageCircle size={14} />
                Connect with Us
              </Link>
            </div>


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
          <FooterSection title="Explore">
            <ul className="space-y-3">
              {NAV.map((item) => <NavLink key={item.to} {...item} />)}
              <li>
                <Link to="/seller" className="flex items-center gap-1.5 text-[#E31E2E] hover:text-red-400 transition-colors group text-sm font-semibold">
                  <Store size={13} className="shrink-0" />
                  Sell With Us
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* Categories */}
          <FooterSection title="Categories">
            <ul className="space-y-3">
              {CATEGORIES.map((item) => <NavLink key={item.to} {...item} />)}
            </ul>
          </FooterSection>

          {/* Help & Support */}
          <FooterSection title="Help &amp; Support">
            <ul className="space-y-3">
              {SUPPORT.map((item) => <NavLink key={item.to} {...item} />)}
            </ul>
          </FooterSection>

          {/* Policies */}
          <FooterSection title="Policies" spanFull>
            <ul className="space-y-3 columns-2 md:columns-1">
              {POLICIES.map((item) => <NavLink key={item.to} {...item} />)}
            </ul>
          </FooterSection>
        </div>
      </div>

      {/* ── TRUST BADGES ROW ── */}
      <div className="border-t border-white/5 px-6 sm:px-10 lg:px-28 mx-auto py-6">
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

      

      {/* ── COPYRIGHT BAR ── */}
      <div className="border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-slate-500 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} Books Ka Bazaar &mdash; All rights reserved.
          </span>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link to="/disclaimer" className="hover:text-slate-400 transition-colors">Disclaimer</Link>
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of use</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
