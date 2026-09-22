import { Router } from "express";
import { getStores, getStoreById } from "../controllers/store.controller";

const router = Router();

// GET /api/stores - Listar tiendas barriales
router.get("/", getStores);

// GET /api/stores/:id - Consultar tienda específica con sus productos
router.get("/:id", getStoreById);

export default router;
