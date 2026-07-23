import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Mail, Phone, MapPin, ArrowRight, Send,
  ShieldCheck, BookOpen, Store, ChevronRight, MessageCircle
} from "lucide-react";

const NAV = [
  { label: "Harbound Books", to: "/#" },
  { label: "eBooks & PDFs", to: "/#" },
  { label: "Bestsellers", to: "/bestsellers" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Competitive Books", to: "/#" },
  { label: "Rare & Vintage", to: "/#" },
  { label: "Old/Used Books", to: "/#" },
];

const SERVICES = [
  { label: "Reading Room", to: "/reading-room" },
  { label: "Blogs", to: "/blog" },

];

const SUPPORT = [
  { label: "FAQs", to: "/faq" },
  { label: "Track Order", to: "/profile?tab=orders" },
  { label: "Terms & Conditions", to: "/terms-conditions" },
  { label: "Returns & Refunds", to: "/returns" },
  { label: "Delivery & Shipping", to: "/shipping" },
  { label: "Grievance & Complaint", to: "/grievance" },
];

const OTHER_POLICIES = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Digital Products Policy", to: "/digital-products-policy" },
  { label: "IP & Copyright Policy", to: "/ip-policy" },
  { label: "Prohibited Items Policy", to: "/prohibited-items" },
  { label: "Cancellation Policy", to: "/cancellation" },
  { label: "Payment & Wallet Policy", to: "/payment-policy" },
  { label: "Terms of Use", to: "/terms" },
  { label: "Seller Terms & Conditions", to: "/seller-terms" },
];

const COMPANY = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/connect" },
];

const NavLink = ({ to, label }) => (
  <li>
    <Link
      to={to}
      className="flex items-center  text-slate-400 hover:text-white transition-colors duration-200 group text-sm"
    >
      <ChevronRight
        size={18}
        className="text-[#E31E2E]  -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
      />
      {label}
    </Link>
  </li>
);

const OtherPoliciesDropdown = () => {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center  text-slate-400 hover:text-white transition-colors duration-200 group text-sm w-full text-left cursor-pointer"
      >
        <ChevronRight
          size={18}
          className={`text-[#E31E2E]  -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"
            }`}
        />
        Other Policies
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
          }`}
      >
        <ul className="space-y-1 pl-4 border-l border-slate-700/60 ml-1.5">
          {OTHER_POLICIES.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
        </ul>
      </div>
    </li>
  );
};


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
        <h4 className="text-white font-bold text-sm uppercase tracking-widest text-left lg:pl-4  ">
          {title}
          <div className="bg-[#E31E2E] w-8 h-0.5 mt-1 text-center font-bold"></div>
        </h4>
        {/* Chevron — only visible < lg */}
        <ChevronRight
          size={14}
          className={`text-slate-500 transition-transform duration-300 lg:hidden ${open ? "rotate-90" : "rotate-0"
            }`}
        />
      </button>

      {/* Links — always visible on lg, toggled on < lg */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:!max-h-none lg:!opacity-100 lg:mt-4 ${open ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0 lg:mt-4"
          }`}
      >
        {children}
      </div>
    </div>
  );
};


