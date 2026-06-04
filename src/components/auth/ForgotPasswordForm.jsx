import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, ArrowLeft, CheckCircle, ExternalLink, LogIn, X, AlertCircle, Loader2 } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { userApi } from "../../services/user/userApi";

const forgotPasswordSchema = z.object({
  identifier: z.string().refine((val) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = /^\d{10}$/.test(val);
    return isEmail || isPhone;
  }, "Must be a valid email or 10-digit phone number"),
});

const ForgotPasswordForm = ({ onToggle }) => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentIdentifier, setSentIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { closeAuthModal, setAuthMode } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const identifierValue = watch("identifier", "");
  const showPhoneIcon = /^\d+$/.test(identifierValue);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      await userApi.forgotPassword(data.identifier);
      setSentIdentifier(data.identifier);
      setIsEmailSent(true);
    } catch (err) {
      console.error("❌ Forgot Password Error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to send reset instructions. Please try again.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    setAuthMode("login");
  };

  const handleOpenMail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  const isEmailInput = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sentIdentifier);

  // Success state — email has been sent
  if (isEmailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center space-y-5"
      >
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>

        {/* Success Message */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Check your email
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {isEmailInput ? (
              <>
                We've sent a password reset link to{" "}
                <span className="font-medium text-gray-900">{sentIdentifier}</span>.
              </>
            ) : (
              <>
                We've sent a password reset link to the registered email address associated with your phone number{" "}
                <span className="font-medium text-gray-900">{sentIdentifier}</span>.
              </>
            )}
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

          {/* Login Button */}
          <button
            type="button"
            onClick={handleGoToLogin}
            className="w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Back to Login
          </button>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={closeAuthModal}
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
      </motion.div>
    );
  }

  // Default state — enter email/phone form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Identifier Field */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email or Phone Number
        </label>
        <div className="relative">
          {showPhoneIcon ? (
            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 transition-all duration-300" />
          ) : (
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 transition-all duration-300" />
          )}
          <input
            type="text"
            placeholder="example@email.com or 9876543210"
            {...register("identifier")}
            className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg bg-white transition-all focus:outline-none ${
              errors.identifier ? "border-red-600" : "border-gray-200 focus:border-red-600"
            }`}
          />
        </div>
        {errors.identifier && (
          <span className="text-sm text-red-600 mt-1 block">{errors.identifier.message}</span>
        )}
      </div>

      {/* Help Text */}
      <p className="text-sm text-gray-600">
        Enter your email address or phone number and we'll send a password reset link to your email.
      </p>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
        >
          <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>

      {/* Back to Login */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:text-gray-800 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
