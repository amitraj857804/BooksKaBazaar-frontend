import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import AdminLogin from "./AdminLogin";
import AdminRegister from "./AdminRegister";

const AdminAuthModal = () => {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const navigate = useNavigate();
  const location = useLocation();

  // Detect route and set mode accordingly
  useEffect(() => {
    if (location.pathname === "/admin-register") {
      setMode("register");
    } else {
      setMode("login");
    }
  }, [location.pathname]);

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    if (newMode === "register") {
      navigate("/admin-register");
    } else {
      navigate("/admin-login");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
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
            <p className="text-gray-600 text-sm mt-2">Seller Portal</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
            <motion.button
              onClick={() => handleModeSwitch("login")}
              className={`flex-1 py-2 rounded-md font-medium transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogIn size={16} className="inline mr-2" />
              Login
            </motion.button>
            <motion.button
              onClick={() => handleModeSwitch("register")}
              className={`flex-1 py-2 rounded-md font-medium transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus size={16} className="inline mr-2" />
              Register
            </motion.button>
          </div>

          {/* Forms with Animation */}
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AdminLogin isInModal={true} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AdminRegister isInModal={true} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuthModal;
