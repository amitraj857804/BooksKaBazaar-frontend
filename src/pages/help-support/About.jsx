import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

/* ── animation ── */
const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

/* ── serif style shorthand ── */

const About = () => (
  /* ⚠️  NO fontFamily on this root div — keeps Navbar font unaffected */
  <div className="bg-[#fafaf8] min-h-screen flex flex-col">
    <Navbar />

    {/* ════════════════════════════════════════
        HERO — editorial masthead
    ════════════════════════════════════════ */}
    <section className="relative bg-white overflow-hidden border-b border-stone-200  ">

      {/* Warm tinted background strip */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(160deg, #fff9f5 0%, #ffffff 55%, #fff5f5 100%)",
        }}
      />

      {/* Decorative vertical lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[14, 35, 60, 82].map((left) => (
          <div
            key={left}
            className="absolute top-0 bottom-0 w-px opacity-[0.06]"
            style={{ left: `${left}%`, background: "#E31E2E" }}
          />
        ))}
      </div>

      <div className="relative px-6 sm:px-10 lg:px-28 mx-auto ">
        {/* Eyebrow rule */}
        <div className="pt-14 pb-8 flex items-center gap-5">
          <div className="h-px flex-1 bg-stone-200" />
          <span
            style={{ letterSpacing: "0.22em" }}
            className="font-sans text-[10px] font-bold text-stone-400 uppercase"
          >
            Our Story
          </span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        {/* Giant staggered display type */}
        <motion.div initial="hidden" animate="visible" variants={stagger}>

          <div className="overflow-hidden">
            <motion.p
              variants={reveal}
              className="sm:text-[11px] text-[8px] font-bold uppercase tracking-[0.2em] text-[#E31E2E] mb-4"
            >
             India's Trusted Multi-Seller Marketplace for Books & Learning Resources
            </motion.p>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              variants={reveal}
              className="text-[clamp(3.2rem,10vw,6rem)] font-black text-stone-900 leading-[0.88] tracking-tighter"
            >
              Books Ka
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              variants={reveal}
              className="text-[clamp(3.2rem,10vw,6rem)] font-black leading-[0.88] tracking-tighter"
              style2={{ color: "#E31E2E" }}
            >
              <span style={{ color: "#E31E2E" }}>Bazaar.</span>
            </motion.h1>
          </div>

          {/* Divider between headline and meta */}
          <motion.div variants={reveal} className="h-px bg-stone-200 mb-8" />

          {/* Metadata row — like a newspaper dateline */}
          <motion.div
            variants={reveal}
            className="flex flex-wrap gap-x-10 gap-y-4 pb-6"
          >
            {[
              ["Registered as", "AS Enterprises Pvt. Ltd."],
              ["Platform", "Multi-seller Marketplace"],
              ["Operates", "Pan-India"],
             
            ].map(([k, v]) => (
              <div key={k}>
                <div
                  style={{ letterSpacing: "0.12em" }}
                  className="font-sans text-[10px] uppercase font-bold text-stone-400 mb-1"
                >
                  {k}
                </div>
                <div className="text-sm font-semibold text-stone-800">
                  {v}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #E31E2E 0%, #ff6b6b 50%, #E31E2E 100%)" }} />
    </section>

    {/* ════════════════════════════════════════
        STORY — long-form editorial
    ════════════════════════════════════════ */}
    <section className="bg-white border-b border-stone-200">
      <div className="px-6 sm:px-10 lg:px-28 mx-auto  py-12 lg:py-18">
        <div className="grid lg:grid-cols-[200px_1fr] gap-10 lg:gap-20">

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pt-2"
          >
            <div className="w-10 h-[4px] mb-5 rounded-full" style={{ background: "#E31E2E" }} />
            <p style={{ letterSpacing: "0.12em" }} className="font-sans text-sm font-bold text-stone-500 uppercase">
              Who We Are
            </p>
            <p className="text-stone-400 text-sm mt-4 leading-relaxed hidden lg:block">
              Founded with a mission to make books accessible to every Indian.
            </p>
          </motion.div>

          {/* Prose */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[1.3rem] lg:text-[1.5rem] leading-[1.7] text-stone-800 mb-7">
              <strong>Books Ka Bazaar</strong> (
              <a
                href="https://www.bookskabazaar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-3 decoration-stone-300 hover:decoration-[#E31E2E] transition-all"
                style={{ color: "#E31E2E" }}
              >
                www.bookskabazaar.com
              </a>
              ) is India&apos;s trusted online multi-seller marketplace dedicated to books
              and educational resources — connecting readers with verified sellers across the country
              through a secure, transparent, and seamless platform.
            </p>

            {/* Pull quote */}
            <blockquote className="my-10 pl-6 py-1" style={{ borderLeft: "4px solid #E31E2E" }}>
              <p className="text-xl lg:text-2xl font-black text-stone-900 leading-snug">
                &ldquo;A one-stop destination for book lovers, students, educators, authors, publishers, and independent booksellers.&rdquo;
              </p>
            </blockquote>

            <p className="text-[1.3rem] lg:text-[1.5rem] leading-[1.7] text-stone-600 mb-5">
              Our platform enables registered sellers across India to list and sell new, old &amp; used, and
              rare books directly to customers. Whether it&apos;s a first-edition novel, a second-hand
              textbook, a digital study guide, or a downloadable PDF — Books Ka Bazaar is where it all lives.
            </p>

            <p className="text-[1.3rem] lg:text-[1.5rem] leading-[1.7] text-stone-600 mb-10">
              As we continue to grow, our platform will also offer self-publishing solutions, print-on-demand
              services, and other innovative publishing and learning solutions.
            </p>

            {/* What we carry — horizontal tag strip */}
            <div>
              <p style={{ letterSpacing: "0.14em" }} className="font-sans text-[10px] font-bold uppercase text-stone-400 mb-4">
                What you&apos;ll find here
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "New Books", "Old & Used Books", "Rare Editions", "Academic Materials",
                  "eBooks", "Digital Study Notes", "Downloadable PDFs",
                  "Online Reading Rooms", "Educational Resources",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 text-sm text-stone-600 border border-stone-200 rounded-full bg-stone-50 hover:border-[#E31E2E] hover:text-[#E31E2E] transition-colors duration-200 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ════════════════════════════════════════
        VISION BAND — dark editorial statement
    ════════════════════════════════════════ */}
    <section
      className="overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #0c1220 0%, #161d2e 60%, #1a0d0d 100%)" }}
    >
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Glowing red orb */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(227,30,46,0.25) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-16 right-10 w-64 h-64 rounded-full pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(227,30,46,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative px-6 sm:px-10 lg:px-28 mx-auto py-8 lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <p
            style={{ letterSpacing: "0.22em" }}
            className="font-sans text-[10px] font-bold uppercase mb-8 flex items-center gap-3"
          >
            <span className="inline-block w-8 h-px" style={{ background: "#E31E2E" }} />
            <span style={{ color: "#E31E2E" }}>Our Vision</span>
          </p>

          {/* Decorative opening quote mark */}
          <div
            style={{ color: "#E31E2E", lineHeight: 1, userSelect: "none" }}
            className="font-serif text-[4rem] lg:text-[10rem] font-black opacity-20 leading-none -mb-8 -ml-2 select-none pointer-events-none"
          >
            &ldquo;
          </div>

          {/* Statement */}
          <p
            className="text-white text-[1.2rem] lg:text-[1.8rem] font-black leading-[1.25] tracking-tight max-w-3xl mb-10"
          >
            Built to make knowledge available to{" "}
            <span style={{ color: "#ff6b6b" }}>every reader</span>,{" "}
            every student, and every curious mind — across every corner of India.
          </p>

          {/* Bottom row: stat chips + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            {/* Stat pills */}
            <div className="flex flex-wrap gap-3">
              {["Pan-India Network", "8+ Resource Types", "Verified Sellers"].map((s) => (
                <span
                  key={s}
                  className="text-xs font-semibold text-slate-300 border border-slate-700 px-4 py-1.5 rounded-full bg-white/5"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-full text-white border border-[#E31E2E] transition-all hover:bg-[#E31E2E]"
            >
              Browse Books <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ════════════════════════════════════════
        LEGAL NOTICE — dark editorial
    ════════════════════════════════════════ */}
    <section style={{ background: "#111827" }} className="border-t border-stone-800">
      <div className="sm:px-10 lg:px-28 mx-auto py-8 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="grid lg:grid-cols-[200px_1fr] gap-6 lg:gap-16"
        >
          <div className="lg:pt-1">
            <div className="w-8 h-[3px] mb-4 rounded-full bg-slate-600" />
            <p style={{ letterSpacing: "0.14em" }} className="font-sans text-[11px] font-bold text-slate-500 uppercase">
              Legal Notice
            </p>
          </div>

          <div>
            <p className="text-slate-300 text-base leading-[1.9] mb-5">
              Books Ka Bazaar acts solely as a{" "}
              <span className="text-white font-semibold">technology intermediary platform</span>{" "}
              that facilitates transactions between buyers and registered sellers, as defined under the{" "}
              <em>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.</em>
            </p>
            <p className="text-slate-500 text-sm leading-[1.9]">
              Unless a product listing expressly carries the tag{" "}
              <span style={{ color: "#ff7b7b" }}>&lsquo;Sold by Books Ka Bazaar&rsquo;</span>,
              Books Ka Bazaar is not the owner, manufacturer, publisher, or seller of any product listed
              by independent sellers on the Platform.
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ════════════════════════════════════════
        CONTACT + ENTITY — clean table layout
    ════════════════════════════════════════ */}
    <section className="bg-[#fafaf8] border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-14 lg:py-18">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-12"
        >
          <div className="flex items-center gap-5 mb-0">
            <div className="w-8 h-[3px] rounded-full" style={{ background: "#E31E2E" }} />
            <p style={{ letterSpacing: "0.16em" }} className="font-sans text-[10px] font-bold text-stone-400 uppercase">
              Contact &amp; Company
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-0 border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-sm">

          {/* Left: Entity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-stone-100"
          >
            <p style={{ letterSpacing: "0.13em" }} className="font-sans text-[10px] font-bold text-stone-400 uppercase mb-7">
              Registered Details
            </p>

            <dl className="divide-y divide-stone-100">
              {[
                { label: "Registered Entity", value: "AS Enterprises Pvt. Ltd." },
                { label: "Brand Name", value: "Books Ka Bazaar" },
                { label: "Website", value: "www.bookskabazaar.com", href: "https://www.bookskabazaar.com" },
              ].map(({ label, value, href }) => (
                <div key={label} className="py-4 flex justify-between items-center gap-4">
                  <dt style={{ letterSpacing: "0.1em" }} className="font-sans text-[11px] uppercase font-semibold text-stone-400 shrink-0">
                    {label}
                  </dt>
                  <dd className="text-stone-800 font-semibold text-sm text-right">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#E31E2E] transition-colors inline-flex items-center gap-1 group"
                      >
                        {value}
                        <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#E31E2E]" />
                      </a>
                    ) : value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Location chip */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="inline-flex items-center gap-2 text-stone-500 text-xs">
                <MapPin size={13} style={{ color: "#E31E2E" }} />
                Kurthaul, Patna, Bihar — 804453, India
              </div>
            </div>
          </motion.div>

          {/* Right: Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="p-8 lg:p-10"
          >
            <p style={{ letterSpacing: "0.13em" }} className="font-sans text-[10px] font-bold text-stone-400 uppercase mb-7">
              Write to Us
            </p>

            <dl className="divide-y divide-stone-100">
              {[
                { label: "General Contact", email: "contact@bookskabazaar.com" },
                { label: "Customer Support", email: "support@bookskabazaar.com" },
                { label: "Grievance Officer", email: "grievance@bookskabazaar.com" },
              ].map(({ label, email }) => (
                <div key={label} className="py-4">
                  <dt style={{ letterSpacing: "0.1em" }} className="font-sans text-[11px] uppercase font-semibold text-stone-400 mb-1.5">
                    {label}
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${email}`}
                      className="text-stone-800 font-semibold text-sm hover:text-[#E31E2E] transition-colors inline-flex items-center gap-1 group"
                    >
                      {email}
                      <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#E31E2E]" />
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ════════════════════════════════════════
        BOTTOM CTA — minimal
    ════════════════════════════════════════ */}
    <section className="bg-white border-t border-stone-100">
      <div className="sm:px-10 px-6 lg:px-28 mx-auto py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-8"
        >
          {/* Left: text */}
          <div>
            <p style={{ letterSpacing: "0.16em" }} className="font-sans text-[10px] font-semibold text-stone-400 uppercase mb-3">
              Start exploring
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-snug">
              A book for every kind of reader.
            </h2>
            <p className="text-stone-400 text-sm mt-2">
              Browse thousands of titles or list your own on Bazaar.
            </p>
          </div>

          {/* Right: buttons */}
          <div className="flex flex-row gap-3 shrink-0">
            <Link
              to="/"
              style={{ background: "#E31E2E" }}
              className="font-sans inline-flex items-center gap-2 px-6 py-2.5 text-white font-semibold sm:text-sm text-xs rounded-full transition-all hover:opacity-90"
            >
              Browse Books <ArrowUpRight size={14} />
            </Link>
            <Link
              to="/seller"
              className="inline-flex items-center gap-2 px-6 py-3 border border-stone-200 hover:border-stone-400 text-stone-700 font-semibold sm:text-sm text-xs rounded-full transition-all"
            >
              Sell on Bazaar <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
