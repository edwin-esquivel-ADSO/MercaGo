import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, MapPin, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery = "", setSearchQuery }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setSearchQuery) {
      setSearchQuery(e.target.value);
    } else {
      navigate(`/?q=${encodeURIComponent(e.target.value)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Fila Principal */}
        <div className="h-16 sm:h-20 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Logo Oficial MercaGo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 active:scale-95 transition-transform">
            <img
              src="/mercago_logo_oficial.png"
              alt="MercaGo Logo Oficial"
              className="h-9 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Cobertura Barrial Neiva, Huila (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3.5 py-2 rounded-full border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
            <span>
              Ciudad: <strong className="text-slate-900 font-semibold">Neiva, Huila</strong> • Comunas 1 a 10
            </span>
          </div>

          {/* Barra de Búsqueda (Desktop & Tablet) */}
          <div className="hidden sm:block flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar tiendas, frutas, abarrotes en Neiva..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-slate-50/50"
            />
          </div>

          {/* Acciones de Usuario y Carrito */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Badge Móvil de Ubicación */}
            <div className="flex sm:hidden items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-full border border-slate-200">
              <MapPin className="w-3 h-3 text-brand-orange shrink-0" />
              <span>Neiva</span>
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900">{user.name}</span>
                  <span className="text-[10px] text-brand-emerald font-semibold uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-bold text-slate-700 hover:text-brand-orange px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-slate-100 transition"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="hidden md:inline-flex text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-full transition"
                >
                  Registrarme
                </Link>
              </div>
            )}

            {/* Botón Canasta Unificada */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-brand-orange hover:bg-brand-orange-dark active:scale-95 text-white font-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow transition"
              aria-label="Ver canasta de compras"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold">Canasta</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-emerald text-white text-[10px] sm:text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda Móvil Dedicada (Debajo del Header en celulares) */}
        <div className="sm:hidden pb-3 pt-0.5">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar tiendas, achiras, cholupa..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-full text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition bg-slate-50"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
