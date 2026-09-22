import { Router } from "express";
import { createOrder, getOrders, getOrderById } from "../controllers/order.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Creación de pedido (soporta tanto usuarios autenticados como clientes rápidos)
router.post("/", createOrder);

// Historial de pedidos
router.get("/", authenticateToken, getOrders);
router.get("/:id", authenticateToken, getOrderById);

export default router;
