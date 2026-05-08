import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft } from "lucide-react";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPasswordForm = ({ onToggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data) => {
    console.log("Forgot Password Data:", data);
    // Handle forgot password logic here
  };

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
        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
      >
        Send Reset Link
      </button>

      {/* Back to Login */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:text-gray-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
