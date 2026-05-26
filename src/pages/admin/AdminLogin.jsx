import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogIn, AlertCircle , ArrowLeft} from "lucide-react";
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
  const handleBackToSeller = (e)=> {
    e.preventDefault();
    navigate("/seller");
  }

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
          email: isEmail(credential) ? credential : "" // Store email if they used it
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

  if (isInModal) {
    // Modal version - no outer wrapper
    return (
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
                  <p className={`text-xs mt-1 ${resendMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                    {resendMessage}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Login Button */}
        <motion.button
          type="submit"
          onClick={handleLogin}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 cursor-pointer bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
        >
          <LogIn size={18} />
          {isLoading ? "Signing in..." : "Sign In"}
        </motion.button>
        <div className="justify-center items-center flex flex-1 flex-col">
          <div>
            <span className="text-center text-sm text-gray-600">New seller ? {" "} </span>
            <button className="font-semibold text-red-600 hover:text-red-700 transition cursor-pointer" onClick={handleNavigation}>
              Register
            </button>
          </div>
          <button className="px-2 bg-white text-gray-500 flex items-center gap-0.5 mt-1.5 cursor-pointer hover:text-gray-800 transition-colors" onClick={handleBackToSeller}>
            <ArrowLeft size={18} /> Back to seller
          </button>
        </div>
      </motion.div>
    );
  }
};

export default AdminLogin;
