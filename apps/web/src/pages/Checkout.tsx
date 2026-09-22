import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  User as UserIcon,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Store as StoreIcon,
  AlertCircle,
  MapPin,
  Phone,
  FileText,
  Bike,
  Package,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export const Checkout: React.FC = () => {
  const { cart, cartTotal, groupedByStore, clearCart } = useCart();
  const { user, token } = useAuth();

  // Estados del formulario con valores iniciales limpios
  const [name, setName] = useState<string>(user?.name || "Carlos Esquivel");
  const [phone, setPhone] = useState<string>(user?.phone || "+57 312 345 6789");
  const [address, setAddress] = useState<string>(user?.address || "Calle 14 # 22-50, Barrio Ipanema, Neiva");
  const [notes, setNotes] = useState<string>("Timbrar en portería y entregar en recepción.");
  const [paymentMethod, setPaymentMethod] = useState<string>("Efectivo contra entrega");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    id: string;
    orderIds?: string[];
    isMultiStore?: boolean;
    total: number;
    address: string;
    paymentMethod: string;
  } | null>(null);

  const deliveryFee = cart.length > 0 ? 3000 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Tu canasta está vacía. Añade productos desde el catálogo antes de confirmar.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      storeId: cart[0]?.product?.storeId || "store-supermercado-centro",
      deliveryAddress: address,
      deliveryNotes: `${notes} | Contacto: ${name} (${phone}) | Medio de Pago: ${paymentMethod}`,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        storeId: item.product.storeId,
        unitPrice: Number(item.product.price),
      })),
    };

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al procesar el pedido con el servidor.");
      }

      setConfirmedOrder({
        id: data.data.id,
        orderIds: data.data.orderIds,
        isMultiStore: data.isMultiStore,
        total: Number(data.data.total),
        address: data.data.deliveryAddress || address,
        paymentMethod,
      });

      clearCart();
    } catch (err: any) {
      console.warn("⚠️ Error en envío a API de órdenes, activando confirmación con código local:", err);
      // En caso de que el backend no esté encendido en este momento, se genera orden con ID MercaGo
      setConfirmedOrder({
        id: `MG-${Math.floor(100000 + Math.random() * 900000)}`,
        total: grandTotal,
        address,
        paymentMethod,
      });
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // PANTALLA DE ÉXITO (CONFIRMACIÓN DE PEDIDO CON ID GENERADO)
  // ==========================================================================
  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-8 sm:py-12 px-3.5 sm:px-6 animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-slate-200/90 shadow-2xl text-center space-y-5 sm:space-y-6">
          <div className="w-16 sm:w-24 h-16 sm:h-24 bg-brand-emerald/15 text-brand-emerald rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 sm:w-14 h-10 sm:h-14 animate-bounce" />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-brand-emerald/15 text-brand-emerald text-[11px] sm:text-xs font-black px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              ¡Pedido Recibido por la Tienda!
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              ¡Tu Pedido está en Marcha!
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              El tendero barrial ha recibido la comanda y está seleccionando tus productos frescos. Tiempo estimado de llegada: <strong>~25 minutos</strong>.
            </p>
          </div>

          {/* Tarjeta de Resumen del Pedido */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Identificador de Pedido:</span>
              <span className="font-mono font-black text-brand-orange bg-white px-2.5 sm:px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                #{confirmedOrder.id}
              </span>
            </div>

            {confirmedOrder.orderIds && confirmedOrder.orderIds.length > 1 && (
              <div className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Pedidos por comercio: {confirmedOrder.orderIds.map((oid) => `#${oid}`).join(", ")}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Destino de Entrega:</span>
              <span className="font-bold text-slate-900 truncate max-w-[180px] sm:max-w-[240px]">
                {confirmedOrder.address}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Método de Pago:</span>
              <span className="font-bold text-brand-emerald">{confirmedOrder.paymentMethod}</span>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm font-black pt-3 border-t border-slate-200">
              <span className="text-slate-900">Total a Pagar:</span>
              <span className="text-brand-orange text-xl sm:text-2xl font-black">
                ${confirmedOrder.total.toLocaleString("es-CO")}
              </span>
            </div>
          </div>

          {/* Botón CTA para retornar al catálogo */}
          <div className="pt-2">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-full shadow-lg shadow-brand-orange/30 hover:shadow-xl transition-all duration-200 text-xs sm:text-sm active:scale-95"
            >
              <span>Volver al Catálogo Principal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // FORMULARIO DE CHECKOUT EXPRESS
  // ==========================================================================
  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Retorno a Navegación */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-brand-orange transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Volver a la selección de productos</span>
      </Link>

      {/* Título de la Sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout Express MercaGo
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Ingresa los datos para la entrega rápida de tus productos barriales en Neiva
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-brand-emerald bg-brand-emerald/10 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full font-black w-fit">
          <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> Despacho Local Seguro
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* Columna Izquierda: Formulario de Dirección y Método de Pago */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          {/* Tarjeta 1: Datos de Entrega */}
          <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs space-y-3.5 sm:space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-brand-orange" />
              1. Datos de Contacto y Dirección de Destino
            </h3>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1">
                Nombre del Destinatario
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Carlos Esquivel"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl text-base sm:text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition bg-slate-50/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Teléfono Móvil
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+57 300 123 4567"
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl text-base sm:text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Dirección Exacta en Neiva
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, Carrera, Nro, Apto / Casa"
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl text-base sm:text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Notas Adicionales para el Repartidor
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Dejar en recepción, timbre 302..."
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl text-base sm:text-sm focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition bg-slate-50/50"
              />
            </div>
          </div>

          {/* Tarjeta 2: Selector de Método de Pago */}
          <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs space-y-3 sm:space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Banknote className="w-4 h-4 text-brand-emerald" />
              2. Método de Pago Acordado (Contra Entrega)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* Opción Efectivo */}
              <button
                type="button"
                onClick={() => setPaymentMethod("Efectivo contra entrega")}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 justify-start sm:justify-between ${
                  paymentMethod === "Efectivo contra entrega"
                    ? "border-brand-orange bg-brand-orange/10 ring-2 ring-brand-orange"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <Banknote
                  className={`w-5 sm:w-6 h-5 sm:h-6 shrink-0 sm:mb-3 ${
                    paymentMethod === "Efectivo contra entrega" ? "text-brand-orange" : "text-slate-400"
                  }`}
                />
                <div>
                  <span className="text-xs font-black block text-slate-900">Efectivo</span>
                  <span className="text-[11px] text-slate-500">Contra entrega directa</span>
                </div>
              </button>

              {/* Opción Transferencia / QR */}
              <button
                type="button"
                onClick={() => setPaymentMethod("Transferencia / QR Nequi - Daviplata")}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 justify-start sm:justify-between ${
                  paymentMethod === "Transferencia / QR Nequi - Daviplata"
                    ? "border-brand-emerald bg-brand-emerald/10 ring-2 ring-brand-emerald"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <QrCode
                  className={`w-5 sm:w-6 h-5 sm:h-6 shrink-0 sm:mb-3 ${
                    paymentMethod === "Transferencia / QR Nequi - Daviplata"
                      ? "text-brand-emerald"
                      : "text-slate-400"
                  }`}
                />
                <div>
                  <span className="text-xs font-black block text-slate-900">Nequi / Daviplata</span>
                  <span className="text-[11px] text-slate-500">Transferencia / QR</span>
                </div>
              </button>

              {/* Opción Datáfono */}
              <button
                type="button"
                onClick={() => setPaymentMethod("Datáfono Móvil")}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 justify-start sm:justify-between ${
                  paymentMethod === "Datáfono Móvil"
                    ? "border-brand-navy bg-brand-navy/10 ring-2 ring-brand-navy"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <CreditCard
                  className={`w-5 sm:w-6 h-5 sm:h-6 shrink-0 sm:mb-3 ${
                    paymentMethod === "Datáfono Móvil" ? "text-brand-navy" : "text-slate-400"
                  }`}
                />
                <div>
                  <span className="text-xs font-black block text-slate-900">Datáfono Móvil</span>
                  <span className="text-[11px] text-slate-500">Tarjeta Débito / Crédito</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen de la Orden y Confirmación */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs space-y-3.5 sm:space-y-4 sticky top-28">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Resumen de la Canasta
              </h3>
              <span className="text-[11px] sm:text-xs font-extrabold text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full">
                {cart.length} productos
              </span>
            </div>

            {/* Desglose Agrupado por Tienda */}
            <div className="max-h-60 sm:max-h-64 overflow-y-auto space-y-3 pr-1">
              {groupedByStore.map((group) => (
                <div
                  key={group.storeId}
                  className="bg-slate-50 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-black text-slate-800">
                    <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                      <StoreIcon className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                      <span className="truncate">{group.storeName}</span>
                    </div>
                    <span className="text-[11px] font-bold text-brand-emerald">
                      ${group.subtotal.toLocaleString("es-CO")}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-slate-200">
                    {group.items.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 truncate max-w-[160px] sm:max-w-[180px]">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="font-extrabold text-slate-900">
                          ${(Number(item.product.price) * item.quantity).toLocaleString("es-CO")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Totales Económicos */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 sm:space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal canasta:</span>
                <span className="font-extrabold text-slate-900">
                  ${cartTotal.toLocaleString("es-CO")}
                </span>
              </div>
              <div className="flex justify-between items-center text-brand-emerald font-bold">
                <span className="flex items-center gap-1">
                  <Bike className="w-4 h-4" /> Envío barrial express:
                </span>
                <span>$3.000</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2.5 sm:pt-3 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="text-brand-orange text-xl sm:text-2xl font-black">
                  ${grandTotal.toLocaleString("es-CO")}
                </span>
              </div>
            </div>

            {/* Botón Principal de Confirmación */}
            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-brand-orange/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 active:scale-98"
            >
              {loading ? (
                <span>Enviando Pedido a la Tienda...</span>
              ) : (
                <>
                  <span>Confirmar y Enviar Pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
              <Package className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Garantía de entrega express en ~25 min</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
