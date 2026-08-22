import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Bestsellers from "./pages/Bestsellers";
import NewArrivals from "./pages/NewArrivals";
import BookDetails from "./pages/BookDetails";
import SearchPage from "./pages/SearchPage";
import ReadingRoom from "./pages/ReadingRoom";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";

// Help & Support Pages
import About from "./pages/help-support/About";
import FAQ from "./pages/help-support/FAQ";
import Connect from "./pages/help-support/Connect";
import Disclaimer from "./pages/help-support/Disclaimer";

// Policy Pages
import TermsConditions from "./pages/policies/TermsConditions";
import TermsOfUse from "./pages/policies/TermsOfUse";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import ReturnsRefunds from "./pages/policies/ReturnsRefunds";
import ShippingPolicy from "./pages/policies/ShippingPolicy";
import SellerTerms from "./pages/policies/SellerTerms";
import DigitalProductsPolicy from "./pages/policies/DigitalProductsPolicy";
import IPPolicy from "./pages/policies/IPPolicy";
import ProhibitedItemsPolicy from "./pages/policies/ProhibitedItemsPolicy";
import CancellationPolicy from "./pages/policies/CancellationPolicy";
import PaymentPolicy from "./pages/policies/PaymentPolicy";
import GrievancePolicy from "./pages/policies/GrievancePolicy";
import ScrollToTop from "./components/common/ScrollToTop";
import SellerLanding from "./pages/seller/SellerLanding";
import { AuthProvider } from "./context/AuthContext";
import { FlyToCartProvider } from "./context/FlyToCartContext";
import AuthModal from "./components/auth/AuthModal";
import FlyingBook from "./components/animations/FlyingBook";
import store from "./store";
import { Toaster } from "react-hot-toast";

//Bookshelf pages
import BookShelf from "./components/Bookshelf/BookShelf";


// Seller Pages
import SellerLayout from "./pages/seller/SellerLayout";
import Dashboard from "./pages/seller/Dashboard";
import InventoryWithStats from "./pages/seller/InventoryWithStats";
import SellerAuthModal from "./pages/seller/SellerAuthModal";
import SellerVerifyEmail from "./pages/seller/SellerVerifyEmail";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
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
            <Toaster position="top-center" reverseOrder={false} />
            <Router>
              <ScrollToTop />
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

                <Route
                  path="/profile"
                  element={
                    <>
                      <AuthModal />
                      <Profile />
                    </>
                  }
                />

                <Route
                  path="/cart"
                  element={
                    <>
                      <AuthModal />
                      <Cart />
                    </>
                  }
                />
                <Route
                  path="/bookshelf"
                  element={
                    <>
                      <AuthModal />
                      <BookShelf />
                    </>
                  }
                />

                <Route
                  path="/wishlist"
                  element={
                    <>
                      <AuthModal />
                      <Wishlist />
                    </>
                  }
                />

                <Route
                  path="/bestsellers"
                  element={
                    <>
                      <AuthModal />
                      <FlyingBook />
                      <Bestsellers />
                    </>
                  }
                />

                <Route
                  path="/new-arrivals"
                  element={
                    <>
                      <AuthModal />
                      <FlyingBook />
                      <NewArrivals />
                    </>
                  }
                />

                <Route
                  path="/book/:bookId"
                  element={
                    <>
                      <AuthModal />
                      <FlyingBook />
                      <BookDetails />
                    </>
                  }
                />

                <Route
                  path="/search"
                  element={
                    <>
                      <AuthModal />
                      <FlyingBook />
                      <SearchPage />
                    </>
                  }
                />

                {/* Reading Room */}
                <Route
                  path="/reading-room"
                  element={
                    <>
                      <AuthModal />
                      <ReadingRoom />
                    </>
                  }
                />
                <Route
                  path="/reading-room/reader/:bookId"
                  element={
                    <>
                      <AuthModal />
                      <ReadingRoom />
                    </>
                  }
                />

                {/* Blog */}
                <Route
                  path="/blogs"
                  element={
                    <>
                      <AuthModal />
                      <Blogs />
                    </>
                  }
                />
                <Route
                  path="/blogs/:postId"
                  element={
                    <>
                      <AuthModal />
                      <BlogPost />
                    </>
                  }
                />

                {/* About Page */}
                <Route
                  path="/about"
                  element={
                    <>
                      <AuthModal />
                      <About />
                    </>
                  }
                />

                <Route path="/faq" element={<><AuthModal /><FAQ /></>} />

                {/* Connect Page */}
                <Route path="/connect" element={<><AuthModal /><Connect /></>} />

                {/* Disclaimer Page */}
                <Route path="/disclaimer" element={<><AuthModal /><Disclaimer /></>} />

                {/* Policy Pages */}
                <Route path="/terms-conditions" element={<><AuthModal /><TermsConditions /></>} />
                <Route path="/terms-of-use" element={<><AuthModal /><TermsOfUse /></>} />
                <Route path="/privacy" element={<><AuthModal /><PrivacyPolicy /></>} />
                <Route path="/returns" element={<><AuthModal /><ReturnsRefunds /></>} />
                <Route path="/shipping" element={<><AuthModal /><ShippingPolicy /></>} />
                <Route path="/seller-terms" element={<><AuthModal /><SellerTerms /></>} />
                <Route path="/digital-products-policy" element={<><AuthModal /><DigitalProductsPolicy /></>} />
                <Route path="/ip-policy" element={<><AuthModal /><IPPolicy /></>} />
                <Route path="/prohibited-items" element={<><AuthModal /><ProhibitedItemsPolicy /></>} />
                <Route path="/cancellation" element={<><AuthModal /><CancellationPolicy /></>} />
                <Route path="/payment-policy" element={<><AuthModal /><PaymentPolicy /></>} />
                <Route path="/grievance" element={<><AuthModal /><GrievancePolicy /></>} />

                {/* Seller/Admin Landing */}
                <Route path="/seller" element={<SellerLanding />} />

                {/* Seller Auth Routes */}
                <Route path="/seller-login"        element={<SellerAuthModal />} />
                <Route path="/seller-register"     element={<SellerAuthModal />} />
                <Route path="/seller/verify-email" element={<SellerVerifyEmail />} />

                {/* Protected Seller/Admin Routes */}
                <Route
                  path="/seller/*"
                  element={
                    <ProtectedRoute>
                    <SellerLayout>
                      <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="inventory" element={<InventoryPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                      </Routes>
                    </SellerLayout>
                    </ProtectedRoute>
                  }
                />

                {/* SuperAdmin Routes */}
                <Route path="/superadmin/login" element={<SuperAdminLogin />} />
                <Route
                  path="/superadmin/*"
                  element={
                    <SuperAdminProtectedRoute>
                      <Routes>
                        <Route path="dashboard" element={<SuperAdminDashboard />} />
                        <Route index element={<SuperAdminDashboard />} />
                      </Routes>
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
  return <SellerOrdersPage />;
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
