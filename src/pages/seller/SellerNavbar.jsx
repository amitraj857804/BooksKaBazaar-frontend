import { useNavigate ,Link } from "react-router-dom";
import { Store, LogIn, UserPlus } from "lucide-react";

const SellerNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/seller")}
          >
            
            <Link
              to="/seller"
              className="shrink-0 font-black sm:text-2xl text-lg tracking-tighter cursor-pointer select-none flex items-center gap-1 justify-start lg:justify-start flex-1 lg:flex-initial"
            >
              <img
                src="/1.1 Primary - BKB Complete Logo PNG without Background SVG File.svg"
                alt="Books Ka Bazaar"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full ml-1 hidden sm:inline">
              SELLER
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer hidden sm:block"
            >
              ← Back to Shop
            </button>
            <button
              onClick={() => navigate("/seller-login")}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 border border-gray-200 hover:border-red-400 hover:text-red-600 px-4 py-2 rounded-lg transition-all cursor-pointer"
            >
              <LogIn size={15} /> Login
            </button>
            <button
              onClick={() => navigate("/seller-register")}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm shadow-red-200"
            >
              <UserPlus size={15} /> Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavbar;
