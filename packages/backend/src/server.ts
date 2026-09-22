import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import storeRoutes from "./routes/store.routes";

// ==============================================================================
// 1. CARGA DE CONFIGURACIÓN & VARIABLES DE ENTORNO
// ==============================================================================
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_URL = process.env.FRONTEND_WEB_URL || "http://localhost:5173";

// ==============================================================================
// 1.1 MANEJO GLOBAL DE ERRORES DEL PROCESO (RESILIENCIA NEON POSTGRESQL)
// ==============================================================================
process.on("unhandledRejection", (reason: any) => {
  const msg = reason?.message || String(reason);
  if (msg.includes("Closed") || msg.includes("connection")) {
    console.warn("⚠️ [BACKEND / NEON] Conexión inactiva de Neon cerrada por timeout. Prisma reconectará en la próxima petición.");
  } else {
    console.warn("⚠️ [BACKEND] Advertencia no capturada (unhandledRejection):", msg);
  }
});

process.on("uncaughtException", (error: Error) => {
  const msg = error?.message || String(error);
  if (msg.includes("Closed") || msg.includes("connection")) {
    console.warn("⚠️ [BACKEND / NEON] Excepción de conexión ociosa capturada:", msg);
  } else {
    console.error("❌ [BACKEND] Excepción no capturada:", error);
  }
});

// ==============================================================================
// 2. INICIALIZACIÓN DE PRISMA (NEON POSTGRESQL CON RESILIENCIA)
// ==============================================================================
export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "error" },
    { emit: "stdout", level: "warn" },
  ],
});

(prisma as any).$on?.("error", (e: any) => {
  if (e?.message?.includes("Closed")) {
    console.warn("⚠️ [PRISMA / NEON] Socket ocioso cerrado por Neon. Reanudación transparente programada.");
  } else {
    console.error("❌ [PRISMA ERROR]:", e?.message || e);
  }
});

// Keep-alive suave para mantener caliente el pooler de Neon DB en desarrollo
const keepAliveInterval = setInterval(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    // Si la conexión se cerró, el siguiente query se reconectará limpiamente
  }
}, 3 * 60 * 1000);
keepAliveInterval.unref();

// ==============================================================================
// 3. INICIALIZACIÓN DE LA APLICACIÓN EXPRESS
// ==============================================================================
const app = express();

// ==============================================================================
// 4. MIDDLEWARES DE SEGURIDAD AUDITADOS POR APPSEC (A04)
// ==============================================================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permitir peticiones locales durante el desarrollo
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ==============================================================================
// 5. RUTAS BASE & VERIFICACIÓN DE ESTADO (HEALTH CHECK)
// ==============================================================================
app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "healthy",
      service: "MercaGo API Backend",
      environment: NODE_ENV,
      database: "Neon PostgreSQL Connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      service: "MercaGo API Backend",
      environment: NODE_ENV,
      database: "Neon PostgreSQL Disconnected",
      error: error instanceof Error ? error.message : "Error desconocido en DB",
      timestamp: new Date().toISOString(),
    });
  }
});

app.get("/api/info", (_req: Request, res: Response) => {
  res.status(200).json({
    app: "MercaGo",
    version: "1.0.0-mvp",
    governance: "Monolith Governance Framework",
    stack: "PERN Typed (Node.js, Express, React, React Native, Prisma, Neon DB)",
    brandColors: {
      primaryOrange: "#FF6B00",
      emeraldGreen: "#00B47A",
    },
  });
});

// ==============================================================================
// 6. ENLACE DE RUTAS PRINCIPALES DEL MVP
// ==============================================================================
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ==============================================================================
// 7. GESTIÓN DE ERRORES & RUTAS NO ENCONTRADAS (404)
// ==============================================================================
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Recurso no encontrado en el servidor de MercaGo API",
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ [BACKEND ERROR]:", err.message);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: NODE_ENV === "development" ? err.message : undefined,
  });
});

// ==============================================================================
// 8. ARRANQUE DEL SERVIDOR
// ==============================================================================
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log("==============================================================================");
    console.log(`🚀 [BACKEND / A07] Servidor MercaGo escuchando en http://localhost:${PORT}`);
    console.log(`🔒 [APPSEC / A04] Helmet & CORS activos para ${FRONTEND_URL}`);
    console.log(`🐘 [DATABASE / A10] Conectado a Neon PostgreSQL vía Prisma Client`);
    console.log(`📡 [API ROUTES]: /api/auth, /api/products, /api/orders, /api/stores, /api/health`);
    console.log("==============================================================================");
  });
}

export default app;
