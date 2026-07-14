import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Mail } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

/* Ã¢â€â‚¬Ã¢â€â‚¬ typography (mirrors About.jsx) Ã¢â€â‚¬Ã¢â€â‚¬ */
const serif = { fontFamily: "'Georgia', 'Times New Roman', serif" };
const sans  = { fontFamily: "'Inter', 'Helvetica Neue', sans-serif" };

/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
   DATA
Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
const CATEGORIES = [
  {
    id: "general",
    label: "General",
    slug: "01",
    items: [
      {
        q: "What is Books Ka Bazaar?",
        a: "Books Ka Bazaar (www.bookskabazaar.com) is India's trusted online multi-seller marketplace dedicated to books and educational resources. We connect readers with verified sellers across the country for new books, old/used books, rare editions, eBooks, digital study notes, online reading rooms and educational materials. Future offerings will include self-publishing and print services.",
      },
      {
        q: "Does Books Ka Bazaar sell books directly?",
        a: "Generally, Books Ka Bazaar acts solely as a platform connecting Buyers with independent registered Sellers. Some select products may be listed as 'Sold by Books Ka Bazaar' where we do act as the direct Seller Ã¢â‚¬â€ this will always be clearly indicated on the listing.",
      },
      {
        q: "Is Books Ka Bazaar available across all of India?",
        a: "Yes. Books Ka Bazaar is accessible across India. Physical delivery reach depends on the courier partner's serviceable pin codes. Digital products are accessible nationwide instantly upon purchase.",
      },
    ],
  },
  {
    id: "buyers",
    label: "For Buyers",
    slug: "02",
    items: [
      {
        q: "How do I place an order?",
        a: "Search for the book you want, compare listings from different Sellers (price, condition, location), select your preferred listing, add to cart, and proceed to checkout. Pay via UPI, net banking, debit/credit card, or COD where available.",
      },
      {
        q: "Can I buy from multiple Sellers in one cart?",
        a: "Yes. Your cart can hold books from multiple Sellers. Each Seller's items are treated as separate sub-orders for shipping, tracking, and returns.",
      },
      {
        q: "What do the book condition grades mean?",
        a: "Like New: Essentially unused. Very Good: Minor signs of use, no markings. Good: Some wear/markings, fully readable. Acceptable: Noticeable wear, may have annotations, text intact. Poor Ã¢â‚¬â€œ Sold As-Is: Heavy wear; listed transparently Ã¢â‚¬â€ non-returnable.",
      },
      {
        q: "What if I receive a damaged or wrong book?",
        a: "Raise a dispute within 7 days of delivery via My Orders Ã¢â€ â€™ Select Order Ã¢â€ â€™ Raise Dispute. Upload photographs as evidence. Our team will review and resolve within 5 business days.",
      },
      {
        q: "Are digital products (eBooks, PDFs) refundable?",
        a: "Due to the nature of digital access, they are generally non-refundable once accessed or downloaded. Refunds are issued only for permanently corrupted files, materially misdescribed content, or duplicate charges.",
      },
      {
        q: "How do I access my purchased digital products?",
        a: "Immediately after payment confirmation, a download link and/or access credentials are sent to your registered email. You can also access them via My Orders Ã¢â€ â€™ Digital Downloads in your account dashboard.",
      },
      {
        q: "Is my payment information safe?",
        a: "Yes. Books Ka Bazaar does not store your card or banking credentials. All transactions are processed by PCI-DSS compliant third-party payment gateways with OTP authentication.",
      },
      {
        q: "How do I track my order?",
        a: "Go to My Orders Ã¢â€ â€™ Select Order Ã¢â€ â€™ Track Shipment. The tracking number and courier details are updated by the Seller within 24 hours of dispatch.",
      },
    ],
  },
  {
    id: "sellers",
    label: "For Sellers",
    slug: "03",
    items: [
      {
        q: "How do I register as a Seller?",
        a: "Click 'Register as a Seller'. Complete your profile with: legal name, PAN card, GST number (if applicable), bank account for payouts, and KYC documents. Approval takes 1-2 business days after document verification.",
      },
      {
        q: "What types of books and products can I sell?",
        a: "Currently: new hardbound/softcover books, old/used books, and rare/collectible books, digital study notes, eBooks, online reading room content among others. Future categories: self-publishing services and print services. Pirated or counterfeit items are strictly prohibited.",
      },
      {
        q: "What commission does Books Ka Bazaar charge?",
        a: "Commission rates by category are published in your Seller Dashboard and are subject to revision with 15 days' advance notice. GST applies on all commission amounts. You will always see the commission applicable before confirming a listing.",
      },
      {
        q: "When will I receive my payout?",
        a: "Payouts for completed, non-disputed orders are processed within 7 business days of confirmed delivery to the Buyer. Funds are transferred to your registered bank account.",
      },
      {
        q: "What if a Buyer raises a false dispute against me?",
        a: "You have 48 hours to respond with counter-evidence (your listing screenshots, photographs, courier tracking). Books Ka Bazaar reviews evidence from both parties before making a determination. Buyers with repeated false disputes face restrictions.",
      },
      {
        q: "Can I offer my own shipping rates and conditions?",
        a: "No. Shipping charges are determined by our courier aggregator based on serviceability, delivery location, and distance. Free shipping, including any order value threshold, is offered solely at the discretion of the courier aggregator.",
      },
      {
        q: "Will self-publishing and print services be available?",
        a: "Yes Ã¢â‚¬â€ these are planned for a future phase. Register your interest in the Seller Dashboard and you will be notified when these features launch with their applicable terms.",
      },
    ],
  },
  {
    id: "digital",
    label: "Digital & eBooks",
    slug: "04",
    items: [
      {
        q: "What file formats are supported for digital products?",
        a: "Supported formats include PDF, ePub, MOBI, and other common eBook formats. Sellers must disclose the format clearly in their listing.",
      },
      {
        q: "How long is a reading room access pass valid?",
        a: "Validity is specified at the time of purchase (e.g., 7 days, 30 days, 1 year). Passes cannot be paused or transferred.",
      },
      {
        q: "Can I share my digital purchase with others?",
        a: "No. Digital licences are personal and non-transferable. Sharing access or redistribution violates the Digital Products Policy and may result in account termination and legal action.",
      },
    ],
  },
];

