import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, Send, Store, ChevronRight } from "lucide-react";

/* ─── Link data ─────────────────────────────────────────── */
const SUPPORT = [
  { label: "FAQs", to: "/faq" },
  { label: "Track Order", to: "/profile?tab=orders" },
  { label: "Terms & Conditions", to: "/terms-conditions" },
  { label: "Returns & Refunds", to: "/returns" },
];

const OTHER_POLICIES = [
  { label: "Digital Products Policy", to: "/digital-products-policy" },
  { label: "IP & Copyright Policy", to: "/ip-policy" },
  { label: "Prohibited Items Policy", to: "/prohibited-items" },
  { label: "Cancellation Policy", to: "/cancellation" },
  { label: "Payment & Wallet Policy", to: "/payment-policy" },
  { label: "Seller Terms & Conditions", to: "/seller-terms" },
  { label: "Delivery & Shipping", to: "/shipping" },
  { label: "Grievance & Complaint", to: "/grievance" },
];

const COMPANY = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/connect" },
];

/* ─── NavLink ────────────────────────────────────────────── */
const NavLink = ({ to, label }) => (
  <li>
    <Link
      to={to}
      className="flex items-center gap-0.5 text-slate-400 hover:text-white transition-colors duration-200 group text-sm"
    >
      <ChevronRight size={15} className="text-[#E31E2E] -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
      {label}
    </Link>
  </li>
);

/* ─── Other Policies dropdown ────────────────────────────── */
const OtherPoliciesDropdown = () => {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-0.5 text-slate-400 hover:text-white transition-colors duration-200 group text-sm w-full text-left cursor-pointer"
      >
        <ChevronRight
          size={15}
          className={`text-[#E31E2E] -translate-x-1 group-hover:translate-x-0 transition-all duration-200 ${open ? "rotate-90" : "rotate-0"}`}
        />
        Other Policies
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}>
        <ul className="space-y-1 pl-4 border-l border-slate-700/60 ml-1.5 mt-1">
          {OTHER_POLICIES.map((item) => <NavLink key={item.to} {...item} />)}
        </ul>
      </div>
    </li>
  );
};

/* ─── Section heading ────────────────────────────────────── */
const SectionHeading = ({ children }) => (
  <div className="mb-5">
    <h4 className="text-white font-bold text-xs uppercase tracking-[0.15em]">{children}</h4>
    <div className="bg-[#E31E2E] w-8 h-0.5 mt-1.5" />
  </div>
);

/* ─── Newsletter widget ──────────────────────────────────── */
const NewsletterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-green-700 text-sm font-semibold bg-green-50 border border-green-200 rounded-lg px-4 py-3 max-w-lg">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        You&apos;re subscribed!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="w-full max-w-">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder="Enter your email address"
            className={`w-full bg-white border ${status === "error" ? "border-red-400" : "border-slate-200"} text-slate-700 placeholder-slate-400 text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#E31E2E]/60 focus:ring-2 focus:ring-[#E31E2E]/20 transition-all duration-200 shadow-sm`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="relative overflow-hidden flex items-center justify-center gap-2 sm:px-8 px-6 py-2.5 text-white font-semibold text-sm rounded-lg cursor-pointer bg-gradient-to-r from-[#dc2626] via-[#c2410c] to-[#991b1b] shadow-[0_8px_16px_-4px_rgba(185,28,28,0.5)] transition-all duration-300 hover:shadow-[0_12px_20px_-4px_rgba(185,28,28,0.65)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none whitespace-nowrap group"
        >
          {/* Sweeping Bended Silver Line */}
          <span className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-in-out pointer-events-none" />

          {/* Button Content */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {status === "loading" ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <>
                Subscribe
                <Send size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </>
            )}
          </span>
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-500 text-xs mt-1.5 pl-1">Please enter a valid email address.</p>
      )}
    </form>
  );
};

/* ─── Social icons data ──────────────────────────────────── */
const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    hoverBg: "hover:bg-[#1877F2] hover:border-[#1877F2]",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    hoverBg: "hover:bg-[#E1306C] hover:border-[#E1306C]",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    hoverBg: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.605 0 4.267 2.376 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com",
    hoverBg: "hover:bg-[#222] hover:border-[#555]",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    hoverBg: "hover:bg-[#FF0000] hover:border-[#FF0000]",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

/* ─── Interactive Bookshelf ──────────────────────────────── */


