import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Header } from "./components/Header";
import { CartDrawer } from "./components/CartDrawer";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Checkout } from "./pages/Checkout";

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#F4F6F8] text-[#0A2540] font-sans">
            {/* Cabecera Global con Navegación y Búsqueda */}
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Contenedor de Vistas Principales */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
              <Routes>
                <Route path="/" element={<Home searchQuery={searchQuery} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>

            {/* Drawer Lateral del Carrito Unificado */}
            <CartDrawer />

            {/* Pie de Página Oficial (Footer) */}
            <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="/mercago_logo_oficial.png"
                      alt="MercaGo Logo"
                      className="h-10 w-auto brightness-0 invert opacity-90"
                    />
                    <span className="text-xs text-slate-500">
                      Plataforma Hiperlocal de Abastecimiento Barrial
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
                    <Link to="/" className="hover:text-white transition">Inicio</Link>
                    <Link to="/login" className="hover:text-white transition">Ingreso Tendero</Link>
                    <Link to="/register" className="hover:text-white transition">Registrar Tienda</Link>
                    <Link to="/checkout" className="hover:text-white transition">Canasta Activa</Link>
                  </div>

                  <div className="text-xs text-slate-500 text-center md:text-right">
                    <p>© 2026 MercaGo Inc. Monolith Governance Framework.</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Stack PERN • Neon DB PostgreSQL • Cloudinary Media • Vercel
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