/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
   SINGLE ACCORDION ITEM
Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
const Item = ({ q, a, globalIndex }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-stone-200 relative"
      style={{ transition: "background 0.2s" }}
    >
      {/* sliding left-edge red bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
        style={{
          background: "#E31E2E",
          transform: open ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top",
          transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 text-left group"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "1.1rem 0.75rem 1.1rem 1rem",
          borderRadius: "0.5rem",
          transition: "background 0.18s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(227,30,46,0.04)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = open ? "rgba(227,30,46,0.035)" : "transparent"; }}
        aria-expanded={open}
      >
        {/* number badge */}
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black tracking-wider select-none"
          style={{
            ...sans,
            background: open ? "#E31E2E" : "#f5f4f2",
            color: open ? "#fff" : "#b5afa7",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {String(globalIndex + 1).padStart(2, "0")}
        </span>

        <span
          className="flex-1 text-[0.95rem] font-semibold leading-snug transition-all duration-200"
          style={{
            ...sans,
            color: open ? "#1c1917" : "#44403c",
            transform: open ? "translateX(2px)" : "translateX(0)",
            display: "block",
          }}
        >
          {q}
        </span>

        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 ml-3 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: open ? "#E31E2E" : "transparent",
            border: open ? "none" : "1.5px solid #d6d3d1",
            transition: "background 0.2s",
          }}
        >
          <Plus size={12} color={open ? "#fff" : "#9ca3af"} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="text-stone-600 text-[0.88rem] leading-[1.9]"
              style={{
                ...serif,
                margin: "0 0.75rem 1.25rem 3.5rem",
                paddingLeft: "1rem",
                paddingBottom: "0",
                borderLeft: "2px solid #E31E2E",
                background: "rgba(227,30,46,0.025)",
                borderRadius: "0 0.5rem 0.5rem 0",
                padding: "0.75rem 1rem 0.75rem 1rem",
              }}
            >
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
   CATEGORY BLOCK
Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
const CategoryBlock = ({ cat, startIndex }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    id={cat.id}
    className="mb-14 scroll-mt-28"
  >
    {/* column-style section heading */}
    <div className="flex items-center gap-4 mb-1">
      <span
        className="text-[10px] font-black tracking-[0.22em] uppercase"
        style={{ ...sans, color: "#E31E2E" }}
      >
        {cat.slug}
      </span>
      <div className="h-px flex-1 bg-stone-200" />
      <span
        className="text-[10px] font-bold tracking-[0.18em] uppercase text-stone-400"
        style={sans}
      >
        {cat.label}
      </span>
    </div>

    <div className="border-t border-stone-800/10 mt-2">
      {cat.items.map((item, i) => (
        <Item key={item.q} q={item.q} a={item.a} globalIndex={startIndex + i} />
      ))}
    </div>
  </motion.div>
);

/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
   PAGE
Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
const FAQ = () => {
  const [activeSection, setActiveSection] = useState(null);

  const startIndexes = CATEGORIES.reduce((acc, cat, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + CATEGORIES[i - 1].items.length);
    return acc;
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-[#fafaf8] min-h-screen flex flex-col">
      <Navbar />

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â MASTHEAD Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <section className="relative bg-white border-b border-stone-200 overflow-hidden">
        {/* warm tint */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(160deg, #fff9f5 0%, #ffffff 55%, #fff5f5 100%)" }}
        />
        {/* decorative vertical rules */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[12, 38, 65, 88].map((left) => (
            <div
              key={left}
              className="absolute top-0 bottom-0 w-px"
              style={{ left: `${left}%`, background: "#E31E2E", opacity: 0.05 }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
          {/* eyebrow rule */}
          <div className="pt-12 pb-6 flex items-center gap-5">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-[10px] font-bold text-stone-400 uppercase" style={{ ...sans, letterSpacing: "0.22em" }}>
              Help &amp; Support
            </span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
          >
            <div className="overflow-hidden">
              <motion.p
                variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
                className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
                style={{ ...sans, color: "#E31E2E" }}
              >
                Frequently Asked Questions
              </motion.p>
            </div>

            <div className="overflow-hidden">
              <motion.h1
                variants={{ hidden: { opacity: 0, y: 34 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } }}
                className="text-[clamp(2.6rem,7.5vw,6rem)] font-black text-stone-900 leading-[0.92] tracking-tighter mb-2"
                style={serif}
              >
                Your questions,
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-5">
              <motion.h1
                variants={{ hidden: { opacity: 0, y: 34 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } }}
                className="text-[clamp(2.6rem,7.5vw,6rem)] font-black leading-[0.92] tracking-tighter"
                style={{ ...serif, color: "#E31E2E" }}
              >
                answered.
              </motion.h1>
            </div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3 } } }}
              className="h-px bg-stone-200 mb-7"
            />

            {/* dateline */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.35 } } }}
              className="flex flex-wrap gap-x-10 gap-y-4 pb-12"
            >
              {[
                ["Questions covered", `${CATEGORIES.reduce((s, c) => s + c.items.length, 0)} answers`],
                ["Sections", CATEGORIES.map((c) => c.label).join(" / ")],
                ["Support email", "support@bookskabazaar.com"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] uppercase font-bold text-stone-400 mb-1" style={{ ...sans, letterSpacing: "0.12em" }}>{k}</div>
                  <div className="text-sm font-semibold text-stone-800" style={sans}>{v}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* red accent bar */}
        <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, #E31E2E 0%, #ff6b6b 50%, #E31E2E 100%)" }} />
      </section>

     
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="grid lg:grid-cols-[210px_1fr] gap-10 lg:gap-20 items-start">

            {/* sticky sidebar nav */}
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-24"
            >
              <div className="w-8 h-[3px] mb-5 rounded-full" style={{ background: "#E31E2E" }} />
              <p className="text-[11px] font-bold text-stone-400 uppercase mb-5" style={{ ...sans, letterSpacing: "0.14em" }}>
                Jump to
              </p>
              <nav className="space-y-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => scrollTo(cat.id)}
                    className="w-full flex items-center gap-3 py-2 text-left"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <span
                      className="text-[10px] font-black tracking-widest shrink-0 transition-colors"
                      style={{ ...sans, color: activeSection === cat.id ? "#E31E2E" : "#d1ccc5" }}
                    >
                      {cat.slug}
                    </span>
                    <span
                      className="text-[0.82rem] font-semibold transition-colors"
                      style={{ ...sans, color: activeSection === cat.id ? "#1c1917" : "#78716c" }}
                    >
                      {cat.label}
                    </span>
                    {activeSection === cat.id && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#E31E2E" }} />
                    )}
                  </button>
                ))}
              </nav>

              <div className="h-px bg-stone-100 my-6" />

              <p className="text-stone-400 text-sm leading-relaxed" style={sans}>
                Didn&apos;t find your answer?{" "}
                <a
                  href="mailto:support@bookskabazaar.com"
                  className="underline underline-offset-2 text-stone-500 hover:text-[#E31E2E] transition-colors"
                >
                  Email us
                </a>
                .
              </p>
            </motion.aside>

            {/* main FAQ content */}
            <div>
              {CATEGORIES.map((cat, i) => (
                <CategoryBlock key={cat.id} cat={cat} startIndex={startIndexes[i]} />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â• DARK CTA BAND (matches About page Vision section) â•â•â•â•â•â•â•â•â•â• */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0c1220 0%, #161d2e 60%, #1a0d0d 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(227,30,46,0.22) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-16 right-10 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(227,30,46,0.13) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-bold uppercase mb-8 flex items-center gap-3" style={{ ...sans, letterSpacing: "0.22em" }}>
              <span className="inline-block w-8 h-px" style={{ background: "#E31E2E" }} />
              <span style={{ color: "#E31E2E" }}>Still need help?</span>
            </p>

            <p
              className="text-white text-[1.5rem] lg:text-[2rem] font-black leading-[1.25] tracking-tight max-w-2xl mb-10"
              style={serif}
            >
              Our support team is here for you &mdash; reach out and we&apos;ll get back to you within{" "}
              <span style={{ color: "#ff6b6b" }}>one business day.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:support@bookskabazaar.com"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ ...sans, background: "#E31E2E" }}
              >
                <Mail size={15} />
                support@bookskabazaar.com
              </a>
              
            </div>
          </motion.div>
        </div>
      </section>



      <Footer />
    </div>
  );
};

export default FAQ;