// Exact color palette & realistic dimensions sampled from the design
const SHELF_BOOKS = [
  { color: "#1e293b", w: 18, stripe: "#38bdf8" }, // Navy
  { color: "#9f1239", w: 22, stripe: "#fef08a" }, // Crimson
  { color: "#f8fafc", w: 20, stripe: "#94a3b8" }, // Cream/White
  { color: "#881337", w: 16, stripe: "#fef08a" }, // Wine
  { color: "#ca8a04", w: 24, stripe: "#fef08a" }, // Gold
  { color: "#e2e8f0", w: 16, stripe: "#64748b" }, // Ivory
  { color: "#1e3a8a", w: 22, stripe: "#93c5fd" }, // Deep Blue
  { color: "#b91c1c", w: 18, stripe: "#fef08a" }, // Red
  { color: "#0f172a", w: 26, stripe: "#cbd5e1" }, // Dark Slate
  { color: "#991b1b", w: 20, stripe: "#fef08a" }, // Ruby
  { color: "#1e293b", w: 22, stripe: "#38bdf8" }, // Dark Navy
  { color: "#b91c1c", w: 16, stripe: "#fef08a" }, // Bright Red
  { color: "#1e3a8a", w: 18, stripe: "#93c5fd" }, // Royal Blue
  { color: "#9f1239", w: 26, stripe: "#fef08a" }, // Deep Burgundy
  { color: "#881337", w: 22, stripe: "#fef08a" }, // Dark Red
  { color: "#0f172a", w: 20, stripe: "#94a3b8" }, // Charcoal
  { color: "#b91c1c", w: 18, stripe: "#fef08a" }, // Red
  { color: "#1e3a8a", w: 22, stripe: "#93c5fd" }, // Navy
  { color: "#ca8a04", w: 24, stripe: "#fef08a" }, // Ochre
  { color: "#881337", w: 16, stripe: "#fef08a" }, // Wine
  { color: "#f8fafc", w: 24, stripe: "#64748b" }, // Cream
  { color: "#9f1239", w: 18, stripe: "#fef08a", rotate: -6 }, // Tilted Red
  { color: "#881337", w: 22, stripe: "#fef08a" }, // Dark Red
  { color: "#f8fafc", w: 18, stripe: "#64748b" }, // White
  { color: "#1e3a8a", w: 16, stripe: "#93c5fd", rotate: 5 }, // Tilted Blue
  { color: "#b91c1c", w: 22, stripe: "#fef08a" }, // Crimson
  { color: "#991b1b", w: 20, stripe: "#fef08a" }, // Ruby
  { color: "#1e293b", w: 24, stripe: "#38bdf8" }, // Dark Slate
  { color: "#f8fafc", w: 22, stripe: "#64748b" }, // Cream
  { color: "#9f1239", w: 18, stripe: "#fef08a" }, // Red
  { color: "#b91c1c", w: 16, stripe: "#fef08a" }, // Bright Red
  { color: "#ca8a04", w: 22, stripe: "#fef08a" }, // Gold
  { color: "#1e293b", w: 20, stripe: "#38bdf8" }, // Navy
  { color: "#f8fafc", w: 24, stripe: "#64748b" }, // White
  { color: "#881337", w: 18, stripe: "#fef08a" }, // Wine
  { color: "#0f172a", w: 22, stripe: "#94a3b8" }, // Dark Slate
  { color: "#1e3a8a", w: 26, stripe: "#93c5fd" }, // Deep Blue
  { color: "#e2e8f0", w: 18, stripe: "#64748b" }, // Light Grey
  { color: "#0f172a", w: 22, stripe: "#cbd5e1" }, // Dark Charcoal
  { color: "#881337", w: 20, stripe: "#fef08a" }, // Dark Red
  { color: "#991b1b", w: 16, stripe: "#fef08a" }, // Ruby
  { color: "#1e293b", w: 22, stripe: "#38bdf8" }, // Navy
  { color: "#0f172a", w: 18, stripe: "#cbd5e1", rotate: 4 }, // Tilted Slate
  { color: "#b91c1c", w: 18, stripe: "#fef08a" }, // Red
  { color: "#1e3a8a", w: 22, stripe: "#93c5fd" }, // Navy
  { color: "#ca8a04", w: 24, stripe: "#fef08a" }, // Ochre
  { color: "#881337", w: 16, stripe: "#fef08a" }, // Wine
  { color: "#f8fafc", w: 24, stripe: "#64748b" }, // Cream
  { color: "#9f1239", w: 22, stripe: "#fef08a" }, // Crimson
  { color: "#f8fafc", w: 20, stripe: "#94a3b8" }, // Cream/White
  { color: "#881337", w: 16, stripe: "#fef08a" }, // Wine
  { color: "#ca8a04", w: 24, stripe: "#fef08a" }, // Gold
  { color: "#e2e8f0", w: 16, stripe: "#64748b" }, // Ivory
  { color: "#1e3a8a", w: 22, stripe: "#93c5fd" }, // Deep Blue
  { color: "#0f172a", w: 22, stripe: "#94a3b8" }, // Dark Slate
  { color: "#1e3a8a", w: 26, stripe: "#93c5fd" }, // Deep Blue
  { color: "#e2e8f0", w: 18, stripe: "#64748b" }, // Light Grey
];

