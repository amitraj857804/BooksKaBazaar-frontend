import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, openAuthModal } = useAuth();

  // toggleAuthMode function to switch between login and signup
  const toggleAuthMode = () => {
    if (authMode === "login") {
      setAuthMode("signup");
    } else if (authMode === "signup") {
      setAuthMode("login");
    } else if (authMode === "forgot") {
      setAuthMode("login");
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const formVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction === "left" ? 100 : -100,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction === "left" ? -100 : 100,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[9999] backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={closeAuthModal}
        >
          <motion.div
            key="modal"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={closeAuthModal}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeAuthModal}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* Header Section */}
              <div className="px-8 pt-8 pb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {authMode === "login"
                    ? "Welcome Back"
                    : authMode === "signup"
                    ? "Join BooksKaBazaar"
                    : "Reset Password"}
                </h2>
                <p className="text-gray-600">
                  {authMode === "login"
                    ? "Sign in to discover your next favorite book"
                    : authMode === "signup"
                    ? "Create an account and start exploring amazing books"
                    : "Enter your email and we'll send you a link to reset your password"}
                </p>
              </div>

              {/* Forms Container */}
              <div className="px-8 pb-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  {authMode === "login" ? (
                    <motion.div
                      key="login"
                      variants={formVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      custom="left"
                    >
                      <LoginForm onToggle={toggleAuthMode} />
                    </motion.div>
                  ) : authMode === "signup" ? (
                    <motion.div
                      key="signup"
                      variants={formVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      custom="right"
                    >
                      <SignupForm onToggle={toggleAuthMode} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="forgot"
                      variants={formVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      custom="right"
                    >
                      <ForgotPasswordForm onToggle={toggleAuthMode} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider with Text */}
              <div className="px-8 pb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="px-8 pb-8 space-y-3">
                <button className="w-full py-2.5 border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:border-gray-300 transition-colors">
                  Google
                </button>
                
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
