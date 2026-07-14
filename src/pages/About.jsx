import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

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
const serif = { fontFamily: "'Georgia', 'Times New Roman', serif" };
const sans  = { fontFamily: "'Inter', 'Helvetica Neue', sans-serif" };

const About = () => (
  /* ⚠️  NO fontFamily on this root div — keeps Navbar font unaffected */
  <div className="bg-[#fafaf8] min-h-screen flex flex-col">
    <Navbar />

    {/* ════════════════════════════════════════
        HERO — editorial masthead
    ════════════════════════════════════════ */}
    <section className="relative bg-white overflow-hidden border-b border-stone-200">

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

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        {/* Eyebrow rule */}
        <div className="pt-14 pb-8 flex items-center gap-5">
          <div className="h-px flex-1 bg-stone-200" />
          <span
            style={{ ...sans, letterSpacing: "0.22em" }}
            className="text-[10px] font-bold text-stone-400 uppercase"
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
              style={sans}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E31E2E] mb-4"
            >
              India&apos;s Trusted Book Marketplace
            </motion.p>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              variants={reveal}
              style={serif}
              className="text-[clamp(3.2rem,10vw,8.5rem)] font-black text-stone-900 leading-[0.88] tracking-tighter"
            >
              Books Ka
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-6">
            <motion.h1
              variants={reveal}
              style={serif}
              className="text-[clamp(3.2rem,10vw,8.5rem)] font-black leading-[0.88] tracking-tighter"
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
            className="flex flex-wrap gap-x-10 gap-y-4 pb-14"
          >
            {[
              ["Registered as", "AS Enterprises Pvt. Ltd."],
              ["Platform", "Multi-seller Marketplace"],
              ["Operates", "Pan-India"],
              ["Website", "www.bookskabazaar.com"],
            ].map(([k, v]) => (
              <div key={k}>
                <div
                  style={{ ...sans, letterSpacing: "0.12em" }}
                  className="text-[10px] uppercase font-bold text-stone-400 mb-1"
                >
                  {k}
                </div>
                <div style={sans} className="text-sm font-semibold text-stone-800">
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
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
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
            <p style={{ ...sans, letterSpacing: "0.12em" }} className="text-sm font-bold text-stone-500 uppercase">
              Who We Are
            </p>
            <p style={sans} className="text-stone-400 text-sm mt-4 leading-relaxed hidden lg:block">
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
            <p style={serif} className="text-[1.3rem] lg:text-[1.5rem] leading-[1.7] text-stone-800 mb-7">
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
              <p style={serif} className="text-xl lg:text-2xl font-black text-stone-900 leading-snug">
                &ldquo;A one-stop destination for book lovers, students, educators, authors, publishers, and independent booksellers.&rdquo;
              </p>
            </blockquote>

            <p style={serif} className="text-base leading-[1.9] text-stone-600 mb-5">
              Our platform enables registered sellers across India to list and sell new, old &amp; used, and
              rare books directly to customers. Whether it&apos;s a first-edition novel, a second-hand
              textbook, a digital study guide, or a downloadable PDF — Books Ka Bazaar is where it all lives.
            </p>

            <p style={serif} className="text-base leading-[1.9] text-stone-600 mb-10">
              As we continue to grow, our platform will also offer self-publishing solutions, print-on-demand
              services, and other innovative publishing and learning solutions.
            </p>

            {/* What we carry — horizontal tag strip */}
            <div>
              <p style={{ ...sans, letterSpacing: "0.14em" }} className="text-[10px] font-bold uppercase text-stone-400 mb-4">
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
                    style={sans}
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

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <p
            style={{ ...sans, letterSpacing: "0.22em" }}
            className="text-[10px] font-bold uppercase mb-8 flex items-center gap-3"
          >
            <span className="inline-block w-8 h-px" style={{ background: "#E31E2E" }} />
            <span style={{ color: "#E31E2E" }}>Our Vision</span>
          </p>

          {/* Decorative opening quote mark */}
          <div
            style={{ ...serif, color: "#E31E2E", lineHeight: 1, userSelect: "none" }}
            className="text-[7rem] lg:text-[10rem] font-black opacity-20 leading-none -mb-8 -ml-2 select-none pointer-events-none"
          >
            &ldquo;
          </div>

          {/* Statement */}
          <p
            style={serif}
            className="text-white text-[1.6rem] lg:text-[2.2rem] font-black leading-[1.25] tracking-tight max-w-3xl mb-10"
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
                  style={sans}
                  className="text-xs font-semibold text-slate-300 border border-slate-700 px-4 py-1.5 rounded-full bg-white/5"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/"
              style={sans}
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
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="grid lg:grid-cols-[200px_1fr] gap-10 lg:gap-20"
        >
          <div className="lg:pt-1">
            <div className="w-8 h-[3px] mb-5 rounded-full bg-slate-600" />
            <p style={{ ...sans, letterSpacing: "0.14em" }} className="text-[11px] font-bold text-slate-500 uppercase">
              Legal Notice
            </p>
          </div>

          <div>
            <p style={serif} className="text-slate-300 text-base leading-[1.9] mb-5">
              Books Ka Bazaar acts solely as a{" "}
              <span className="text-white font-semibold">technology intermediary platform</span>{" "}
              that facilitates transactions between buyers and registered sellers, as defined under the{" "}
              <em>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.</em>
            </p>
            <p style={serif} className="text-slate-500 text-sm leading-[1.9]">
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
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20 lg:py-24">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-12"
        >
          <div className="flex items-center gap-5 mb-0">
            <div className="w-8 h-[3px] rounded-full" style={{ background: "#E31E2E" }} />
            <p style={{ ...sans, letterSpacing: "0.16em" }} className="text-[10px] font-bold text-stone-400 uppercase">
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
            <p style={{ ...sans, letterSpacing: "0.13em" }} className="text-[10px] font-bold text-stone-400 uppercase mb-7">
              Registered Details
            </p>

            <dl className="divide-y divide-stone-100">
              {[
                { label: "Registered Entity", value: "AS Enterprises Pvt. Ltd." },
                { label: "Brand Name", value: "Books Ka Bazaar" },
                { label: "Website", value: "www.bookskabazaar.com", href: "https://www.bookskabazaar.com" },
              ].map(({ label, value, href }) => (
                <div key={label} className="py-4 flex justify-between items-center gap-4">
                  <dt style={{ ...sans, letterSpacing: "0.1em" }} className="text-[11px] uppercase font-semibold text-stone-400 shrink-0">
                    {label}
                  </dt>
                  <dd style={sans} className="text-stone-800 font-semibold text-sm text-right">
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
              <div className="inline-flex items-center gap-2 text-stone-500 text-xs" style={sans}>
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
            <p style={{ ...sans, letterSpacing: "0.13em" }} className="text-[10px] font-bold text-stone-400 uppercase mb-7">
              Write to Us
            </p>

            <dl className="divide-y divide-stone-100">
              {[
                { label: "General Contact", email: "contact@bookskabazaar.com" },
                { label: "Customer Support", email: "support@bookskabazaar.com" },
                { label: "Grievance Officer", email: "grievance@bookskabazaar.com" },
              ].map(({ label, email }) => (
                <div key={label} className="py-4">
                  <dt style={{ ...sans, letterSpacing: "0.1em" }} className="text-[11px] uppercase font-semibold text-stone-400 mb-1.5">
                    {label}
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${email}`}
                      style={sans}
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
        BOTTOM CTA — typographic, asymmetric
    ════════════════════════════════════════ */}
    <section className="bg-white border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-10"
        >
          <div>
            <p style={{ ...sans, letterSpacing: "0.16em" }} className="text-[10px] font-bold text-stone-400 uppercase mb-5">
              Start exploring
            </p>
            <h2 style={serif} className="text-[clamp(2rem,5vw,4.5rem)] font-black text-stone-900 leading-tight tracking-tighter max-w-lg">
              A book for<br />every kind of reader.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:pb-2 shrink-0">
            <Link
              to="/"
              style={{ ...sans, background: "#E31E2E" }}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-bold text-sm rounded-full transition-all hover:opacity-90"
            >
              Browse Books <ArrowUpRight size={15} />
            </Link>
            <Link
              to="/seller"
              style={sans}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-full transition-all"
            >
              Sell on Bazaar <ArrowUpRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
