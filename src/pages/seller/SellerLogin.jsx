import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  X,
  ShieldCheck,
  Mail,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { adminApi } from "../../services/admin/adminApi";

/* ─── OTP single-character input box ─── */
const OtpBox = ({ value, inputRef, onChange, onKeyDown, onPaste }) => (
  <input
    ref={inputRef}
    type="text"
    inputMode="numeric"
    maxLength={1}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    onPaste={onPaste}
    className="w-11 h-13 text-center text-xl font-bold border-2 rounded-xl bg-white text-gray-800
      focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200
      transition-all duration-200 caret-transparent"
    style={{ letterSpacing: 0 }}
  />
);

const OTP_LENGTH = 6;

const AdminLogin = ({ isInModal = false }) => {
  /* ── STEP 1 state ── */
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [focusedCredential, setFocusedCredential] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [showPw, setShowPw] = useState(false);

  /* ── STEP 2 state ── */
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // We store plain element refs in an array
  const otpInputRefs = useRef([]);
  if (otpInputRefs.current.length !== OTP_LENGTH) {
    otpInputRefs.current = Array(OTP_LENGTH).fill(null);
  }

  const navigate = useNavigate();

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Auto-focus first OTP box when step 2 mounts
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    }
  }, [step]);

  const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

  const handleNavigation = (e) => {
    e.preventDefault();
    navigate("/admin-register");
  };

  /* ── Forgot password modal state ── */
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotCredential, setForgotCredential] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);

  const openForgotModal = () => {
    setForgotCredential("");
    setForgotMessage("");
    setIsResetEmailSent(false);
    setShowForgotPasswordModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotPasswordModal(false);
    setForgotCredential("");
    setForgotMessage("");
    setIsResetEmailSent(false);
  };

  const handleForgotPasswordSubmit = async () => {
    setForgotMessage("");
    if (!forgotCredential) {
      setForgotMessage("Please enter your email or phone number.");
      return;
    }
    setIsSendingReset(true);
    try {
      const requestBody = isEmail(forgotCredential)
        ? { email: forgotCredential, phoneNumber: null }
        : { email: null, phoneNumber: forgotCredential };
      const response = await adminApi.forgotPassword(requestBody);
      setForgotMessage(response.message || "Password reset instructions sent successfully.");
      setIsResetEmailSent(true);
    } catch (err) {
      setForgotMessage(
        err.response?.data?.message || "Failed to send reset instructions. Please try again."
      );
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleResendVerification = async () => {
    if (!isEmail(credential)) {
      setResendMessage("Please enter your email to resend the verification link.");
      return;
    }
    setIsResending(true);
    setResendMessage("");
    try {
      await adminApi.resendVerification(credential);
      setResendMessage("Verification link sent successfully. Please check your email.");
    } catch (err) {
      setResendMessage(
        err.response?.data?.message || "Failed to resend verification link. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  /* ── STEP 1: Submit credentials → backend sends OTP ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!credential || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      if (isEmail(credential)) {
        await adminApi.loginWithEmail(credential, password);
      } else {
        await adminApi.login(credential, password);
      }
      // Backend sends OTP on success; transition to OTP step
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      setResendCooldown(60);
      setStep(2);
    } catch (err) {
      console.error("Admin Login Error:", err);
      // Some backends return a non-2xx status even when OTP is sent.
      // Detect "otp" / "credentials verified" keywords → go to step 2.
      const errMsg =
        err.response?.data?.message || err.message || "";
      const otpWasSent =
        /otp/i.test(errMsg) ||
        /credentials verified/i.test(errMsg) ||
        /one.time/i.test(errMsg);
      if (otpWasSent) {
        setOtpDigits(Array(OTP_LENGTH).fill(""));
        setOtpError("");
        setResendCooldown(60);
        setStep(2);
        setIsLoading(false);
        return;
      }
      setError(
        errMsg || "Login failed. Check console for details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ── STEP 2: Verify OTP ── */
  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length < OTP_LENGTH) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }
    setOtpError("");
    setIsVerifying(true);

    const emailForOtp = isEmail(credential) ? credential : "";

    try {
      const response = await adminApi.verifyLoginOtp(emailForOtp, otp);

      if (response.token) {
        localStorage.setItem("adminToken", response.token);
        const adminData = {
          adminId: response.sellerId,
          sellerName: response.sellerName,
          email: emailForOtp,
        };
        localStorage.setItem("adminData", JSON.stringify(adminData));
        navigate("/seller/dashboard");
      } else {
        setOtpError(response.message || "OTP verification failed. Please try again.");
      }
    } catch (err) {
      console.error("OTP Verify Error:", err);
      setOtpError(friendlyOtpError(err));
    } finally {
      setIsVerifying(false);
    }
  };

  /* ── Maps raw backend errors to user-friendly messages ── */
  const friendlyOtpError = (err) => {
    const raw = (err.response?.data?.message || err.message || "").toLowerCase();
    if (/rate.limit|too many|limit exceeded/i.test(raw))
      return "You've requested too many OTPs. Please wait a few minutes before trying again.";
    if (/expired/i.test(raw))
      return "Your OTP has expired. Please go back and log in again to get a new one.";
    if (/invalid|incorrect|wrong/i.test(raw))
      return "Incorrect OTP. Please double-check and try again.";
    if (/not found|no.*otp/i.test(raw))
      return "No active OTP found. Please go back and request a new one.";
    return "Something went wrong. Please try again.";
  };

  /* ── Resend OTP ── */
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResendingOtp) return;
    setIsResendingOtp(true);
    setOtpError("");
    try {
      if (isEmail(credential)) {
        await adminApi.loginWithEmail(credential, password);
      } else {
        await adminApi.login(credential, password);
      }
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setResendCooldown(60);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setOtpError(friendlyOtpError(err));
    } finally {
      setIsResendingOtp(false);
    }
  };

  /* ── OTP input handlers ── */
  const handleOtpChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    const newDigits = [...otpDigits];
    newDigits[index] = val[val.length - 1];
    setOtpDigits(newDigits);
    setOtpError("");
    if (index < OTP_LENGTH - 1) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newDigits = [...otpDigits];
      if (newDigits[index]) {
        newDigits[index] = "";
        setOtpDigits(newDigits);
      } else if (index > 0) {
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "Enter") {
      handleVerifyOtp();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newDigits = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { newDigits[i] = ch; });
    setOtpDigits(newDigits);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    otpInputRefs.current[focusIdx]?.focus();
  };

  const handleOpenMail = () => window.open("https://mail.google.com", "_blank");

  if (!isInModal) return null;

  const credActive = focusedCredential || credential.length > 0;
  const pwActive = focusedPassword || password.length > 0;

  return (
    <>
      <AnimatePresence mode="wait">

        {/* ══════════ STEP 1 – CREDENTIALS ══════════ */}
        {step === 1 && (
          <motion.div
            key="step-credentials"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.26 }}
            className="space-y-5"
          >
            {/* Email / Phone floating label */}
            <div>
              <div className="relative">
                <input
                  id="login-credential"
                  type="text"
                  value={credential}
                  onChange={(e) => { setCredential(e.target.value); setError(""); }}
                  onFocus={() => setFocusedCredential(true)}
                  onBlur={() => setFocusedCredential(false)}
                  autoComplete="off"
                  className={[
                    "w-full px-4 pt-5 pb-2 border rounded-lg bg-white text-sm text-gray-800",
                    "focus:outline-none transition-all duration-200",
                    focusedCredential
                      ? "border-red-500 ring-1 ring-red-400/25 shadow-sm"
                      : "border-gray-200 hover:border-gray-300",
                  ].join(" ")}
                />
                <label
                  htmlFor="login-credential"
                  className={[
                    "absolute left-3.5 pointer-events-none select-none transition-all duration-200 origin-left",
                    credActive
                      ? "-top-2 text-[10px] font-bold tracking-widest uppercase px-1 bg-white"
                      : "top-3.5 text-sm",
                    credActive
                      ? focusedCredential ? "text-red-600" : "text-gray-500"
                      : "text-gray-400",
                  ].join(" ")}
                >
                  Email or Phone Number <span className="text-red-500">*</span>
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Enter your registered email or mobile number</p>
            </div>

            {/* Password floating label */}
            <div className="relative">
              <input
                id="login-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onFocus={() => setFocusedPassword(true)}
                onBlur={() => setFocusedPassword(false)}
                autoComplete="current-password"
                className={[
                  "w-full px-4 pt-5 pb-2 pr-10 border rounded-lg bg-white text-sm text-gray-800",
                  "focus:outline-none transition-all duration-200",
                  focusedPassword
                    ? "border-red-500 ring-1 ring-red-400/25 shadow-sm"
                    : "border-gray-200 hover:border-gray-300",
                ].join(" ")}
              />
              <label
                htmlFor="login-password"
                className={[
                  "absolute left-3.5 pointer-events-none select-none transition-all duration-200 origin-left",
                  pwActive
                    ? "-top-2 text-[10px] font-bold tracking-widest uppercase px-1 bg-white"
                    : "top-3.5 text-sm",
                  pwActive
                    ? focusedPassword ? "text-red-600" : "text-gray-500"
                    : "text-gray-400",
                ].join(" ")}
              >
                Password <span className="text-red-500">*</span>
              </label>
              
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col items-start gap-2"
                >
                  <div className="flex items-start gap-2 w-full">
                    <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                  {error.includes("not verified") && (
                    <div className="w-full mt-2 pt-2 border-t border-red-200">
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="text-xs font-semibold cursor-pointer text-red-700 hover:text-red-800 transition disabled:opacity-50"
                      >
                        {isResending ? "Sending..." : "Resend Verification Link"}
                      </button>
                      {resendMessage && (
                        <p className={`text-xs mt-1 ${resendMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                          {resendMessage}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forgot Password */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={openForgotModal}
                className="text-sm font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              onClick={handleLogin}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.99 }}
              className="w-full py-3.5 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold text-sm hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending OTP…
                </>
              ) : (
                <><LogIn size={16} /> Login</>
              )}
            </motion.button>

            {/* Footer links */}
            <div className="flex flex-col items-center gap-1.5 pt-1">
              <p className="text-sm text-gray-500">
                New seller?{" "}
                <button
                  className="font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
                  onClick={handleNavigation}
                >
                  Register
                </button>
              </p>
            </div>

            {/* Security note */}
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} className="text-green-500" />
              Your credentials are encrypted end-to-end
            </p>
          </motion.div>
        )}

        {/* ══════════ STEP 2 – OTP VERIFICATION ══════════ */}
        {step === 2 && (
          <motion.div
            key="step-otp"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.26 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
                <Mail size={26} className="text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Verify your identity</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                We sent a 6-digit OTP to<br />
                <span className="font-semibold text-gray-700">
                  {isEmail(credential) ? credential : "your registered email"}
                </span>
              </p>
            </div>

            {/* OTP input boxes */}
            <div className="flex justify-center gap-2.5" id="otp-input-row">
              {otpDigits.map((digit, i) => (
                <OtpBox
                  key={i}
                  value={digit}
                  inputRef={(el) => { otpInputRefs.current[i] = el; }}
                  onChange={(e) => handleOtpChange(i, e)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={handleOtpPaste}
                />
              ))}
            </div>

            {/* OTP Error */}
            <AnimatePresence>
              {otpError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <AlertCircle size={15} className="text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{otpError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verify Button */}
            <motion.button
              id="verify-otp-btn"
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifying || otpDigits.join("").length < OTP_LENGTH}
              whileHover={{ scale: isVerifying ? 1 : 1.01 }}
              whileTap={{ scale: isVerifying ? 1 : 0.99 }}
              className="w-full py-3.5 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold text-sm hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying…
                </>
              ) : (
                <><KeyRound size={16} /> Verify OTP</>
              )}
            </motion.button>

            {/* Resend OTP + Back */}
            <div className="flex flex-col items-center gap-3 pt-1">
              <button
                type="button"
                id="resend-otp-btn"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isResendingOtp}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isResendingOtp ? (
                  <><RefreshCw size={14} className="animate-spin" /> Resending…</>
                ) : resendCooldown > 0 ? (
                  <span className="text-gray-400 font-normal">Resend OTP in {resendCooldown}s</span>
                ) : (
                  <><RefreshCw size={14} /> Resend OTP</>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); setError(""); setOtpDigits(Array(OTP_LENGTH).fill("")); }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to login
              </button>
            </div>

            {/* Security note */}
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} className="text-green-500" />
              OTP expires in 10 minutes
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════ Forgot Password Modal Overlay ══════ */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={closeForgotModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeForgotModal}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {isResetEmailSent ? (
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-9 h-9 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Check your email</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We've sent a password reset link to{" "}
                      <span className="font-medium text-gray-900">{forgotCredential}</span>.
                      <br />
                      Please check your inbox and follow the instructions.
                    </p>
                  </div>
                  <div className="w-full space-y-3">
                    <button
                      type="button"
                      onClick={handleOpenMail}
                      className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> Open Mail App
                    </button>
                    <button
                      type="button"
                      onClick={closeForgotModal}
                      className="w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" /> Back to Login
                    </button>
                    <button
                      type="button"
                      onClick={closeForgotModal}
                      className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Close
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Reset Password</h2>
                    <p className="text-sm text-gray-600">
                      Enter your email or phone number and we'll send you instructions to reset your password.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email or Phone Number
                    </label>
                    <input
                      type="text"
                      value={forgotCredential}
                      onChange={(e) => setForgotCredential(e.target.value)}
                      placeholder="Enter your email or phone number"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-all text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleForgotPasswordSubmit()}
                    />
                  </div>
                  {forgotMessage && (
                    <p className={`text-sm ${forgotMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                      {forgotMessage}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleForgotPasswordSubmit}
                    disabled={isSendingReset}
                    className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSendingReset ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:text-gray-800 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Login</span>
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminLogin;
