import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle, ExternalLink, LogIn, X } from "lucide-react";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPasswordForm = ({ onToggle }) => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const { closeAuthModal, setAuthMode } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    console.log("Forgot Password Data:", data);
    // Handle forgot password API call here
    // For now, simulate a short delay then show success
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSentEmail(data.email);
    setIsEmailSent(true);
  };

  const handleGoToLogin = () => {
    setAuthMode("login");
  };

  const handleOpenMail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  // Success state — email has been sent
  if (isEmailSent) {
    return (
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
            <span className="font-medium text-gray-900">{sentEmail}</span>.
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
      </div>
    );
  }

  // Default state — enter email form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg bg-white transition-all focus:outline-none ${
              errors.email ? "border-red-600" : "border-gray-200 focus:border-red-600"
            }`}
          />
        </div>
        {errors.email && (
          <span className="text-sm text-red-600 mt-1 block">{errors.email.message}</span>
        )}
      </div>

      {/* Help Text */}
      <p className="text-sm text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending..." : "Send Reset Link"}
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
