import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, Send, CheckCircle, MapPin, MessageSquare } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import toast from "react-hot-toast";


const Connect = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Please enter your name.");
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      return toast.error("Please enter a valid 10-digit phone number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return toast.error("Please enter a valid email address.");

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <div className="bg-[#fafaf8] min-h-screen flex flex-col">
      <Navbar />

      {/* ── HERO STRIP ── */}
      <section className="bg-white border-b border-stone-100">
        <div className="sm:px-10 px-6 lg:px-28 mx-auto py-14 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p style={{ letterSpacing: "0.18em" }} className="text-[10px] font-bold text-stone-400 uppercase mb-4">
              Get in touch
            </p>
            <h1 className="text-[clamp(2rem,5vw,4rem)] font-black text-stone-900 tracking-tight leading-tight mb-4">
              Connect with us.
            </h1>
            <p className="text-stone-500 text-sm max-w-md leading-relaxed">
              Have a question, feedback, or just want to say hello? Fill in your details and our team will reach out to you shortly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="flex-1">
        <div className=" px-6 sm:px-10 lg:px-28 mx-auto py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14 lg:gap-20">

            {/* ── FORM ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {submitted ? (
                <div className="flex flex-col items-start gap-5 py-10">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center">
                    <CheckCircle size={26} className="text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-stone-900 mb-2">We've received your details!</h2>
                    <p className="text-stone-500 text-sm max-w-sm leading-relaxed">
                      Thank you, <span className="font-semibold text-stone-700">{form.name}</span>. Our team will get back to you at <span className="font-semibold text-stone-700">{form.email}</span> within 24–48 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", message: "" }); }}
                    className="mt-2 px-5 py-2.5 text-sm font-semibold text-stone-600 border border-stone-200 rounded-full hover:border-stone-400 transition-all"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">
                      Full Name <span className="text-[#E31E2E]">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">
                      Phone Number <span className="text-[#E31E2E]">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        name="phone"
                        type="tel"
                        required
                        maxLength={10}
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">
                      Email Address <span className="text-[#E31E2E]">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message (optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">
                      Message <span className="text-stone-300 font-normal normal-case tracking-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <MessageSquare size={15} className="absolute left-4 top-4 text-stone-400" />
                      <textarea
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you…"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-bold text-sm rounded-full transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: "#E31E2E" }}
                  >
                    {submitting ? "Sending…" : "Send Message"}
                    <Send size={14} />
                  </button>
                </form>
              )}
            </motion.div>

            {/* ── SIDEBAR INFO ── */}
            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Contact info card */}
              <div className="bg-white border border-stone-100 rounded-2xl p-7 space-y-5">
                <h3 className="text-lg font-black text-stone-900">Contact Details</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3 text-stone-500">
                    <MapPin size={15} className="text-[#E31E2E] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">Kurthaul, Patna, Bihar — 804453, India</span>
                  </li>
                  <li>
                    <a href="tel:+918228904120" className="flex items-center gap-3 text-stone-500 hover:text-stone-800 transition-colors">
                      <Phone size={15} className="text-[#E31E2E] shrink-0" />
                      +91 82289 04120
                    </a>
                  </li>
                  <li>
                    <a href="mailto:support@bookskabazaar.com" className="flex items-center gap-3 text-stone-500 hover:text-stone-800 transition-colors">
                      <Mail size={15} className="text-[#E31E2E] shrink-0" />
                      support@bookskabazaar.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* Response time note */}
              <div className="bg-stone-900 rounded-2xl p-7">
                <p style={{ letterSpacing: "0.14em" }} className="text-[10px] font-bold text-stone-500 uppercase mb-3">Response Time</p>
                <p className="text-white font-bold text-lg leading-snug mb-1">Within 24–48 hours</p>
                <p className="text-stone-400 text-sm leading-relaxed">
                  Our support team is available Monday–Saturday, 10 AM to 6 PM IST.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Connect;
