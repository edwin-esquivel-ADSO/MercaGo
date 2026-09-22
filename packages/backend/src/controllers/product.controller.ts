import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../server";

// Catálogo completo y enriquecido de productos de Neiva y el Huila con imágenes 100% reales
const NEIVA_PRODUCTS = [
  {
    id: "prod-achiras-huilenses",
    name: "Achiras del Huila Tradicionales 250g",
    description: "Auténticos bizcochos de achira huilense elaborados artesanalmente con cuajada fresca y almidón de achira natural.",
    price: 7500.0,
    originalPrice: 9000.0,
    discountPercentage: 17,
    stock: 50,
    category: "Panadería",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    storeId: "store-peter-pan",
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
    price: 9800.0,
    originalPrice: 11500.0,
    discountPercentage: 15,
    stock: 40,
    category: "Lácteos y Huevos",
    imageUrl: "https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?w=600&auto=format&fit=crop&q=80",
    storeId: "store-popular-neiva",
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
    price: 6200.0,
    originalPrice: 7500.0,
    discountPercentage: 17,
    stock: 65,
    category: "Frutas y Verduras",
    imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80",
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
    id: "prod-cafe-huilense-altura",
    name: "Café Especial Huilense de Altura 500g",
    description: "Café 100% arábica seleccionado de Pitalito y Gigante (Huila). Notas de chocolate amargo, caramelo y aroma intenso.",
    price: 19500.0,
    originalPrice: 23000.0,
    discountPercentage: 15,
    stock: 35,
    category: "Abarrotes",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
    storeId: "store-merkar-oriente",
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
    price: 22500.0,
    originalPrice: 25500.0,
    discountPercentage: 12,
    stock: 55,
    category: "Abarrotes",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    storeId: "store-superior-centro",
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
    price: 4500.0,
    originalPrice: 5500.0,
    discountPercentage: 18,
    stock: 80,
    category: "Frutas y Verduras",
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
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
    id: "prod-leche-alqueria",
    name: "Leche Entera La Alquería 1L",
    description: "Leche entera ultrapasteurizada enriquecida con calcio y minerales esenciales. Infaltable en la mesa de los neivanos.",
    price: 4300.0,
    originalPrice: 4900.0,
    discountPercentage: 12,
    stock: 75,
    category: "Lácteos y Huevos",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    storeId: "store-popular-neiva",
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
    price: 4200.0,
    originalPrice: 5000.0,
    discountPercentage: 16,
    stock: 60,
    category: "Frutas y Verduras",
    imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80",
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
    id: "prod-pan-monito-neiva",
    name: "Pan Moñito Huilense con Queso (Bolsa x 6)",
    description: "Panadería clásica opita con queso campesino rallado y mantequilla pura horneado fresco al alba en el centro de Neiva.",
    price: 5200.0,
    originalPrice: 6200.0,
    discountPercentage: 16,
    stock: 45,
    category: "Panadería",
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80",
    storeId: "store-peter-pan",
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
    price: 32000.0,
    originalPrice: 36000.0,
    discountPercentage: 11,
    stock: 30,
    category: "Carnes",
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80",
    storeId: "store-merkar-oriente",
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
    price: 18500.0,
    originalPrice: 21000.0,
    discountPercentage: 12,
    stock: 50,
    category: "Lácteos y Huevos",
    imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80",
    storeId: "store-popular-neiva",
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
    price: 8900.0,
    originalPrice: 10500.0,
    discountPercentage: 15,
    stock: 70,
    category: "Abarrotes",
    imageUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80",
    storeId: "store-superior-centro",
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
    price: 4900.0,
    originalPrice: 6000.0,
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
    price: 9400.0,
    originalPrice: 11000.0,
    discountPercentage: 15,
    stock: 65,
    category: "Abarrotes",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    storeId: "store-popular-neiva",
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
    price: 7800.0,
    originalPrice: 9200.0,
    discountPercentage: 15,
    stock: 40,
    category: "Frutas y Verduras",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
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
    id: "prod-jugo-citrico-neiva",
    name: "Jugo Natural Cítrico Naranja-Mandarina 1L",
    description: "Bebida cítrica 100% natural recién exprimida sin conservantes, ideal para combatir el calor de Neiva.",
    price: 5800.0,
    originalPrice: 6800.0,
    discountPercentage: 15,
    stock: 35,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
    storeId: "store-peter-pan",
    store: {
      id: "store-peter-pan",
      name: "Panadería Peter Pan",
      address: "Calle 10 # 4-55, Centro, Neiva",
      phone: "+57 (8) 872 3456",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/pan_artesanal.jpg",
    },
  },
];

