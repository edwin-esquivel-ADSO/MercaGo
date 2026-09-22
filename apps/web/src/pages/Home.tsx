import React, { useState, useEffect } from "react";
import { InteractiveCart3D } from "../components/InteractiveCart3D";
import {
  ChevronRight,
  Plus,
  Store as StoreIcon,
  ShieldCheck,
  Sparkles,
  Package,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Tag,
  Check,
  MapPin,
  Flame,
  Star,
  Compass,
} from "lucide-react";
import { Product, Store } from "../types";
import { useCart } from "../context/CartContext";
import { ProductModal } from "../components/ProductModal";

interface HomeProps {
  searchQuery?: string;
}

// 16 Productos representativos de Neiva y el Huila con imágenes reales en alta definición
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-achiras-huilenses",
    name: "Achiras del Huila Tradicionales 250g",
    description: "Auténticos bizcochos de achira huilense elaborados artesanalmente con cuajada fresca y almidón de achira natural.",
    price: 7500,
    originalPrice: 9000,
    discountPercentage: 17,
    category: "Panadería",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    storeId: "store-peter-pan",
    stock: 50,
    store: {
      id: "store-peter-pan",
      name: "Panadería Peter Pan",
      address: "Calle 10 # 4-55, Centro, Neiva",
      phone: "+57 (8) 872 3456",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/pan_artesanal.jpg",
    },
  },
  {
    id: "prod-quesillo-huilense",
    name: "Quesillo Huilense en Hoja de Plátano 500g",
    description: "Quesillo hilado tradicional del Huila envuelto en hoja de plátano cachaco. Textura cremosa y sabor lácteo inconfundible.",
    price: 9800,
    originalPrice: 11500,
    discountPercentage: 15,
    category: "Lácteos y Huevos",
    imageUrl: "https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?w=600&auto=format&fit=crop&q=80",
    storeId: "store-popular-neiva",
    stock: 40,
    store: {
      id: "store-popular-neiva",
      name: "Supermercados Popular",
      address: "Carrera 30 # 19-64, Barrio El Jardín, Neiva",
      phone: "+57 (8) 877 1234",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    },
  },
  {
    id: "prod-cholupa-huilense",
    name: "Cholupa Fresca del Huila (Kilo - ~6 unidades)",
    description: "La fruta reina del Huila con Denominación de Origen Protegida. Pulpa aromática perfecta para jugos refrescantes del clima opita.",
    price: 6200,
    originalPrice: 7500,
    discountPercentage: 17,
    category: "Frutas y Verduras",
    imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80",
    storeId: "store-surabastos-neiva",
    stock: 65,
    store: {
      id: "store-surabastos-neiva",
      name: "Central Mayorista Surabastos",
      address: "Km 1 Vía al Sur, Neiva, Huila",
      phone: "+57 315 555 9876",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/aguacate_hass.jpg",
    },
  },
  {
    id: "prod-cafe-huilense-altura",
    name: "Café Especial Huilense de Altura 500g",
    description: "Café 100% arábica seleccionado de Pitalito y Gigante (Huila). Notas de chocolate amargo, caramelo y aroma intenso.",
    price: 19500,
    originalPrice: 23000,
    discountPercentage: 15,
    category: "Abarrotes",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
    storeId: "store-merkar-oriente",
    stock: 35,
    store: {
      id: "store-merkar-oriente",
      name: "Supermercados Merkar Plus",
      address: "Carrera 39 # 8-15, Barrio Prado Alto, Neiva",
      phone: "+57 310 888 4321",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    },
  },
  {
    id: "prod-arroz-florhuila",
    name: "Arroz Florhuila Grano Largo Seleccionado 5kg",
    description: "El arroz de mayor tradición en Colombia cosechado en los valles arroceros del Huila. Rendimiento superior y grano entero.",
    price: 22500,
    originalPrice: 25500,
    discountPercentage: 12,
    category: "Abarrotes",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    storeId: "store-superior-centro",
    stock: 55,
    store: {
      id: "store-superior-centro",
      name: "Supermercado Superior",
      address: "Carrera 2 # 2-34, Centro, Neiva",
      phone: "+57 (8) 871 5678",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    },
  },
  {
    id: "prod-platano-huilense",
    name: "Plátano Maduro y Verde Huilense (Mano x 6)",
    description: "Plátanos frescos recolectados en fincas de Rivera y Campoalegre. Ideales para patacones crocantes o asados familiares.",
    price: 4500,
    originalPrice: 5500,
    discountPercentage: 18,
    category: "Frutas y Verduras",
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
    storeId: "store-surabastos-neiva",
    stock: 80,
    store: {
      id: "store-surabastos-neiva",
      name: "Central Mayorista Surabastos",
      address: "Km 1 Vía al Sur, Neiva, Huila",
      phone: "+57 315 555 9876",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/aguacate_hass.jpg",
    },
  },
  {
    id: "prod-leche-alqueria",
    name: "Leche Entera La Alquería 1L",
    description: "Leche entera ultrapasteurizada enriquecida con calcio y minerales esenciales. Infaltable en la mesa de los neivanos.",
    price: 4300,
    originalPrice: 4900,
    discountPercentage: 12,
    category: "Lácteos y Huevos",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    storeId: "store-popular-neiva",
    stock: 75,
    store: {
      id: "store-popular-neiva",
      name: "Supermercados Popular",
      address: "Carrera 30 # 19-64, Barrio El Jardín, Neiva",
      phone: "+57 (8) 877 1234",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    },
  },
  {
    id: "prod-aguacate-hass-neiva",
    name: "Aguacate Hass Huilense de Exportación",
    description: "Cosechado en las laderas de Algeciras y Santa María (Huila). Textura cremosa perfecta para ensaladas y guacamoles.",
    price: 4200,
    originalPrice: 5000,
    discountPercentage: 16,
    category: "Frutas y Verduras",
    imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80",
    storeId: "store-surabastos-neiva",
    stock: 60,
    store: {
      id: "store-surabastos-neiva",
      name: "Central Mayorista Surabastos",
      address: "Km 1 Vía al Sur, Neiva, Huila",
      phone: "+57 315 555 9876",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/aguacate_hass.jpg",
    },
  },
  {
    id: "prod-pan-monito-neiva",
    name: "Pan Moñito Huilense con Queso (Bolsa x 6)",
    description: "Panadería clásica opita con queso campesino rallado y mantequilla pura horneado fresco al alba en el centro de Neiva.",
    price: 5200,
    originalPrice: 6200,
    discountPercentage: 16,
    category: "Panadería",
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80",
    storeId: "store-peter-pan",
    stock: 45,
    store: {
      id: "store-peter-pan",
      name: "Panadería Peter Pan",
      address: "Calle 10 # 4-55, Centro, Neiva",
      phone: "+57 (8) 872 3456",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/pan_artesanal.jpg",
    },
  },
  {
    id: "prod-carne-asado-huilense",
    name: "Carne para Asado Huilense (Kilo Pulpa Marinada)",
    description: "Cortes de res seleccionados y marinados al estilo tradicional opita para el auténtico asado del Huila.",
    price: 32000,
    originalPrice: 36000,
    discountPercentage: 11,
    category: "Carnes",
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80",
    storeId: "store-merkar-oriente",
    stock: 30,
    store: {
      id: "store-merkar-oriente",
      name: "Supermercados Merkar Plus",
      address: "Carrera 39 # 8-15, Barrio Prado Alto, Neiva",
      phone: "+57 310 888 4321",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    },
  },
  {
    id: "prod-huevos-campesinos",
    name: "Huevos Rojos Campesinos AA (Cubeta x 30)",
    description: "Huevos frescos de granjas avícolas del Huila, yema dorada y alto valor nutricional para toda la familia.",
    price: 18500,
    originalPrice: 21000,
    discountPercentage: 12,
    category: "Lácteos y Huevos",
    imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80",
    storeId: "store-popular-neiva",
    stock: 50,
    store: {
      id: "store-popular-neiva",
      name: "Supermercados Popular",
      address: "Carrera 30 # 19-64, Barrio El Jardín, Neiva",
      phone: "+57 (8) 877 1234",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    },
  },
  {
    id: "prod-panela-isnos",
    name: "Panela Cuadrada Artesanal de Isnos (Atado 2kg)",
    description: "Panela 100% pura de caña producida en trapiches de Isnos (Huila), ideal para limonadas frescas y agua de panela.",
    price: 8900,
    originalPrice: 10500,
    discountPercentage: 15,
    category: "Abarrotes",
    imageUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80",
    storeId: "store-superior-centro",
    stock: 70,
    store: {
      id: "store-superior-centro",
      name: "Supermercado Superior",
      address: "Carrera 2 # 2-34, Centro, Neiva",
      phone: "+57 (8) 871 5678",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    },
  },
  {
    id: "prod-tomate-cebolla-neiva",
    name: "Combo Tomate Chonto y Cebolla Junca (Kilo)",
    description: "Verduras recién cosechadas para el tradicional guiso y hogao colombiano de los almuerzos en Neiva.",
    price: 4900,
    originalPrice: 6000,
    discountPercentage: 18,
    stock: 90,
    category: "Frutas y Verduras",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    storeId: "store-surabastos-neiva",
    store: {
      id: "store-surabastos-neiva",
      name: "Central Mayorista Surabastos",
      address: "Km 1 Vía al Sur, Neiva, Huila",
      phone: "+57 315 555 9876",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/aguacate_hass.jpg",
    },
  },
  {
    id: "prod-aceite-vegetal",
    name: "Aceite Vegetal Puro de Cocina 900ml",
    description: "Aceite vegetal libre de colesterol para frituras crocantes y preparación de platos diarios.",
    price: 9400,
    originalPrice: 11000,
    discountPercentage: 15,
    category: "Abarrotes",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    storeId: "store-popular-neiva",
    stock: 65,
    store: {
      id: "store-popular-neiva",
      name: "Supermercados Popular",
      address: "Carrera 30 # 19-64, Barrio El Jardín, Neiva",
      phone: "+57 (8) 877 1234",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    },
  },
  {
    id: "prod-manzana-roja",
    name: "Manzana Roja Gala Seleccionada (Kilo - ~5 un)",
    description: "Manzanas crujientes y dulces, perfectas para loncheras y meriendas saludables en Neiva.",
    price: 7800,
    originalPrice: 9200,
    discountPercentage: 15,
    category: "Frutas y Verduras",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
    storeId: "store-surabastos-neiva",
    stock: 40,
    store: {
      id: "store-surabastos-neiva",
      name: "Central Mayorista Surabastos",
      address: "Km 1 Vía al Sur, Neiva, Huila",
      phone: "+57 315 555 9876",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/aguacate_hass.jpg",
    },
  },
  {
    id: "prod-jugo-citrico-neiva",
    name: "Jugo Natural Cítrico Naranja-Mandarina 1L",
    description: "Bebida cítrica 100% natural recién exprimida sin conservantes, ideal para combatir el calor de Neiva.",
    price: 5800,
    originalPrice: 6800,
    discountPercentage: 15,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
    storeId: "store-peter-pan",
    stock: 35,
    store: {
      id: "store-peter-pan",
      name: "Panadería Peter Pan",
      address: "Calle 10 # 4-55, Centro, Neiva",
      phone: "+57 (8) 872 3456",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/pan_artesanal.jpg",
    },
  },
];

