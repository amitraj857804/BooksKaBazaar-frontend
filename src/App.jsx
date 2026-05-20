import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import { FlyToCartProvider } from "./context/FlyToCartContext";
import AuthModal from "./components/auth/AuthModal";
import FlyingBook from "./components/animations/FlyingBook";
import store from "./store";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import InventoryWithStats from "./pages/admin/InventoryWithStats";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./components/routing/ProtectedRoute";

// SuperAdmin Pages
import { SuperAdminProvider } from "./context/superadmin/SuperAdminContext";
import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminProtectedRoute from "./components/superadmin/SuperAdminProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <FlyToCartProvider>
        <AuthProvider>
          <SuperAdminProvider>
            <Router>
              <Routes>
                {/* Main User Routes */}
                <Route
                  path="/"
                  element={
                    <>
                      <AuthModal />
                      <FlyingBook />
                      <Home />
                    </>
                  }
                />

                {/* Admin Routes */}
                <Route path="/admin-login" element={<AdminLogin />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <Routes>
                          <Route index element={<Dashboard />} />
                          <Route path="inventory" element={<InventoryPage />} />
                          <Route path="orders" element={<OrdersPage />} />
                          <Route path="settings" element={<SettingsPage />} />
                        </Routes>
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />

                {/* SuperAdmin Routes */}
                <Route path="/superadmin/login" element={<SuperAdminLogin />} />
                <Route
                  path="/superadmin/dashboard"
                  element={
                    <SuperAdminProtectedRoute>
                      <SuperAdminDashboard />
                    </SuperAdminProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </SuperAdminProvider>
        </AuthProvider>
      </FlyToCartProvider>
    </Provider>
  );
}

// Placeholder pages for other admin routes
function InventoryPage() {
  return <InventoryWithStats />;
}

function OrdersPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Orders</h2>
      <p className="text-gray-600">Orders management page (coming soon)</p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
      <p className="text-gray-600">Settings page (coming soon)</p>
    </div>
  );
}

export default App;
