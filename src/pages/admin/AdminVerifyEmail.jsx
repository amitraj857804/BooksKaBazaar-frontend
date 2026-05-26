import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";
import { adminApi } from "../../services/admin/adminApi";

const AdminVerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [resendStatus, setResendStatus] = useState({ message: "", type: "" });

  const email = location.state?.email || localStorage.getItem("adminEmail");
  const adminId = location.state?.adminId || localStorage.getItem("adminId");

  // Store email and adminId for future reference
  useEffect(() => {
    if (email) localStorage.setItem("adminEmail", email);
    if (adminId) localStorage.setItem("adminId", adminId);
  }, [email, adminId]);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsChecking(true);
    setResendStatus({ message: "", type: "" });
    try {
      console.log("📧 Resending verification email to:", email);
      const response = await adminApi.resendVerificationEmail(email);
      console.log("✅ Email resent:", response);
      setResendStatus({ message: "Verification email resent! Please check your inbox.", type: "success" });
    } catch (err) {
      console.error("❌ Error resending email:", err);
      setResendStatus({ message: err.response?.data?.message || "Failed to resend email", type: "error" });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              Books<span className="text-red-600">KaBazaar</span>
            </h1>
            <p className="text-gray-600 text-sm mt-2">Account Verification</p>
          </div>

          <>
            {/* Email Verification Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg border mb-4 bg-yellow-50 border-yellow-200"
            >
              <div className="flex items-start gap-3">
                <Mail size={24} className="text-yellow-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-yellow-900">
                    Email Verification Pending
                  </h3>
                  <p className="text-sm mt-1 text-yellow-700">
                    We've sent a verification link to {email}. Please click the link in your email to verify your account.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* SuperAdmin Approval Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg border mb-4 bg-blue-50 border-blue-200"
            >
              <div className="flex items-start gap-3">
                <Clock size={24} className="text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900">
                    Awaiting SuperAdmin Approval
                  </h3>
                  <p className="text-sm mt-1 text-blue-700">
                    Your account is currently under review by the superadmin. You will be able to login once approved.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <div className="flex flex-col mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResendEmail}
                  disabled={isChecking}
                  className="w-full py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {isChecking ? "Sending..." : "Resend Verification Email"}
                </motion.button>
                {resendStatus.message && (
                  <p className={`text-sm mt-2 text-center font-medium ${resendStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {resendStatus.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin-login")}
                className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Login
                <ArrowRight size={16} />
              </motion.button>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/seller")}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminVerifyEmail;
                 
           
