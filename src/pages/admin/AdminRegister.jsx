import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  AlertCircle,
  CheckCircle,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { adminApi } from "../../services/admin/adminApi";

const AdminRegister = ({ isInModal = false }) => {
  const [formData, setFormData] = useState({
    sellerName: "",
    emailId: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    gstNo: "",
    companyName: "",
    sellingOldBooks: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation rules
  const validateForm = () => {
    if (!formData.sellerName.trim()) {
      setError("Seller name is required");
      return false;
    }

    if (!formData.emailId.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.phoneNumber.match(/^\d{10}$/)) {
      setError("Phone number must be 10 digits");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!formData.gstNo.trim()) {
      setError("GST number is required");
      return false;
    }

    if (!formData.companyName.trim()) {
      setError("Company name is required");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };
  const handleNavigation = (e) => {
    e.preventDefault();
    navigate("/admin-login");
  };
  const handleBackToSeller = (e) => {
    e.preventDefault();
    navigate("/seller")
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      

      const response = await adminApi.register({
        sellerName: formData.sellerName,
        emailId: formData.emailId,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        gstNo: formData.gstNo,
        companyName: formData.companyName,
        sellingOldBooks: formData.sellingOldBooks,
      });


      // Ensure registration completed successfully, then navigate directly
      navigate("/admin/verify-email", {
        state: {
          email: formData.emailId,
          adminId: response.adminId,
        },
      });
    } catch (err) {
      console.error("❌ Registration Error:", {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        data: err.response?.data,
      });
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInModal) {
    // Modal version - no outer wrapper, scrollable form
    return (
      <>
        <style>{`
          .register-form-scroll::-webkit-scrollbar {
            display: none;
          }
          .register-form-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-h-96 overflow-y-auto register-form-scroll"
        >
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Seller Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seller Name *
              </label>
              <input
                type="text"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                placeholder="seller@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="9876543210"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="ABC Book Distributors"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Number *
              </label>
              <input
                type="text"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleInputChange}
                placeholder="07AAAAA1111A1Z1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter strong password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Old Books Checkbox */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="oldBooks"
                name="sellingOldBooks"
                checked={formData.sellingOldBooks}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 rounded cursor-pointer"
              />
              <label
                htmlFor="oldBooks"
                className="text-sm text-gray-700 cursor-pointer"
              >
                I also sell old/used books
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
              >
                <AlertCircle
                  size={18}
                  className="text-red-600 shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </motion.div>
            )}

            {/* Register Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              <UserPlus size={18} />
              {isLoading ? "Registering..." : "Register as Seller"}
            </motion.button>
          </form>
          <div className="justify-center items-center flex mt-3 flex-col">
            <div>
              <span className="text-center text-sm text-gray-600">Already registerd ? {" "}</span>
              <button
                className="font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
                onClick={handleNavigation}
              >
                Login
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
      </>
    );
  }

  
};

export default AdminRegister;
