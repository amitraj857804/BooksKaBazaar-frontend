import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, ArrowUpRight } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";


/**
 * Reusable policy page template.
 * Props:
 *   title       – page H1 (e.g. "Privacy Policy")
 *   eyebrow     – small label above H1 (default "Legal")
 *   updated     – last updated string (default "July 2026")
 *   sections    – array of { heading, body (string | JSX) }
 */
const PolicyPage = ({ title, eyebrow = "Legal", updated = "July 2026", sections = [] }) => (
  <div className="bg-[#fafaf8] min-h-screen flex flex-col font-sans">
    <Navbar />

    

    {/* ── CONTENT ── */}
    <section className="flex-1">
      <div className="px-6 sm:px-10 lg:px-28 mx-auto py-14 lg:py-20">

        {sections.length === 0 ? (
          /* Placeholder when content hasn't been added yet */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-stone-100 rounded-2xl p-10 text-center max-w-lg mx-auto"
          >
            <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-5">
              <FileText size={20} className="text-stone-400" />
            </div>
            <h2 className="font-serif text-xl font-black text-stone-800 mb-2">Content coming soon</h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              This policy is currently being prepared. Please check back shortly or contact us for details.
            </p>
            <Link
              to="/connect"
              className="inline-flex items-center gap-1.5 mt-6 px-5 py-2.5 text-white text-sm font-semibold rounded-full transition-all hover:opacity-90"
              style={{ background: "#E31E2E" }}
            >
              Contact Us <ArrowUpRight size={13} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {sections.map(({ heading, body }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                {heading && (
                  <h2 className="font-serif text-xl font-black text-stone-900 mb-3 pb-2 border-b border-stone-100">
                    {heading}
                  </h2>
                )}
                <div className="text-stone-500 text-m leading-[1.8]">{body}</div>
              </motion.div>
            ))}
          </div>
        )}

       
      </div>
    </section>

    <Footer />
  </div>
);

export default PolicyPage;