const BookshelfBanner = () => {
  const [hovered, setHovered] = useState(null);

  // Dynamic realistic height variations
  const getHeight = (i) => {
    const heights = [35, 50, 32, 56, 40, 30, 55, 40, 44, 31];
    return heights[i % heights.length];
  };

  return (
    <div
      className="w-full relative select-none overflow-hidden"
      style={{
        paddingTop: 0,
        // Linear fade on outer edges to match dark background vignette
        maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
      }}
    >
      {/* Books Container */}
      <div className="flex items-end justify-center px-4 h-[60px]">
        {SHELF_BOOKS.map((book, i) => {
          const bookH = getHeight(i);
          const isHovered = hovered === i;
          const rotateAngle = book.rotate || 0;

          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}

              style={{
                width: book.w,
                height: bookH,
                backgroundColor: book.color,
                flexShrink: 0,
                marginRight: 2.5,
                borderRadius: "3px 3px 0 0",
                position: "relative",
                cursor: "pointer",
                transform: isHovered
                  ? "translateY(-14px) rotate(0deg) scale(1.02)"
                  : `translateY(0) rotate(${rotateAngle}deg)`,
                transformOrigin: "bottom center",
                filter: isHovered
                  ? "brightness(1.25) contrast(1.1)"
                  : "brightness(0.95)",
                boxShadow: isHovered
                  ? "0 14px 28px rgba(0,0,0,0.8), 0 6px 10px rgba(0,0,0,0.6)"
                  : "0 2px 4px rgba(0,0,0,0.4)",
                transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.2s ease, box-shadow 0.25s ease",
                zIndex: isHovered ? 20 : rotateAngle ? 2 : 1,
              }}
            >
              {/* Spine 3D Left Edge Highlight */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 3,
                  height: "100%",
                  background: "linear-gradient(to right, rgba(255,255,255,0.22), transparent)",
                  borderRadius: "3px 0 0 0",
                }}
              />

              {/* Spine 3D Right Edge Shadow */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 3,
                  height: "100%",
                  background: "linear-gradient(to left, rgba(0,0,0,0.4), transparent)",
                }}
              />

              {/* Top Page Edge Border */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 2,
                  right: 2,
                  height: 3,
                  background: "rgba(255,255,255,0.25)",
                  borderRadius: "2px 2px 0 0",
                }}
              />

              {/* Double Metallic Spine Foil Lines (Top & Bottom) */}
              <div
                style={{
                  position: "absolute",
                  top: "16%",
                  left: 3,
                  right: 3,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: book.stripe,
                  opacity: 0.85,
                  boxShadow: "0 0 2px rgba(0,0,0,0.5)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "16%",
                  left: 3,
                  right: 3,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: book.stripe,
                  opacity: 0.85,
                  boxShadow: "0 0 2px rgba(0,0,0,0.5)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 3-Layer Wood Shelf & Ambient Shadow Ledge */}
      <div className="w-full relative z-10">
        {/* Top Metallic/Wood Trim Line */}
        <div style={{ height: 2, background: "#334155" }} />

        {/* Main Wood Plank Body */}
        <div
          style={{
            height: 10,
            background: "linear-gradient(to bottom, #1e293b, #0f172a)",
            borderTop: "0.5px solid #475569",
          }}
        />

        {/* Ambient Under-Shelf Soft Shadow */}
        <div
          style={{
            height: 8,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
          }}
        />
      </div>
    </div>
  );
};



/* ─── Main Footer ────────────────────────────────────────── */
const Footer = () => {
  const { user, openAuthModal } = useAuth();

  return (
    <footer className="font-sans mt-0">

      {/* ══ 1. NEWSLETTER STRIP ══ */}
      <div className="border-b bg-[#f5f0e8b9] border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-2 flex flex-col md:flex-row sm:justify-between items-start md:items-center gap-6 md:gap-24">
          <div className="flex-shrink-0 max-w-lg">
            <div>
              <h3 className="text-black font-bold text-[18px] mb-1">Stay Updated</h3>
              <div className="bg-[#E31E2E] w-8 h-[2.5px] mt-1.5" />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Get Reading Room picks, new blog posts, new arrivals and{" "}
              <span className="font-semibold text-slate-700">exclusive offers</span>, straight to your{" "}
              <span className="text-[#E31E2E] font-semibold underline underline-offset-2">inbox</span>.
            </p>
          </div>
          <div className="flex-1 max-w-lg">
            <NewsletterSubscribe />
          </div>
        </div>
      </div>


      {/* ══ 3. MAIN FOOTER DARK SECTION ══ */}
      <div className="bg-[#0d0f1e] text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-2">
          {/* ══ 2. BOOKSHELF BANNER ══ */}
          <BookshelfBanner />

          {/* Main Footer Section — 3 Equal/Proportional Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start py-4">

            {/* ── Col 1: Brand & Social (Fixed 280px) ── */}
            <div className="flex flex-col gap-5 max-w-[280px]">
              {/* Logo */}
              <Link to="/" className="block w-full">
                <img
                  src="/Footer Logo Inverted without BG.png"
                  alt="Books Ka Bazaar"
                  className="w-full h-auto object-contain object-left block"
                  style={{ maxHeight: 75 }}
                />
              </Link>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed w-full -mt-2">
                India&apos;s Trusted Multi-Seller Marketplace for All Types of Books, eBooks &amp; PDFs—featuring a Reading Room and Insightful Blogs.
              </p>

              {/* Follow Us */}
              <div className="w-full -mb-6 -mt-2">
                <p className="text-white text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-0">Follow Us</p>
                <div className="bg-[#E31E2E] w-8 h-0.5 mb-3" />

                {/* Social icons */}
                <div className="flex items-center gap-6 mb-2 sm:mb-0">
                  {SOCIALS.map(({ label, href, icon, hoverBg }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white ${hoverBg} transition-all duration-300 shrink-0`}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Col 2: Help & Support ── */}
            <div className="flex flex-col">
              <SectionHeading>Help &amp; Support</SectionHeading>
              <ul className="space-y-3.5 md:space-y-5.5">
                {SUPPORT.map((item) => <NavLink key={item.to} {...item} />)}
                <OtherPoliciesDropdown />
              </ul>
            </div>

            {/* ── Col 3: Company ── */}
            <div className="flex flex-col">
              <SectionHeading>Company</SectionHeading>
              <ul className="space-y-3.5 md:space-y-5.5">
                {COMPANY.map((item) => <NavLink key={item.to} {...item} />)}
                {!user && (
                  <li>
                    <button
                      onClick={() => openAuthModal("login")}
                      className="flex items-center gap-0.5 text-slate-400 hover:text-white transition-colors duration-200 group text-sm w-full text-left cursor-pointer"
                    >
                      <ChevronRight size={15} className="text-[#E31E2E] -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                      Login / Sign Up
                    </button>
                  </li>
                )}
                <li>
                  <Link
                    to="/seller"
                    className="flex items-center gap-1.5 text-[#E31E2E] hover:text-red-400 transition-colors text-sm font-semibold group"
                  >
                    <ChevronRight size={15} className="text-[#E31E2E]" />
                    <Store size={15} className="shrink-0" />
                    Sell With Us
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ══ 4. TRUST BAR — same max-w-7xl container as columns above ══ */}
        <div className="border-t border-white/8 bg-slate-900/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-1">
            <div className="grid  grid-cols-2 sm:grid-cols-5">
              {[
                {
                  label: "Multi-Seller\nMarketplace",
                  icon: (
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25h-1.5A2.25 2.25 0 007.5 13.5V21m0 0H3.75A1.125 1.125 0 012.625 19.875V9.525a1.125 1.125 0 01.393-.855l7.5-6.335a1.125 1.125 0 011.464 0l7.5 6.335c.246.207.393.515.393.855v10.35A1.125 1.125 0 0120.25 21H13.5z" />
                    </svg>
                  ),
                },
                {
                  label: "100%\nGenuine Books",
                  icon: (
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ),
                },
                {
                  label: "Secure\nPayments",
                  icon: (
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  ),
                },
                {
                  label: "Fast & Safe\nDelivery",
                  icon: (
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  ),
                },
                {
                  label: "24/7 Customer\nSupport",
                  icon: (
                    <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  ),
                },
              ].map(({ label, icon }, i, arr) => (
                <div
                  key={label}
                  className={`flex items-center justify-start py-1 mr-4 gap-2 sm:gap-3 ${i < arr.length - 1 ? "border-r border-white/10" : ""
                    }`}
                >
                  <span className="text-[#E31E2E] p-1.5 rounded-lg border border-[#E31E2E]/30 bg-[#E31E2E]/10 flex items-center justify-center shrink-0">
                    {icon}
                  </span>
                  <span className="text-white text-[12px] sm:text-[14px] font-semibold  whitespace-pre-line">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ 5. COPYRIGHT BAR ══ */}
        <div className="border-t border-white/5 bg-black/50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-slate-500 text-xs text-center sm:text-left order-last md:order-first">
                &copy; {new Date().getFullYear()} Books Ka Bazaar &mdash; All rights reserved.
              </span>
              <div className="flex items-center text-xs text-slate-500">
                <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
                <span className="mx-2.5 text-[#E31E2E] text-[8px]">●</span>
                <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Use</Link>
                <span className="mx-2.5 text-[#E31E2E] text-[8px]">●</span>
                <Link to="/disclaimer" className="hover:text-slate-400 transition-colors">Disclaimer</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
