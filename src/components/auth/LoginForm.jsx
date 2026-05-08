import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import { loginSchema } from "../../utils/validationSchemas";
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({ onToggle }) => {
  const { openAuthModal } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    // Handle login logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {/* Forgot Password Link */}
      <div className="text-right">
        <button
          type="button"
          onClick={() => openAuthModal("forgot")}
          className="text-sm text-gray-600 hover:text-red-600 transition font-medium"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
      >
        Sign In
      </button>

      {/* Toggle to Signup */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="font-semibold text-red-600 hover:text-red-700 transition"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
