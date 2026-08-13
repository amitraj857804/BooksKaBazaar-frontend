import { useNavigate ,Link } from "react-router-dom";
import { Store, ShieldCheck } from "lucide-react";

const SellerFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onClick={() => navigate("/seller")}
            >{/* Logo */}
              <div className="mb-2">
                <Link to="/seller" className="inline  w-full lg:-mt-1 -mb-0.5">
                  <img
                    src="/Footer Logo Inverted without BG.png"
                    alt="Books Ka Bazaar"
                    className="w-full object-fit object-left max-h-16"
                  />
                </Link>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's fastest growing online book marketplace for sellers.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-500">
              <ShieldCheck size={12} className="text-green-400" />
              Trusted by 10,000+ sellers
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">About</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About BooksKaBazaar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Seller</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button onClick={() => navigate("/seller-login")} className="hover:text-white transition-colors cursor-pointer">
                  Seller Login
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/seller-register")} className="hover:text-white transition-colors cursor-pointer">
                  Register Now
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/")} className="hover:text-white transition-colors cursor-pointer">
                  Back to Shop
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2025 BooksKaBazaar. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="/terms-conditions" className="hover:text-white transition-colors">Terms</a>
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SellerFooter;
