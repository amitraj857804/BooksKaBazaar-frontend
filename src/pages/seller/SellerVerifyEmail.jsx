import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
    Mail, Clock, ArrowRight, CheckCircle2, ShieldCheck,
    Store, RefreshCw, LogIn, BookOpen,
} from "lucide-react";
import { adminApi } from "../../services/admin/adminApi";
import SellerNavbar from "./SellerNavbar";
import SellerFooter from "./SellerFooter";

/* ── Journey steps shown in the left panel ── */
const JOURNEY_STEPS = [
    { icon: CheckCircle2, label: "Account Created", done: true },
    { icon: Mail, label: "Verify Email", done: false },
    { icon: ShieldCheck, label: "Admin Approval", done: false },
    { icon: Store, label: "Start Selling", done: false },
];

const AdminVerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(false);
    const [resendStatus, setResendStatus] = useState({ message: "", type: "" });

    const email = location.state?.email || localStorage.getItem("adminEmail");
    const adminId = location.state?.adminId || localStorage.getItem("adminId");

    useEffect(() => {
        if (email) localStorage.setItem("adminEmail", email);
        if (adminId) localStorage.setItem("adminId", adminId);
    }, [email, adminId]);

    const handleResendEmail = async () => {
        if (!email) return;
        setIsChecking(true);
        setResendStatus({ message: "", type: "" });
        try {
            await adminApi.resendVerificationEmail(email);
            setResendStatus({ message: "Verification email resent! Please check your inbox.", type: "success" });
        } catch (err) {
            setResendStatus({ message: err.response?.data?.message || "Failed to resend email", type: "error" });
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "#fafafa" }}>
            <SellerNavbar />

            <style>{`
                @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 70%{transform:scale(1.6);opacity:0} 100%{transform:scale(1.6);opacity:0} }
                .float-slow { animation: floatY 4s ease-in-out infinite; }
                .pulse-ring::after { content:''; position:absolute; inset:0; border-radius:9999px; border:2px solid rgba(220,38,38,0.4); animation: pulse-ring 2s ease-out infinite; }
            `}</style>

            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full opacity-40"
                    style={{ background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 65%)" }} />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-40"
                    style={{ background: "radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 65%)" }} />
            </div>

            {/* Centred card */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 32, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-4xl flex rounded-3xl overflow-hidden"
                    style={{ boxShadow: "0 32px 80px -16px rgba(220,38,38,0.12), 0 0 0 1px rgba(0,0,0,0.04)" }}
                >

                    {/* ══════ LEFT BRAND PANEL ══════ */}
                    <div
                        className="hidden lg:flex flex-col w-[340px] shrink-0 relative overflow-hidden p-10"
                        style={{ background: "linear-gradient(145deg, #dc2626 0%, #b91c1c 45%, #7f1d1d 100%)" }}
                    >
                        {/* Blobs */}
                        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
                        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-black/10" />
                        {/* Dot grid */}
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

                        <div className="flex justify-center mb-2">
                            <Link
                                to="/seller"
                                className="shrink-0 font-black border-1 border-white/40 shadow-lg p-2 rounded-full sm:text-2xl text-lg tracking-tighter cursor-pointer select-none flex items-center gap-1 justify-start lg:justify-start flex-1 lg:flex-initial"
                            >
                                <img
                                    src="/favicon no bg.png"
                                    alt="Books Ka Bazaar"
                                    className="h-16 w-auto object-contain"
                                />
                            </Link>
                        </div>

                        {/* Panel heading */}
                        <div className="relative z-10 mb-8">
                            <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                                <span className="text-white/80 text-xs font-semibold tracking-wide">Application Received</span>
                            </div>
                            <h2 className="text-white font-extrabold text-2xl leading-tight mb-2">
                                Almost There!<br />
                                <span className="text-red-200">2 steps left</span>
                            </h2>
                            <p className="text-white/65 text-sm leading-relaxed">
                                Complete email verification and wait for admin approval to start selling.
                            </p>
                        </div>

                        {/* Journey steps */}
                        <div className="relative z-10 flex flex-col gap-0 mb-8">
                            {JOURNEY_STEPS.map((step, i) => {
                                const Icon = step.icon;
                                const isLast = i === JOURNEY_STEPS.length - 1;
                                return (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="flex flex-col items-center">
                                            <motion.div
                                                initial={{ scale: 0.7, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: i * 0.12 }}
                                                className={`relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done
                                                        ? "bg-green-400 border-2 border-green-300"
                                                        : i === 1
                                                            ? "bg-white/20 border-2 border-white/60 pulse-ring"
                                                            : "bg-white/10 border-2 border-white/25"
                                                    }`}
                                            >
                                                <Icon size={14} className={step.done ? "text-white" : i === 1 ? "text-white" : "text-white/50"} />
                                            </motion.div>
                                            {!isLast && <div className={`w-px h-8 mt-1 ${step.done ? "bg-green-400/60" : "bg-white/20"}`} />}
                                        </div>
                                        <div className="pt-1 pb-8">
                                            <p className={`text-sm font-semibold leading-none ${step.done ? "text-green-300" : i === 1 ? "text-white" : "text-white/45"}`}>
                                                {step.label}
                                            </p>
                                            {i === 1 && (
                                                <p className="text-white/55 text-[11px] mt-1">Check your inbox & click the link</p>
                                            )}
                                            {i === 2 && (
                                                <p className="text-white/45 text-[11px] mt-1">Typically takes 1–2 business days</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Trust note */}
                        <div className="relative z-10 mt-auto">
                            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck size={14} className="text-green-300" />
                                    <span className="text-white/80 text-xs font-semibold">Your data is secure</span>
                                </div>
                                <p className="text-white/55 text-xs leading-relaxed">
                                    256-bit SSL encryption. We never share your information without consent.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ══════ RIGHT CONTENT PANEL ══════ */}
                    <div className="flex-1 bg-white flex flex-col">
                        <div className="flex-1 px-7 sm:px-10 py-10">

                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="mb-8"
                            >


                                {/* Animated envelope icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="relative float-slow">
                                        <div className="w-20 h-20 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-center shadow-lg shadow-red-100/50">
                                            <Mail size={36} className="text-red-500" />
                                        </div>
                                        {/* Green check badge */}
                                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow">
                                            <CheckCircle2 size={13} className="text-white" fill="white" />
                                        </div>
                                    </div>
                                </div>

                                <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-1">
                                    Check Your Inbox
                                </h1>
                                <p className="text-sm text-gray-500 text-center">
                                    We've sent a verification link to
                                </p>
                                {email && (
                                    <div className="flex justify-center mt-2">
                                        <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                                            <Mail size={13} />
                                            {email}
                                        </span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Status cards */}
                            <div className="space-y-3 mb-8">
                                {/* Email status */}
                                <motion.div
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="flex items-start gap-4 p-4 rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50"
                                >
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail size={18} className="text-orange-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-semibold text-gray-800 text-sm">Email Verification Pending</h3>
                                            <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">STEP 1</span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Click the link in your email to activate your account.
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Admin approval status */}
                                <motion.div
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="flex items-start gap-4 p-4 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                        <Clock size={18} className="text-blue-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-semibold text-gray-800 text-sm">Awaiting Admin Approval</h3>
                                            <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">STEP 2</span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Our team reviews your application. This usually takes 1–2 business days.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                {/* Resend button */}
                                <motion.button
                                    whileHover={{ scale: 1.01, boxShadow: "0 8px 24px -6px rgba(220,38,38,0.35)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleResendEmail}
                                    disabled={isChecking}
                                    className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md shadow-red-100 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <RefreshCw size={15} className={isChecking ? "animate-spin" : ""} />
                                    {isChecking ? "Sending…" : "Resend Verification Email"}
                                </motion.button>

                                {/* Status message */}
                                <AnimatePresence>
                                    {resendStatus.message && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border ${resendStatus.type === "success"
                                                    ? "bg-green-50 border-green-200 text-green-700"
                                                    : "bg-red-50 border-red-200 text-red-700"
                                                }`}
                                        >
                                            {resendStatus.type === "success"
                                                ? <CheckCircle2 size={14} />
                                                : <Mail size={14} />
                                            }
                                            {resendStatus.message}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Proceed to login */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/seller-login")}
                                    className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-600 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                                >

                                    Proceed to Login
                                    <ArrowRight size={14} />
                                </motion.button>
                            </div>

                        </div>

                        {/* Bottom tip strip */}
                        <div className="border-t border-gray-100 px-8 py-3 flex items-center justify-center gap-1.5 bg-gray-50/60">
                            <Mail size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-400">
                                Can't find the email? Check your spam or promotions folder.
                            </span>
                        </div>
                    </div>

                </motion.div>
            </div>

            <SellerFooter />
        </div>
    );
};

export default AdminVerifyEmail;