// Supermercados y Tiendas Reales de Neiva, Huila
const INITIAL_STORES: Store[] = [
  {
    id: "store-popular-neiva",
    name: "Supermercados Popular",
    description: "La cadena más tradicional de Neiva. Sede Jardín con abarrotes y productos para el hogar.",
    address: "Carrera 30 # 19-64, Barrio El Jardín, Neiva",
    phone: "+57 (8) 877 1234",
    logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    rating: 4.9,
    deliveryTime: "20-25 min",
    _count: { products: 6 },
  },
  {
    id: "store-superior-centro",
    name: "Supermercado Superior",
    description: "Autoservicio tradicional del centro de Neiva, líderes en precios bajos de canasta básica.",
    address: "Carrera 2 # 2-34, Centro, Neiva",
    phone: "+57 (8) 871 5678",
    logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    rating: 4.8,
    deliveryTime: "15-25 min",
    _count: { products: 5 },
  },
  {
    id: "store-merkar-oriente",
    name: "Supermercados Merkar Plus",
    description: "El supermercado insignia del oriente neivano. Variedad en carnes, café y despensa.",
    address: "Carrera 39 # 8-15, Barrio Prado Alto, Neiva",
    phone: "+57 310 888 4321",
    logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    rating: 4.9,
    deliveryTime: "20-30 min",
    _count: { products: 6 },
  },
  {
    id: "store-surabastos-neiva",
    name: "Central Mayorista Surabastos",
    description: "La mayor despensa agrícola del sur colombiano. Frutas frescas, plátano y cholupa huilense.",
    address: "Km 1 Vía al Sur, Neiva, Huila",
    phone: "+57 315 555 9876",
    logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/aguacate_hass.jpg",
    rating: 4.9,
    deliveryTime: "25-35 min",
    _count: { products: 8 },
  },
  {
    id: "store-peter-pan",
    name: "Panadería Peter Pan",
    description: "Tradición bizcochera y panadera en el centro de Neiva. Achiras calientes y café de origen.",
    address: "Calle 10 # 4-55, Centro, Neiva",
    phone: "+57 (8) 872 3456",
    logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/pan_artesanal.jpg",
    rating: 4.9,
    deliveryTime: "15-20 min",
    _count: { products: 4 },
  },
];

