import React from "react";
import { ProductModal } from "./ProductModal";
import { Product } from "../types";

export interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  return <ProductModal product={product} isOpen={Boolean(product)} onClose={onClose} />;
};

export default ProductDetail;
