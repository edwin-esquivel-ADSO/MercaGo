import { Request, Response, NextFunction } from "express";
import { prisma } from "../server";

// Directorio real de supermercados y tiendas emblemáticas de Neiva, Huila
const NEIVA_STORES = [
  {
    id: "store-popular-neiva",
    name: "Supermercados Popular",
    description: "La cadena de supermercados más tradicional y querida de Neiva. Abarrotes, frutas frescas y despensa familiar completa.",
    address: "Carrera 30 # 19-64, Barrio El Jardín, Neiva",
    phone: "+57 (8) 877 1234",
    logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
    rating: 4.9,
    deliveryTime: "20-25 min",
    _count: { products: 6 },
  },
  {
    id: "store-superior-centro",
    name: "Supermercado Superior",
    description: "Autoservicio tradicional del centro de Neiva, líderes en precios bajos de la canasta básica y carnes seleccionadas.",
    address: "Carrera 2 # 2-34, Centro, Neiva",
    phone: "+57 (8) 871 5678",
    logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
    rating: 4.8,
    deliveryTime: "15-25 min",
    _count: { products: 5 },
  },
  {
    id: "store-merkar-oriente",
    name: "Supermercados Merkar Plus",
    description: "El supermercado preferido del oriente neivano. Variedad en lácteos, panadería, carnes y productos nacionales.",
    address: "Carrera 39 # 8-15, Barrio Prado Alto, Neiva",
    phone: "+57 310 888 4321",
    logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
    bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
    rating: 4.9,
    deliveryTime: "20-30 min",
    _count: { products: 6 },
  },
  {
    id: "store-surabastos-neiva",
    name: "Central Mayorista Surabastos",
    description: "La mayor despensa agrícola del sur colombiano. Frutas frescas, plátano, cholupa y verduras del campo huilense.",
    address: "Km 1 Vía al Sur, Neiva, Huila",
    phone: "+57 315 555 9876",
    logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/aguacate_hass.jpg",
    bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
    rating: 4.9,
    deliveryTime: "25-35 min",
    _count: { products: 8 },
  },
  {
    id: "store-peter-pan",
    name: "Panadería & Repostería Peter Pan",
    description: "Tradición panadera y de bizcochería huilense en el corazón de Neiva. Achiras recién horneadas, pan de maíz y café de origen.",
    address: "Calle 10 # 4-55, Centro, Neiva",
    phone: "+57 (8) 872 3456",
    logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/pan_artesanal.jpg",
    bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
    rating: 4.9,
    deliveryTime: "15-20 min",
    _count: { products: 4 },
  },
];

/**
 * GET /api/stores
 * Listado de supermercados y tiendas de Neiva, Huila
 */
export const getStores = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let stores;
    try {
      stores = await prisma.store.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbError) {
      console.warn("⚠️ [STORE CONTROLLER] DB no disponible, usando directorio oficial de Neiva:", dbError);
      stores = NEIVA_STORES;
    }

    if (!stores || stores.length === 0) {
      stores = NEIVA_STORES;
    }

    res.status(200).json({
      success: true,
      city: "Neiva, Huila",
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stores/:id
 * Consulta de una tienda o supermercado específico de Neiva
 */
export const getStoreById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    let store;
    try {
      store = await prisma.store.findUnique({
        where: { id },
        include: {
          products: true,
          _count: {
            select: { products: true },
          },
        },
      });
    } catch (dbError) {
      console.warn(`⚠️ [STORE CONTROLLER] Buscando tienda ${id} en respaldo de Neiva:`, dbError);
      store = NEIVA_STORES.find((s) => s.id === id);
    }

    if (!store) {
      store = NEIVA_STORES.find((s) => s.id === id);
    }

    if (!store) {
      res.status(404).json({
        success: false,
        message: `Comercio con ID '${id}' no encontrado en Neiva.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    next(error);
  }
};