const CATEGORIES = ["Todos", "Frutas y Verduras", "Lácteos y Huevos", "Panadería", "Abarrotes", "Carnes", "Bebidas"];

export const Home: React.FC<HomeProps> = ({ searchQuery = "" }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("ALL");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

  // Carga de tiendas desde la API
  useEffect(() => {
    let isMounted = true;
    const fetchStores = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stores`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
            setStores(json.data);
          }
        }
      } catch (err) {
        // En Vercel o sin backend responde el catálogo predeterminado
      }
    };
    fetchStores();
    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  // Carga de productos desde la API con filtrado dinámico
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== "Todos") params.append("category", selectedCategory);
        if (selectedStoreId !== "ALL") params.append("storeId", selectedStoreId);
        if (searchQuery.trim() !== "") params.append("search", searchQuery.trim());

        const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
            // Filtrar estrictamente productos que tengan imagen válida
            const valid = json.data.filter((p: Product) => Boolean(p.imageUrl && p.imageUrl.trim() !== ""));
            setProducts(valid);
          }
        }
      } catch {
        // Mantiene el catálogo inicial de 16 productos
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedStoreId, searchQuery, API_URL]);

  // Agregar rápido al carrito
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const scrollToPromotions = () => {
    const element = document.getElementById("seccion-promociones");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtrado reactivo en cliente garantizando que TODOS tengan imagen
  const displayedProducts = products
    .filter((item) => Boolean(item.imageUrl && item.imageUrl.trim() !== ""))
    .filter((item) => {
      const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
      const matchesStore = selectedStoreId === "ALL" || item.storeId === selectedStoreId;
      const matchesQuery =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.store?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesStore && matchesQuery;
    });

  return (
    <div className="space-y-10 pb-16 bg-[#F4F6F8]">
      {/* ==================================================================== */}
      {/* 1. SECCIÓN HERO INTERACTIVA 3D (CARRITO DE MERCADO LIMPIO)           */}
      {/* ==================================================================== */}
      <section className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Contenido Editorial & CTA */}
          <div className="lg:col-span-6 p-5 sm:p-10 lg:p-12 z-20 space-y-4 sm:space-y-6 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-orange/20 text-brand-orange text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-brand-orange/30 backdrop-blur-md">
                <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                MercaGo Neiva 3D
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-brand-emerald/20 text-brand-emerald text-[10px] sm:text-[11px] font-bold border border-brand-emerald/30">
                <ShieldCheck className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                Huila • Despacho Express
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                El Mercado de Neiva,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8533] to-[#00B47A]">
                  en una Sola Canasta
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm sm:text-base leading-relaxed max-w-lg">
                Pide en Supermercados Popular, Merkar Plus, Surabastos y tiendas de tu barrio. Recibe achiras, quesillo, cholupa y tu mercado completo en menos de 25 minutos.
              </p>
            </div>

            {/* CTA Naranja Vibrante (#FF6B00) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={scrollToPromotions}
                className="bg-[#FF6B00] hover:bg-brand-orange-dark text-white font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40 transition-all duration-200 flex items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm active:scale-95 group"
              >
                <span>Hacer Pedido Ahora</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory("Frutas y Verduras");
                  scrollToPromotions();
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl backdrop-blur-md border border-white/15 transition text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <Compass className="w-4 h-4 text-brand-emerald" />
                <span>Productos del Huila</span>
              </button>
            </div>
          </div>

          {/* Carrito de Mercado 3D Limpio y Ultraligero */}
          <div className="lg:col-span-6 h-64 sm:h-80 lg:h-[440px] relative w-full overflow-hidden flex items-center justify-center p-2 sm:p-4">
            <InteractiveCart3D />
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. FILTRADO POR SUPERMERCADOS Y TIENDAS DE NEIVA                     */}
      {/* ==================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Supermercados y Tiendas de Neiva
              </h2>
              <span className="bg-brand-emerald/15 text-brand-emerald text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Huila • Comunas 1 a 10
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Establecimientos oficiales con entrega garantizada hoy en Neiva
            </p>
          </div>

          {selectedStoreId !== "ALL" && (
            <button
              onClick={() => setSelectedStoreId("ALL")}
              className="text-xs font-bold text-brand-orange hover:underline"
            >
              Ver todos los comercios
            </button>
          )}
        </div>

        {/* Listado Horizontal de Supermercados de Neiva */}
        <div className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x snap-mandatory">
          {/* Opción Todos los Supermercados */}
          <div
            onClick={() => setSelectedStoreId("ALL")}
            className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer min-w-[200px] sm:min-w-[220px] shrink-0 flex flex-col justify-between snap-start ${
              selectedStoreId === "ALL"
                ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                : "bg-white text-slate-800 border-slate-200/90 hover:border-brand-orange/40 hover:shadow-md"
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
              <div
                className={`p-2.5 sm:p-3 rounded-xl flex items-center justify-center ${
                  selectedStoreId === "ALL" ? "bg-brand-orange text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                <StoreIcon className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black leading-tight">Todos los Comercios</h4>
                <span
                  className={`text-[10px] font-medium block mt-0.5 ${
                    selectedStoreId === "ALL" ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  Canasta Unificada Neiva
                </span>
              </div>
            </div>
            <div
              className={`text-[10px] sm:text-[11px] font-bold pt-2 border-t flex items-center justify-between ${
                selectedStoreId === "ALL" ? "border-slate-800 text-brand-orange" : "border-slate-100 text-slate-500"
              }`}
            >
              <span>{displayedProducts.length} productos</span>
              <span>Filtrar</span>
            </div>
          </div>

          {/* Cards de Comercios de Neiva */}
          {stores.map((store) => {
            const isSelected = selectedStoreId === store.id;

            return (
              <div
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer min-w-[230px] sm:min-w-[260px] max-w-[260px] sm:max-w-[280px] shrink-0 flex flex-col justify-between snap-start ${
                  isSelected
                    ? "bg-white border-brand-orange ring-2 ring-brand-orange/30 shadow-lg scale-[1.02]"
                    : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                        <StoreIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">{store.name}</h4>
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{store.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2 leading-snug mb-2.5 sm:mb-3">
                    {store.description || "Comercio afiliado a MercaGo Neiva."}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                    {store.rating || 4.9}
                  </span>
                  <span className="font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-emerald" />
                    {store.deliveryTime || "20-25 min"}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isSelected ? "bg-brand-orange text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isSelected ? "Activa" : "Elegir"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. BARRA DE BENEFICIOS INFORMATIVOS (FLAT DESIGN)                    */}
      {/* ==================================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-3 sm:gap-3.5 shadow-2xs">
          <div className="p-2.5 sm:p-3 bg-brand-orange/10 text-brand-orange rounded-xl shrink-0">
            <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
          </div>
          <div>
            <h4 className="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wide">
              Entrega en ~25 Minutos
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Despacho en toda Neiva y zona metropolitana</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-3 sm:gap-3.5 shadow-2xs">
          <div className="p-2.5 sm:p-3 bg-brand-emerald/10 text-brand-emerald rounded-xl shrink-0">
            <HeartHandshake className="w-4 sm:w-5 h-4 sm:h-5" />
          </div>
          <div>
            <h4 className="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wide">
              100% Comercio Huilense
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Apoyando a productores y tenderos de Neiva</p>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-3 sm:gap-3.5 shadow-2xs">
          <div className="p-2.5 sm:p-3 bg-brand-navy/10 text-brand-navy rounded-xl shrink-0">
            <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5" />
          </div>
          <div>
            <h4 className="text-[11px] sm:text-xs font-black text-slate-900 uppercase tracking-wide">
              Pago Contra Entrega
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Efectivo, Nequi, Daviplata o Datáfono móvil</p>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. CUADRÍCULA (GRID) DE PRODUCTOS (100% CON IMÁGENES REALES)         */}
      {/* ==================================================================== */}
      <section id="seccion-promociones" className="space-y-4 sm:space-y-6 pt-2">
        {/* Filtros de Categorías */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition shadow-2xs shrink-0 ${
                selectedCategory === cat
                  ? "bg-brand-emerald text-white shadow-md shadow-brand-emerald/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Encabezado de la Grilla */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Catálogo en Neiva {selectedCategory !== "Todos" ? `• ${selectedCategory}` : ""}
              </h2>
              <span className="bg-brand-orange/15 text-brand-orange text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <Flame className="w-3 h-3" /> Precios de Neiva
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Mostrando {displayedProducts.length} productos verificados para entrega hoy
            </p>
          </div>

          <span className="text-[11px] sm:text-xs font-bold text-brand-emerald flex items-center gap-1.5 bg-brand-emerald/10 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full w-fit">
            <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> Stock y Precios Verificados
          </span>
        </div>

        {/* Estado de Carga */}
        {loading && (
          <div className="text-center py-3 text-xs font-bold text-brand-orange animate-pulse">
            Sincronizando inventario con Neon DB...
          </div>
        )}

        {/* Estado Vacío */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">
              No se encontraron productos con los filtros seleccionados en Neiva.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Todos");
                setSelectedStoreId("ALL");
              }}
              className="mt-4 text-xs font-black text-brand-orange hover:underline uppercase tracking-wider"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          /* Grid de Productos: 2 Columnas en Móviles, 4 en Desktop */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayedProducts.map((product) => {
              const unitPrice = Number(product.price);
              const originalPrice = product.originalPrice
                ? Number(product.originalPrice)
                : Math.round(unitPrice * 1.18);
              const discountPercentage =
                product.discountPercentage || Math.round(((originalPrice - unitPrice) / originalPrice) * 100);
              const storeName = product.store?.name || "Supermercados Popular";
              const isAdded = Boolean(addedItems[product.id]);

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl hover:border-brand-orange/40 transition-all duration-300 flex flex-col group cursor-pointer relative"
                >
                  {/* Badge de Descuento */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-brand-emerald text-white text-[9px] sm:text-[11px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md flex items-center gap-1">
                      <Tag className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                      -{discountPercentage}%
                    </div>
                  )}

                  {/* Imagen de Producto */}
                  <div className="h-36 sm:h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center p-2 sm:p-3 border-b border-slate-100">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />

                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-800 shadow-2xs">
                      {product.category}
                    </span>
                  </div>

                  {/* Cuerpo de la Card */}
                  <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                    <div>
                      {/* Tienda de Origen en Neiva */}
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 mb-1">
                        <StoreIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-brand-orange shrink-0" />
                        <span className="truncate font-semibold">{storeName}</span>
                      </div>

                      {/* Título de Producto */}
                      <h3 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-brand-orange transition-colors duration-200 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>

                      {/* Descripción (visible en tablets y desktop para mantener consistencia visual en móviles) */}
                      <p className="hidden sm:line-clamp-2 text-xs text-slate-500 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Precios y Botón de Agregar */}
                    <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                      <div>
                        {/* Precio Tachado */}
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through font-semibold block leading-none">
                          ${originalPrice.toLocaleString("es-CO")}
                        </span>
                        {/* Precio con Descuento */}
                        <span className="text-sm sm:text-lg font-black text-brand-orange mt-0.5 block leading-tight">
                          ${unitPrice.toLocaleString("es-CO")}
                        </span>
                      </div>

                      {/* Botón de Agregar Verde Esmeralda */}
                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xs transition-all duration-200 active:scale-90 flex items-center justify-center shrink-0 ${
                          isAdded
                            ? "bg-brand-orange text-white scale-105"
                            : "bg-brand-emerald hover:bg-brand-emerald-dark text-white hover:shadow-md"
                        }`}
                        title="Añadir a la Canasta"
                        aria-label={`Añadir ${product.name} a la canasta`}
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 5. MODAL DE DETALLE DE PRODUCTO                                      */}
      {/* ==================================================================== */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