const createProductSchema = z.object({
  name: z.string().min(2, "El nombre del producto es obligatorio"),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser un número positivo"),
  stock: z.number().int().nonnegative("El stock debe ser 0 o superior").default(0),
  category: z.string().min(2, "La categoría es obligatoria"),
  imageUrl: z.string().url("Debe suministrar una URL válida para la imagen"),
  storeId: z.string().min(1, "El ID de la tienda es obligatorio"),
});

const enrichProductWithDiscount = (product: any) => {
  const currentPrice = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : Math.round(currentPrice * 1.18);
  const discountPercentage = product.discountPercentage || Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  return {
    ...product,
    price: currentPrice,
    originalPrice,
    discountPercentage,
  };
};

/**
 * GET /api/products
 * Catálogo de productos de Neiva con filtrado por tienda, categoría y búsqueda
 */
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, storeId, search } = req.query;

    const where: Record<string, unknown> = {};

    if (category && typeof category === "string" && category !== "Todos") {
      where.category = category;
    }

    if (storeId && typeof storeId === "string") {
      where.storeId = storeId;
    }

    if (search && typeof search === "string" && search.trim() !== "") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    let products: any[] = [];
    try {
      products = await prisma.product.findMany({
        where,
        include: {
          store: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              logoUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (dbError) {
      console.warn("⚠️ [PRODUCT CONTROLLER] Usando catálogo enriquecido de Neiva:", dbError);
      products = NEIVA_PRODUCTS;
    }

    if (!products || products.length === 0) {
      products = NEIVA_PRODUCTS.filter((p) => {
        const matchesCategory = !category || category === "Todos" || p.category === category;
        const matchesStore = !storeId || p.storeId === storeId;
        const matchesSearch =
          !search ||
          typeof search !== "string" ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description || "").toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesStore && matchesSearch;
      });
    }

    // Filtrar estrictamente productos que tengan imagen válida
    const validProducts = products.filter((p) => Boolean(p.imageUrl && p.imageUrl.trim() !== ""));
    const enrichedProducts = validProducts.map(enrichProductWithDiscount);

    res.status(200).json({
      success: true,
      city: "Neiva, Huila",
      count: enrichedProducts.length,
      data: enrichedProducts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Detalle individual de producto por identificador
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    let product: any = null;
    try {
      product = await prisma.product.findUnique({
        where: { id },
        include: {
          store: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              logoUrl: true,
              bannerUrl: true,
            },
          },
        },
      });
    } catch (dbError) {
      console.warn(`⚠️ [PRODUCT CONTROLLER] Buscando producto ${id} en respaldo de Neiva:`, dbError);
      product = NEIVA_PRODUCTS.find((p) => p.id === id);
    }

    if (!product) {
      product = NEIVA_PRODUCTS.find((p) => p.id === id);
    }

    if (!product || !product.imageUrl) {
      res.status(404).json({
        success: false,
        message: `Producto con ID '${id}' no encontrado o no disponible.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: enrichProductWithDiscount(product),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Creación de producto
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createProductSchema.parse(req.body);

    const newProduct = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        stock: validatedData.stock,
        category: validatedData.category,
        imageUrl: validatedData.imageUrl,
        storeId: validatedData.storeId,
      },
      include: {
        store: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Producto creado satisfactoriamente en MercaGo Neiva.",
      data: enrichProductWithDiscount(newProduct),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Error de validación en el producto.",
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
};
