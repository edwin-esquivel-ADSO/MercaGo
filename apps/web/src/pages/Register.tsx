import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User as UserIcon, Phone, MapPin, Store as StoreIcon, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"CLIENTE" | "TENDERO">("CLIENTE");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, phone, address }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al procesar el registro.");
      }

      login(data.token, data.user);
      navigate("/");
    } catch (err: any) {
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        login("mock-jwt-token-register", {
          id: `usr-${Date.now()}`,
          name,
          email,
          role,
          phone,
          address,
        });
        navigate("/");
      } else {
        setError(err.message || "Ocurrió un error inesperado al registrar el usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <img
              src="/mercago_logo_oficial.png"
              alt="MercaGo Logo"
              className="h-12 w-auto mx-auto object-contain"
            />
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Crear Cuenta en MercaGo
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Únete a la red barrial de abastecimiento digital
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Selector de Rol */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole("CLIENTE")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === "CLIENTE"
                ? "bg-white text-brand-orange shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Soy Comprador
          </button>
          <button
            type="button"
            onClick={() => setRole("TENDERO")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === "TENDERO"
                ? "bg-white text-brand-emerald shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <StoreIcon className="w-4 h-4" />
            Tengo una Tienda
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nombre Completo
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Carlos Esquivel"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@mercago.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 carácteres"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Teléfono de Contacto
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="310 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Dirección Principal
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle 45 # 12-34, Apto 302"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-emerald hover:bg-brand-emerald-dark text-white font-black py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
          >
            {loading ? "Creando Cuenta..." : "Completar Registro"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            ¿Ya tienes una cuenta registrada?{" "}
            <Link to="/login" className="font-bold text-brand-orange hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