/* ── Newsletter Subscribe widget ── */
const NewsletterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    // Simulate API call — wire up your actual endpoint here
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
    setEmail("");
    // Reset back to default form after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="space-y-3 max-w-sm  sm:mr-4 -mt-2">

      {status === "success" ? (
        <div className="flex items-center gap-2 text-red-900 text-sm font-semibold bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          subscribed!
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="Enter your email"
              className={`w-full bg-slate-800/70 border ${status === "error" ? "border-red-500/60" : "border-slate-700/60"
                } text-slate-200 placeholder-slate-500 text-sm rounded-md px-4 py-2.5 pr-10 outline-none focus:border-[#E31E2E]/60 focus:ring-1 focus:ring-[#E31E2E]/30 transition-all duration-200`}
            />
            <Mail size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
          {status === "error" && (
            <p className="text-red-400 text-xs pl-1">Please enter a valid email address.</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-2 w-full px-5 py-2.5 text-white font-semibold text-sm rounded-md cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
            style={{ background: "#E31E2E" }}
          >
            {status === "loading" ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <Send size={14} />
            )}
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
};

const Footer = () => {
  const { user, openAuthModal } = useAuth();

  return (
    <footer className="bg-[#0d1117] text-slate-400 font-sans mt-auto">


      {/* ── MAIN LINKS GRID ── */}
      <div className="px-6 sm:px-10 lg:px-28 mx-auto pt-8 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-6 gap-y-0 md:gap-y-10 md:gap-x-10 lg:gap-8 divide-y divide-white/5 md:divide-y-0">

          {/* Brand column — last on sm/md, first on lg */}
          <div className="space-y-3 order-last py-6 md:col-span-4 md:order-last lg:col-span-1 lg:order-first lg:py-0">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#E31E2E] flex items-center justify-center shadow-lg shadow-[#E31E2E]/30 group-hover:scale-105 transition-transform duration-300">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="text-[#E31E2E] font-black text-xl tracking-tight">
                Books Ka Bazaar
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              India&apos;s Trusted Destination for Hardbound Books, Old/Used Books, eBooks, PDFs, Online Reading Rooms & Insightful Blogs.

            </p>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Subscribe to our newsletter for updates on new arrivals, exclusive offers, and more.
            </p>



            {/* Newsletter Subscribe */}
            <NewsletterSubscribe />


            {/* Social icons */}
            <div className="flex items-center gap-2.5 -mb-0.5">
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm  ">FOLLOW US</p>
              <div className="flex items-center gap-6.5">
              {[
                {
                  label: "Facebook",
                  href: "https://facebook.com",
                  hoverBg: "hover:bg-[#1877F2] hover:border-[#1877F2]",
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  href: "https://instagram.com",
                  hoverBg: "hover:bg-[#E1306C] hover:border-[#E1306C]",
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "https://linkedin.com",
                  hoverBg: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.605 0 4.267 2.376 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  label: "X (Twitter)",
                  href: "https://twitter.com",
                  hoverBg: "hover:bg-[#000000] hover:border-[#555]",
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: "YouTube",
                  href: "https://youtube.com",
                  hoverBg: "hover:bg-[#FF0000] hover:border-[#FF0000]",
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                },
              ].map(({ label, href, icon, hoverBg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-lg bg-slate-800/70 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white ${hoverBg} transition-all duration-300`}
                >
                  {icon}
                </a>
              ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <FooterSection title="Shop">
            <ul className="space-y-2">
              {NAV.map((item) => <NavLink key={item.to} {...item} />)}

            </ul>
          </FooterSection>

          {/* Categories */}
          <FooterSection title="Services" >
            <ul className="space-y-2">
              {SERVICES.map((item) => <NavLink key={item.to} {...item} />)}
            </ul>
          </FooterSection>

          {/* Help & Support */}
          <FooterSection title="Help &amp; Support">
            <ul className="space-y-2">
              {SUPPORT.map((item) => <NavLink key={item.to} {...item} />)}
              <OtherPoliciesDropdown />
            </ul>
          </FooterSection>

          {/* Company*/}
          <FooterSection title="Company" spanFull>
            <ul className="space-y-2 ">
              {COMPANY.map((item) => <NavLink key={item.to} {...item} />)}
              {!user && (
                <li>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="flex ] hover:text-red-400 transition-colors group text-sm font-semibold cursor-pointer"
                  >
                    <ChevronRight size={18} className="text-[#E31E2E]  -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    Register / Login
                  </button>
                </li>
              )}
              <li>
                <Link to="/seller" className="flex items-center gap-1.5 text-[#E31E2E] hover:text-red-400 transition-colors group text-sm font-semibold">
                  <Store size={13} className="shrink-0" />
                  Sell With Us
                </Link>
              </li>
            </ul>
          </FooterSection>
        </div>
      </div>

      {/* ── TRUST BAR ── */}
      <div className="bg-[#00010e51] border-y border-white/8 overflow-hidden">
        <div className="pl-2 pr-4 sm:px-6  mx-auto py-1">
          <div className="flex items-center justify-between flex-nowrap">
            {[
              {
                label: "Multi-Seller\nMarketplace",
                icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25h-1.5A2.25 2.25 0 007.5 13.5V21m0 0H3.75A1.125 1.125 0 012.625 19.875V9.525a1.125 1.125 0 01.393-.855l7.5-6.335a1.125 1.125 0 011.464 0l7.5 6.335c.246.207.393.515.393.855v10.35A1.125 1.125 0 0120.25 21H13.5z" />
                  </svg>
                ),
              },
              {
                label: "100%\nGenuine Books",
                icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
              {
                label: "Secure\nPayments",
                icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ),
              },
              {
                label: "Fast & Safe\nDelivery",
                icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
              },
              {
                label: "Easy\nReturns",
                icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                ),
              },
            ].map(({ label, icon }, i, arr) => (
              <div
                key={label}
                className={`flex items-center justify-center shrink-0 flex-1 py-2 ${i < arr.length - 1 ? "border-r border-white/15" : ""}`}
              >
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                  <span className="text-white p-1 sm:p-1.5 lg:p-2 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                    {icon}
                  </span>
                  <span className="text-white text-[6px] sm:text-xs lg:text-sm font-semibold leading-tight whitespace-pre-line">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* ── COPYRIGHT BAR ── */}
      <div className="border-t border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto px-8 lg:px-0 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-slate-500 text-xs text-center sm:text-left order-last md:order-first">
            &copy; {new Date().getFullYear()} Books Ka Bazaar &mdash; All rights reserved.
          </span>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of use</Link>
            <Link to="/disclaimer" className="hover:text-slate-400 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
