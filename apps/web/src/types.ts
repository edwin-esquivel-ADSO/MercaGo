export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CLIENTE" | "TENDERO";
  phone?: string;
  address?: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  logoUrl?: string;
  bannerUrl?: string;
  rating?: number;
  deliveryTime?: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  originalPrice?: number | string;
  discountPercentage?: number;
  stock: number;
  category: string;
  imageUrl: string;
  storeId: string;
  store?: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    logoUrl?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  status: "PENDIENTE" | "EN_PREPARACION" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
  total: number;
  deliveryAddress: string;
  deliveryNotes?: string;
  items: OrderItem[];
  store?: Store;
  createdAt: string;
}
