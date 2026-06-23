import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Campaigns from "./pages/Campaigns";
import { AuthProvider } from "./context/AuthProvider";
import { AuthContext } from "./context/AuthContext";
import Recommendations from "./pages/Recommendation";
import AdminPanel from "./pages/AdminPanel";
import MarketingPanel from "./pages/MarketingPanel";
import Checkout from "./pages/Checkout";
import BeautyProfile from "./pages/BeautyProfile";

function NavBar() {
  const { user, logout } = useContext(AuthContext);

  if (user?.role === "ADMIN") {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#F0EFEA] sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link
            to="/admin"
            className="text-2xl font-normal tracking-widest text-[#222222] font-serif uppercase group"
          >
            glow<span className="text-[#222222] font-sans font-light">.</span>
          </Link>

          <div className="flex items-center space-x-6 text-[11px] uppercase tracking-widest font-medium text-[#222222]">
            <Link
              to="/admin"
              className="hover:text-[#888888] transition-colors duration-200"
            >
              Admin
            </Link>

            <span className="text-[#EAE9E4] font-light text-sm">|</span>

            <button
              onClick={logout}
              className="text-[11px] uppercase tracking-widest font-bold text-[#E05A47] hover:text-black transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
            >
              Odjavi se
            </button>
          </div>
        </div>
      </nav>
    );
  }

  if (user?.role === "MARKETING_MANAGER") {
    return (
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#F0EFEA] sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link
            to="/marketing"
            className="text-2xl font-normal tracking-widest text-[#222222] font-serif uppercase group"
          >
            glow<span className="text-[#222222] font-sans font-light">.</span>
          </Link>

          <div className="flex items-center space-x-6 text-[11px] uppercase tracking-widest font-medium text-[#222222]">
            <Link
              to="/marketing"
              className="hover:text-[#888888] transition-colors duration-200"
            >
              Marketing
            </Link>

            <span className="text-[#EAE9E4] font-light text-sm">|</span>

            <button
              onClick={logout}
              className="text-[11px] uppercase tracking-widest font-bold text-[#E05A47] hover:text-black transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
            >
              Odjavi se
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-[#F0EFEA] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-normal tracking-widest text-[#222222] font-serif uppercase group"
        >
          glow<span className="text-[#222222] font-sans font-light">.</span>
        </Link>

        <div className="flex items-center space-x-6 lg:space-x-8 text-[11px] uppercase tracking-widest font-medium text-[#222222]">
          <Link
            to="/"
            className="hover:text-[#888888] transition-colors duration-200"
          >
            Katalog
          </Link>
          <Link
            to="/campaigns"
            className="hover:text-[#888888] transition-colors duration-200"
          >
            Kampanje
          </Link>
          <Link
            to="/recommendations"
            className="hover:text-[#888888] transition-colors duration-200"
          >
            Za Vas
          </Link>
          <Link
            to="/cart"
            className="hover:text-[#888888] transition-colors duration-200 relative"
          >
            Korpa
          </Link>
          <Link
            to="/orders"
            className="hover:text-[#888888] transition-colors duration-200"
          >
            Porudžbine
          </Link>
          {user && (
            <Link
              to="/beauty-profile"
              className="hover:text-[#888888] transition-colors duration-200"
            >
              Moj Profil
            </Link>
          )}

          <span className="text-[#EAE9E4] font-light text-sm">|</span>

          {user ? (
            <button
              onClick={logout}
              className="text-[11px] uppercase tracking-widest font-bold text-[#E05A47] hover:text-black transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
            >
              Odjavi se
            </button>
          ) : (
            <Link
              to="/login"
              className="text-[11px] uppercase tracking-widest font-bold text-[#222222] hover:text-[#888888] transition-colors duration-200"
            >
              Nalog
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-[#222222] font-sans antialiased flex flex-col justify-between">
          <div>
            <NavBar />

            <main className="max-w-7xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<Catalog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/marketing" element={<MarketingPanel />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/beauty-profile" element={<BeautyProfile />} />
              </Routes>
            </main>
          </div>

          <footer className="bg-[#222222] text-white py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <span className="text-lg font-normal tracking-widest font-serif uppercase block mb-1">
                  glow.
                </span>
                <p className="text-[10px] text-[#888888] tracking-wider font-light uppercase">
                  © {new Date().getFullYear()} All rights reserved. Designed for
                  minimal luxury.
                </p>
              </div>
              <div className="flex space-x-6 text-[10px] uppercase tracking-widest text-[#BBBBBB] font-light">
                <span className="hover:text-white cursor-pointer transition-colors">
                  Privacy
                </span>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Terms
                </span>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Contact
                </span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}