import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Store as StoreIcon,
  ChevronRight,
  Package,
  Bike,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    groupedByStore,
    totalItemsCount,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const deliveryFee = cart.length > 0 ? 3000 : 0;
  const grandTotal = cartTotal + deliveryFee;
  const isMultiStore = groupedByStore.length > 1;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200/80 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Drawer */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-brand-orange/10 rounded-xl sm:rounded-2xl text-brand-orange shrink-0">
              <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                Canasta Unificada
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                {totalItemsCount} {totalItemsCount === 1 ? "producto" : "productos"} •{" "}
                {groupedByStore.length} {groupedByStore.length === 1 ? "tienda" : "tiendas"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition"
            aria-label="Cerrar canasta"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificación si hay productos de múltiples tiendas */}
        {isMultiStore && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-2.5 flex items-center gap-2 text-[11px] text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Tienes productos de <strong>{groupedByStore.length} tiendas diferentes</strong>. Se despacharán de forma independiente.
            </span>
          </div>
        )}

        {/* Lista de Productos Agrupados Visualmente por Tienda */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <Package className="w-10 h-10" />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-1">Tu canasta está vacía</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
                Descubre frutas frescas, lácteos y productos esenciales en las tiendas de tu vecindario.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-black px-6 py-3 rounded-full shadow-md shadow-brand-orange/20 transition hover:scale-105 active:scale-95"
              >
                Explorar Catálogo Barrial
              </button>
            </div>
          ) : (
            groupedByStore.map((group) => (
              <div
                key={group.storeId}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3"
              >
                {/* Cabecera de la Tienda Barrial */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <StoreIcon className="w-4 h-4 text-brand-orange shrink-0" />
                    <span className="truncate max-w-[180px]">{group.storeName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                  </div>
                  <span className="text-[11px] font-bold text-brand-emerald bg-brand-emerald/10 px-2.5 py-0.5 rounded-full shrink-0">
                    Subtotal: ${group.subtotal.toLocaleString("es-CO")}
                  </span>
                </div>

                {/* Artículos de esta Tienda */}
                <div className="space-y-2.5">
                  {group.items.map((item) => {
                    const price = Number(item.product.price);
                    const itemSubtotal = price * item.quantity;

                    return (
                      <div
                        key={item.product.id}
                        className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition"
                      >
                        {/* Miniatura del Producto */}
                        <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-100">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Package className="w-6 h-6 text-slate-300" />
                          )}
                        </div>

                        {/* Detalle del Producto */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xs font-black text-brand-orange">
                              ${itemSubtotal.toLocaleString("es-CO")}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              (${price.toLocaleString("es-CO")} c/u)
                            </span>
                          </div>
                        </div>

                        {/* Controles de Cantidad [- qty +] y Eliminar */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-slate-600 active:scale-95 transition"
                              aria-label="Disminuir"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black w-5 text-center text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-slate-600 active:scale-95 transition"
                              aria-label="Aumentar"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition"
                            title="Eliminar producto"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resumen Económico y Botón para Proceder al Pago */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-slate-200 bg-white shadow-lg space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal productos ({totalItemsCount}):</span>
                <span className="font-extrabold text-slate-900">
                  ${cartTotal.toLocaleString("es-CO")}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-brand-emerald" />
                  Envío barrial express:
                </span>
                <span className="font-extrabold text-brand-emerald">$3.000</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2.5 sm:pt-3 border-t border-slate-100">
                <span>Total a Pagar:</span>
                <span className="text-brand-orange text-lg sm:text-xl font-black">
                  ${grandTotal.toLocaleString("es-CO")}
                </span>
              </div>
            </div>

            {/* CTA Verde Esmeralda para Proceder al Pago */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-brand-emerald hover:bg-brand-emerald-dark text-white font-black py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-brand-emerald/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-98"
            >
              <span>Proceder al Pago</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
