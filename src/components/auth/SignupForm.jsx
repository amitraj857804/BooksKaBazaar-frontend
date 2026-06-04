import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Mail, Lock, CheckCircle, Phone, Home, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { signupSchema } from "../../utils/validationSchemas";
import { userApi } from "../../services/user/userApi";

const SignupForm = ({ onToggle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      await userApi.register({
        fullName: data.fullName,
        emailId: data.email,
        phoneNumber: data.phone,
        password: data.password,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error("❌ User Registration Error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
        <p className="text-gray-600 mb-6 max-w-sm">
          Your account has been created successfully. You can now log in using your credentials.
        </p>
        <button
          type="button"
          onClick={onToggle}
          className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
        >
          Go to Sign In
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <style>{`
        .signup-form-scroll::-webkit-scrollbar {
          display: none;
        }
        .signup-form-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      
      <div className="max-h-[300px] overflow-y-auto signup-form-scroll pr-1 space-y-4">
        {/* Full Name Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("fullName")}
              className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg bg-white transition-all focus:outline-none ${
                errors.fullName ? "border-red-600" : "border-gray-200 focus:border-red-600"
              }`}
            />
          </div>
          {errors.fullName && (
            <span className="text-sm text-red-600 mt-1 block">{errors.fullName.message}</span>
          )}
        </div>

        {/* Email Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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

        {/* Phone Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              placeholder="Enter your phone number"
              {...register("phone")}
              className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg bg-white transition-all focus:outline-none ${
                errors.phone ? "border-red-600" : "border-gray-200 focus:border-red-600"
              }`}
            />
          </div>
          {errors.phone && (
            <span className="text-sm text-red-600 mt-1 block">{errors.phone.message}</span>
          )}
        </div>

        {/* Address Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <div className="relative">
            <Home className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter your address"
              {...register("address")}
              className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg bg-white transition-all focus:outline-none ${
                errors.address ? "border-red-600" : "border-gray-200 focus:border-red-600"
              }`}
            />
          </div>
          {errors.address && (
            <span className="text-sm text-red-600 mt-1 block">{errors.address.message}</span>
          )}
        </div>

        {/* City, State, Pincode Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* City Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="City"
                {...register("city")}
                className={`w-full pl-8 pr-2 py-2.5 text-sm border-2 rounded-lg bg-white transition-all focus:outline-none ${
                  errors.city ? "border-red-600" : "border-gray-200 focus:border-red-600"
                }`}
              />
            </div>
            {errors.city && (
              <span className="text-xs text-red-600 mt-1 block">{errors.city.message}</span>
            )}
          </div>

          {/* State Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="State"
                {...register("state")}
                className={`w-full pl-8 pr-2 py-2.5 text-sm border-2 rounded-lg bg-white transition-all focus:outline-none ${
                  errors.state ? "border-red-600" : "border-gray-200 focus:border-red-600"
                }`}
              />
            </div>
            {errors.state && (
              <span className="text-xs text-red-600 mt-1 block">{errors.state.message}</span>
            )}
          </div>

          {/* Pincode Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pincode"
                {...register("pincode")}
                className={`w-full pl-8 pr-2 py-2.5 text-sm border-2 rounded-lg bg-white transition-all focus:outline-none ${
                  errors.pincode ? "border-red-600" : "border-gray-200 focus:border-red-600"
                }`}
              />
            </div>
            {errors.pincode && (
              <span className="text-xs text-red-600 mt-1 block">{errors.pincode.message}</span>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Create a password"
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

        {/* Confirm Password Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-lg bg-white transition-all focus:outline-none ${
                errors.confirmPassword ? "border-red-600" : "border-gray-200 focus:border-red-600"
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-sm text-red-600 mt-1 block">{errors.confirmPassword.message}</span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 mt-4"
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
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Toggle to Login */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};




export default SignupForm;
