import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Store, FileText, ArrowUpRight } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";


const POINTS = [
  {
    num: "01",
    icon: <Store size={16} className="text-[#E31E2E]" />,
    title: "Marketplace Notice",
    body: (
      <>
        Books Ka Bazaar is a technology-driven multi-seller marketplace that connects buyers and
        registered sellers of books and educational resources across India. Unless specifically
        identified as <strong className="text-stone-700">'Sold by Books Ka Bazaar'</strong>,
        Books Ka Bazaar is not the Seller of products listed by independent sellers on this Platform.
      </>
    ),
  },
  {
    num: "02",
    icon: <ShieldCheck size={16} className="text-[#E31E2E]" />,
    title: "Seller Responsibility",
    body: "Product descriptions, pricing, availability, condition, and warranties are solely provided by and the responsibility of respective Sellers. Books Ka Bazaar makes no warranties, express or implied, regarding the accuracy of Seller listings.",
  },
  {
    num: "03",
    icon: <FileText size={16} className="text-[#E31E2E]" />,
    title: "Platform Policies",
    body: (
      <>
        All transactions are subject to Books Ka Bazaar&apos;s{" "}
        <Link to="/returns" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-80 transition-opacity font-medium">
          Returns &amp; Refunds Policy
        </Link>
        ,{" "}
        <Link to="/shipping" className="text-[#E31E2E] underline underline-offset-2 hover:opacity-80 transition-opacity font-medium">
          Delivery &amp; Shipping Policy
        </Link>
        , and other applicable Platform policies.
      </>
    ),
  },
];

const Disclaimer = () => (
  <div className="bg-[#fafaf8] min-h-screen flex flex-col">
    <Navbar />

    {/* ── HERO ── */}
    <section className="bg-white border-b border-stone-100">
      <div className="px-6 sm:px-10 lg:px-28 mx-auto py-14 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p style={{ letterSpacing: "0.18em" }} className="text-[10px] font-bold text-stone-400 uppercase mb-4">
            Legal
          </p>
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-black text-stone-900 tracking-tight leading-tight mb-4">
            Disclaimer
          </h1>
          <p className="text-stone-500 text-sm max-w-lg leading-relaxed">
            Please read this disclaimer carefully before using the Books Ka Bazaar platform.
            By accessing or using our services you acknowledge that you have read and understood
            the following terms.
          </p>
          <p style={{ letterSpacing: "0.1em" }} className="text-stone-400 text-[11px] uppercase mt-5">
            Last updated: July 2026
          </p>
        </motion.div>
      </div>
    </section>

    {/* ── MAIN CONTENT ── */}
    <section className="flex-1">
      <div className="px-6 sm:px-10 lg:px-28 mx-auto py-16 lg:py-20">

        {/* Three disclaimer points */}
        <div className="space-y-5 mb-14">
          {POINTS.map(({ num, icon, title, body }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-stone-100 rounded-2xl p-7 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-stone-300 tracking-widest">{num}</span>
                {icon}
                <h2 className="text-base font-black text-stone-900">
                  {title}
                </h2>
              </div>
              <p className="text-stone-500 text-sm leading-[1.9]">{body}</p>
            </motion.div>
          ))}
        </div>

        {/* ── COMPLIANCE STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="bg-white border border-stone-100 rounded-2xl overflow-hidden"
          style={{ borderTop: "3px solid #E31E2E" }}
        >
          {/* Tagline */}
          <div className="px-7 lg:px-10 py-5 border-b border-stone-100 bg-[#fdf5f5] text-center">
            <p className="text-stone-600 text-sm font-semibold leading-relaxed">
              Books Ka Bazaar &mdash;{" "}
              <span className="text-[#E31E2E] font-black">
                India&apos;s Trusted Multi-Seller Marketplace
              </span>{" "}
              for Books &amp; Learning Resources
            </p>
          </div>

          {/* Compliance details */}
          <div className="px-7 lg:px-10 py-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
            {/* Intermediary */}
            <div className="pb-5 sm:pb-0 sm:pr-6">
              <p style={{ letterSpacing: "0.12em" }} className="text-[10px] font-bold uppercase text-stone-400 mb-1.5">
                Platform Type
              </p>
              <p className="text-stone-700 text-sm font-semibold">Intermediary Platform</p>
            </div>

            {/* IT Act */}
            <div className="py-5 sm:py-0 sm:px-6">
              <p style={{ letterSpacing: "0.12em" }} className="text-[10px] font-bold uppercase text-stone-400 mb-1.5">
                Compliance
              </p>
              <p className="text-stone-700 text-sm font-semibold">IT Act, 2000</p>
              <p className="text-stone-400 text-xs mt-0.5">Consumer Protection (E-Commerce) Rules, 2020</p>
            </div>

            {/* Grievance */}
            <div className="py-5 sm:py-0 sm:px-6">
              <p style={{ letterSpacing: "0.12em" }} className="text-[10px] font-bold uppercase text-stone-400 mb-1.5">
                Disputes &amp; Grievances
              </p>
              <a
                href="mailto:grievance@bookskabazaar.com"
                className="text-[#E31E2E] text-sm font-semibold hover:opacity-75 transition-opacity underline underline-offset-2 break-all"
              >
                grievance@bookskabazaar.com
              </a>
            </div>

            {/* Copyright */}
            <div className="pt-5 sm:pt-0 sm:pl-6">
              <p style={{ letterSpacing: "0.12em" }} className="text-[10px] font-bold uppercase text-stone-400 mb-1.5">
                Copyright
              </p>
              <p className="text-stone-700 text-sm font-semibold">
                &copy; {new Date().getFullYear()} Books Ka Bazaar
              </p>
              <p className="text-stone-400 text-xs mt-0.5">All rights reserved.</p>
            </div>
          </div>
        </motion.div>

        

      </div>
    </section>

    <Footer />
  </div>
);

export default Disclaimer;
