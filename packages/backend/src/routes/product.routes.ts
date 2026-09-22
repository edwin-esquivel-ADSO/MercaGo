import { Router } from "express";
import { getProducts, getProductById, createProduct } from "../controllers/product.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Consulta pública de catálogo
router.get("/", getProducts);
router.get("/:id", getProductById);

// Creación de producto (protegido con token)
router.post("/", authenticateToken, createProduct);

export default router;
