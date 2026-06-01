import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogIn, AlertCircle, ArrowLeft, CheckCircle, ExternalLink, X } from "lucide-react";
import { adminApi } from "../../services/admin/adminApi";

const AdminLogin = ({ isInModal = false }) => {
  const [credential, setCredential] = useState(""); // Email or Phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();

  // Determine if input is email or phone
  const isEmail = (input) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };
  const handleNavigation = (e) => {
    e.preventDefault();
    navigate("/admin-register");
  };
  const handleBackToSeller = (e) => {
    e.preventDefault();
    navigate("/seller");
  };

  // State for forgot password modal
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotCredential, setForgotCredential] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);

  // Open the forgot password modal
  const openForgotModal = () => {
    setForgotCredential("");
    setForgotMessage("");
    setIsResetEmailSent(false);
    setShowForgotPasswordModal(true);
  };

  // Close the forgot password modal
  const closeForgotModal = () => {
    setShowForgotPasswordModal(false);
    setForgotCredential("");
    setForgotMessage("");
    setIsResetEmailSent(false);
  };

  // Submit forgot password
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
      setForgotMessage(
        response.message || "Password reset instructions sent successfully.",
      );
      setIsResetEmailSent(true);
    } catch (err) {
      setForgotMessage(
        err.response?.data?.message ||
          "Failed to send reset instructions. Please try again.",
      );
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleResendVerification = async () => {
    if (!isEmail(credential)) {
      setResendMessage(
        "Please enter your email to resend the verification link.",
      );
      return;
    }

    setIsResending(true);
    setResendMessage("");

    try {
      await adminApi.resendVerification(credential);
      setResendMessage(
        "Verification link sent successfully. Please check your email.",
      );
    } catch (err) {
      setResendMessage(
        err.response?.data?.message ||
          "Failed to resend verification link. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!credential || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Determine if it's email or phone and send accordingly
      let response;
      if (isEmail(credential)) {
        response = await adminApi.loginWithEmail(credential, password);
      } else {
        response = await adminApi.login(credential, password);
      }
      // Store token and admin data
      if (response.token) {
        localStorage.setItem("adminToken", response.token);

        // Save the seller name and the email used to login
        const adminData = {
          adminId: response.adminId,
          sellerName: response.sellerName,
          email: isEmail(credential) ? credential : "", // Store email if they used it
        };
        localStorage.setItem("adminData", JSON.stringify(adminData));
        navigate("/admin/dashboard");
      } else {
        console.log(response);
        const errorMsg = response.message || "Login failed";
        console.error("❌ No token in response:", response);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("❌ Admin Login Error:", {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        data: err.response?.data,
        fullError: err,
      });
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Check console for details.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenMail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  if (isInModal) {
    // Modal version - no outer wrapper
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Email or Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email or Phone Number
            </label>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="example@email.com or 8228904121"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter either your email address or phone number
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col items-start gap-2"
            >
              <div className="flex items-start gap-2 w-full">
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
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
                    <p
                      className={`text-xs mt-1 ${resendMessage.includes("success") ? "text-green-600" : "text-red-600"}`}
                    >
                      {resendMessage}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Forgot Password - Centered */}
          <div className="flex justify-center">
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 cursor-pointer bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {isLoading ? "Signing in..." : "Sign In"}
          </motion.button>

          <div className="justify-center items-center flex flex-1 flex-col">
            <div>
              <span className="text-center text-sm text-gray-600">
                New seller ?{" "}
              </span>
              <button
                className="font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
                onClick={handleNavigation}
              >
                Register
              </button>
            </div>
            <button
              className="px-2 bg-white text-gray-500 flex items-center gap-0.5 mt-1.5 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={handleBackToSeller}
            >
              <ArrowLeft size={18} /> Back to seller
            </button>
          </div>
        </motion.div>

        {/* Forgot Password Modal Overlay */}
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
                {/* Close button */}
                <button
                  onClick={closeForgotModal}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                {isResetEmailSent ? (
                  /* ── Success State ── */
                  <div className="flex flex-col items-center text-center space-y-5">
                    {/* Success Icon */}
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-9 h-9 text-green-600" />
                    </div>

                    {/* Success Message */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Check your email
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        We've sent a password reset link to{" "}
                        <span className="font-medium text-gray-900">{forgotCredential}</span>.
                        <br />
                        Please check your inbox and follow the instructions.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-3">
                      {/* Open Mail Button */}
                      <button
                        type="button"
                        onClick={handleOpenMail}
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Mail App
                      </button>

                      {/* Back to Login Button */}
                      <button
                        type="button"
                        onClick={closeForgotModal}
                        className="w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        Back to Login
                      </button>

                      {/* Close Button */}
                      <button
                        type="button"
                        onClick={closeForgotModal}
                        className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Close
                      </button>
                    </div>

                    {/* Hint */}
                    <p className="text-xs text-gray-400">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                  </div>
                ) : (
                  /* ── Enter Email State ── */
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
                      <p
                        className={`text-sm ${forgotMessage.includes("success") ? "text-green-600" : "text-red-600"}`}
                      >
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
  }
};

export default AdminLogin;
