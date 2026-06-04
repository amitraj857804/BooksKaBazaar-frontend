import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, AlertCircle, Loader2 } from "lucide-react";
import { loginSchema } from "../../utils/validationSchemas";
import { useAuth } from "../../context/AuthContext";
import { userApi } from "../../services/user/userApi";

const LoginForm = ({ onToggle }) => {
  const { openAuthModal, loginUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const identifierValue = watch("identifier", "");
  const showPhoneIcon = /^\d+$/.test(identifierValue);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await userApi.login(data.identifier, data.password);
      if (response.token) {
        const userData = response.user || {
          fullName: response.fullName || "User",
          email: response.emailId || response.email || "",
          phone: response.phoneNumber || response.phone || "",
        };
        loginUser(userData, response.token);
      } else {
        setError(response.message || "Invalid server response.");
      }
    } catch (err) {
      console.error("❌ User Login Error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials and try again.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email or Phone Field */}
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
          <span className="text-sm text-red-600 mt-1 block">
            {errors.identifier.message}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg bg-white transition-all focus:outline-none ${
              errors.password ? "border-red-600" : "border-gray-200 focus:border-red-600"
            }`}
          />
        </div>
        {errors.password && (
          <span className="text-sm text-red-600 mt-1 block">{errors.password.message}</span>
        )}
      </div>

      {/* Forgot Password Link - centered between password and submit */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => openAuthModal("forgot")}
          className="text-sm text-gray-600 hover:text-red-600 transition font-medium cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

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
        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {isLoading ? "Signing In..." : "Sign In"}
      </button>

      {/* Toggle to Signup */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
