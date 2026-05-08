import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, CheckCircle, Phone } from "lucide-react";
import { signupSchema } from "../../utils/validationSchemas";

const SignupForm = ({ onToggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data) => {
    console.log("Signup Data:", data);
    // Handle signup logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {/* Email and Phone Row */}
      <div className="grid grid-cols-2 gap-3">
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
              placeholder="Enter your phone"
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
      </div>

      {/* Password and Confirm Password Row */}
      <div className="grid grid-cols-2 gap-3">
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
              placeholder="Confirm your password"
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

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors mt-4"
      >
        Create Account
      </button>

      {/* Toggle to Login */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-semibold text-red-600 hover:text-red-700 transition"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
