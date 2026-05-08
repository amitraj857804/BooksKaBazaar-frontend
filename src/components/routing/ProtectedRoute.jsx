import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const ProtectedRoute = ({ children, requiredRole = "ADMIN" }) => {
  // Check if user is authenticated and has admin role
  const isAuthenticated = () => {
    const adminToken = localStorage.getItem("adminToken");
    return !!adminToken;
  };

  const getUserRole = () => {
    // In production, this would decode the JWT or get from context
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) return null;
    
    try {
      // Simulating role extraction (in production, decode JWT)
      return "ADMIN";
    } catch {
      return null;
    }
  };

  const userRole = getUserRole();

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin-login" replace />;
  }

  if (userRole !== requiredRole) {
    // Show access denied message
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block p-4 bg-red-100 rounded-full mb-4"
          >
            <AlertCircle className="w-8 h-8 text-red-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <a
            href="/"
            className="inline-block px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </motion.div>
    );
  }

  return children;
};

export default ProtectedRoute;
