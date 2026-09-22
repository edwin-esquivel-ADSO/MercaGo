import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  Store as StoreIcon,
  ShieldCheck,
  Tag,
  Package,
  Check,
  MapPin,
  Clock,
} from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ProductModalProps {
  product: Product | null;
  isOpen?: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen = true, onClose }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // Reiniciar cantidad cada vez que cambia el producto seleccionado
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [product]);

  if (!product || !isOpen) return null;

  const unitPrice = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : Math.round(unitPrice * 1.18);
  const discountPercentage = product.discountPercentage || Math.round(((originalPrice - unitPrice) / originalPrice) * 100);
  const storeName = product.store?.name || "Supermercado Centro";
  const storeAddress = product.store?.address || "Carrera 15 # 45-20, Chapinero Central";

  const handleIncrement = () => {
    if (quantity < (product.stock || 99)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
      setIsCartOpen(true);
    }, 500);
  };

  const totalPrice = unitPrice * quantity;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative border border-slate-200/80 flex flex-col max-h-[92vh] sm:max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de Cierre Superior */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 p-2 sm:p-2.5 rounded-full shadow-md transition-all duration-200 hover:scale-105"
          aria-label="Cerrar modal"
        >
          <X className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        {/* Imagen Amplia del Producto (Cloudinary) */}
        <div className="relative h-48 sm:h-72 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border-b border-slate-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.parentElement?.querySelector(".fallback-photo");
                if (fallback) fallback.classList.remove("hidden");
              }}
            />
          ) : null}

          {/* Respaldo elegante si la URL remota no responde */}
          <div className="fallback-photo hidden text-center p-8">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-2" />
            <span className="text-xs text-slate-400 font-medium">Fotografía de inventario local</span>
          </div>

          {/* Badges Flotantes sobre la Imagen */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10">
            {discountPercentage > 0 && (
              <span className="bg-brand-emerald text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
                <Tag className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                AHORRA {discountPercentage}%
              </span>
            )}
            <span className="bg-white/95 backdrop-blur-md text-slate-800 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs flex items-center gap-1">
              {product.category}
            </span>
          </div>

          <div className="absolute bottom-2 right-3 sm:bottom-3 sm:right-4 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-brand-orange" />
            <span>Despacho Express barrial</span>
          </div>
        </div>

        {/* Información del Producto y Comercio */}
        <div className="p-4 sm:p-7 overflow-y-auto flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Tienda de Origen */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                  <StoreIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-extrabold text-slate-900">{storeName}</h4>
                    <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-brand-emerald shrink-0" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[200px] sm:max-w-[260px]">{storeAddress}</span>
                  </p>
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-brand-emerald/15 text-brand-emerald px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0">
                Verificada
              </span>
            </div>

            {/* Nombre y Descripción */}
            <div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-1 sm:mt-2 line-clamp-2 sm:line-clamp-3">
                {product.description ||
                  "Producto de alta calidad disponible en tu tienda de barrio. Seleccionado con los mejores estándares de frescura e higiene."}
              </p>
            </div>

            {/* Fila de Precios y Stock */}
            <div className="flex items-end justify-between pt-1.5 sm:pt-2 border-t border-slate-100">
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through font-semibold">
                    ${originalPrice.toLocaleString("es-CO")}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-brand-emerald bg-brand-emerald/10 px-1.5 sm:px-2 py-0.5 rounded-full">
                    -{discountPercentage}%
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-3xl font-black text-brand-orange">
                    ${unitPrice.toLocaleString("es-CO")}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium">/ unidad</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium block">Disponible</span>
                <span className="text-[10px] sm:text-xs font-black text-slate-700 bg-slate-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full inline-block mt-0.5">
                  {product.stock || 25} unid.
                </span>
              </div>
            </div>
          </div>

          {/* Controles de Compra: Selector [- 1 +] y CTA Naranja */}
          <div className="space-y-2 sm:space-y-3 pt-1 sm:pt-2">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Selector de Cantidad [- 1 +] */}
              <div className="flex items-center justify-between border-2 border-slate-200 bg-slate-50 rounded-xl sm:rounded-2xl p-0.5 sm:p-1 w-28 sm:w-36 shrink-0">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-700 hover:bg-white hover:shadow-xs active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-3.5 sm:w-4 h-3.5 sm:h-4 font-black" />
                </button>
                <span className="text-sm sm:text-base font-black text-slate-900 w-6 sm:w-8 text-center">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= (product.stock || 99)}
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-700 hover:bg-white hover:shadow-xs active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent transition"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3.5 sm:w-4 h-3.5 sm:h-4 font-black" />
                </button>
              </div>

              {/* CTA Naranja Gigante MercaGo */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 font-black py-3 sm:py-4 px-3 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 text-white active:scale-98 text-xs sm:text-base tracking-wide ${
                  addedAnimation
                    ? "bg-brand-emerald shadow-brand-emerald/30 scale-[1.02]"
                    : "bg-brand-orange hover:bg-brand-orange-dark shadow-brand-orange/30 hover:shadow-xl"
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 stroke-[3]" />
                    <span>¡Agregado!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 stroke-[2.5]" />
                    <span>Añadir • ${totalPrice.toLocaleString("es-CO")}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 text-center">
              Despacho inmediato coordinado con {storeName}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
