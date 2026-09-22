import { PrismaClient, Role } from "@prisma/client";
import * as dotenv from "dotenv";
import * as path from "path";
import * as bcrypt from "bcryptjs";

// Cargar variables de entorno desde la raíz del monorepo
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const prisma = new PrismaClient({
  log: ["info", "warn", "error"],
});

async function main() {
  console.log("==============================================================================");
  console.log("🌱 [DATABASE-MASTER / A10] Inyectando datos semilla de Neiva, Huila en Neon DB...");
  console.log("==============================================================================");

  const hashedPassword = await bcrypt.hash("MercaGo2026!", 10);

  // 1. Usuarios
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@mercago.com" },
    update: {},
    create: {
      email: "admin@mercago.com",
      password: hashedPassword,
      name: "Administrador MercaGo Neiva",
      role: Role.ADMIN,
      phone: "+57 300 000 0001",
      address: "Edificio Centro Empresarial, Neiva",
    },
  });

  const tenderoUser = await prisma.user.upsert({
    where: { email: "tendero@mercago.com" },
    update: {},
    create: {
      email: "tendero@mercago.com",
      password: hashedPassword,
      name: "Comerciante Asociado Neiva",
      role: Role.TENDERO,
      phone: "+57 (8) 877 1234",
      address: "Carrera 30 # 19-64, Barrio El Jardín, Neiva",
    },
  });

  const clienteUser = await prisma.user.upsert({
    where: { email: "cliente@mercago.com" },
    update: {},
    create: {
      email: "cliente@mercago.com",
      password: hashedPassword,
      name: "Carlos Esquivel",
      role: Role.CLIENTE,
      phone: "+57 312 345 6789",
      address: "Calle 14 # 22-50, Barrio Ipanema, Neiva",
    },
  });

  // 2. Tiendas de Neiva
  const storesData = [
    {
      id: "store-popular-neiva",
      name: "Supermercados Popular",
      description: "La cadena de supermercados más tradicional y querida de Neiva. Abarrotes, frutas frescas y despensa familiar completa.",
      address: "Carrera 30 # 19-64, Barrio El Jardín, Neiva",
      phone: "+57 (8) 877 1234",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
      bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
      ownerId: tenderoUser.id,
    },
    {
      id: "store-superior-centro",
      name: "Supermercado Superior",
      description: "Autoservicio tradicional del centro de Neiva, líderes en precios bajos de la canasta básica y carnes seleccionadas.",
      address: "Carrera 2 # 2-34, Centro, Neiva",
      phone: "+57 (8) 871 5678",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
      bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
      ownerId: tenderoUser.id,
    },
    {
      id: "store-merkar-oriente",
      name: "Supermercados Merkar Plus",
      description: "El supermercado preferido del oriente neivano. Variedad en lácteos, panadería, carnes y productos nacionales.",
      address: "Carrera 39 # 8-15, Barrio Prado Alto, Neiva",
      phone: "+57 310 888 4321",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
      bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
      ownerId: tenderoUser.id,
    },
    {
      id: "store-surabastos-neiva",
      name: "Central Mayorista Surabastos",
      description: "La mayor despensa agrícola del sur colombiano. Frutas frescas, plátano, cholupa y verduras del campo huilense.",
      address: "Km 1 Vía al Sur, Neiva, Huila",
      phone: "+57 315 555 9876",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/aguacate_hass.jpg",
      bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
      ownerId: tenderoUser.id,
    },
    {
      id: "store-peter-pan",
      name: "Panadería & Repostería Peter Pan",
      description: "Tradición panadera y de bizcochería huilense en el corazón de Neiva. Achiras recién horneadas, pan de maíz y café de origen.",
      address: "Calle 10 # 4-55, Centro, Neiva",
      phone: "+57 (8) 872 3456",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/pan_artesanal.jpg",
      bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
      ownerId: tenderoUser.id,
    },
  ];

  for (const s of storesData) {
    await prisma.store.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
    console.log(`🏬 [TIENDA NEIVA CREADA]: ${s.name} (${s.address})`);
  }

  // 3. Productos de Neiva y el Huila
  const productsData = [
    {
      id: "prod-achiras-huilenses",
      name: "Achiras del Huila Tradicionales 250g",
      description: "Auténticos bizcochos de achira huilense elaborados artesanalmente con cuajada fresca y almidón de achira natural.",
      price: 7500.0,
      stock: 50,
      category: "Panadería",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
      storeId: "store-peter-pan",
    },
    {
      id: "prod-quesillo-huilense",
      name: "Quesillo Huilense en Hoja de Plátano 500g",
      description: "Quesillo hilado tradicional del Huila envuelto en hoja de plátano cachaco. Textura cremosa y sabor lácteo inconfundible.",
      price: 9800.0,
      stock: 40,
      category: "Lácteos y Huevos",
      imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=80",
      storeId: "store-popular-neiva",
    },
    {
      id: "prod-cholupa-huilense",
      name: "Cholupa Fresca del Huila (Kilo - ~6 unidades)",
      description: "La fruta reina del Huila con Denominación de Origen Protegida. Pulpa aromática perfecta para jugos refrescantes del clima opita.",
      price: 6200.0,
      stock: 65,
      category: "Frutas y Verduras",
      imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80",
      storeId: "store-surabastos-neiva",
    },
    {
      id: "prod-cafe-huilense-altura",
      name: "Café Especial Huilense de Altura 500g",
      description: "Café 100% arábica seleccionado de Pitalito y Gigante (Huila). Notas de chocolate amargo, caramelo y aroma intenso.",
      price: 19500.0,
      stock: 35,
      category: "Abarrotes",
      imageUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/cafe_colombiano.jpg",
      storeId: "store-merkar-oriente",
    },
    {
      id: "prod-arroz-florhuila",
      name: "Arroz Florhuila Grano Largo Seleccionado 5kg",
      description: "El arroz de mayor tradición en Colombia cosechado en los valles arroceros del Huila. Rendimiento superior y grano entero.",
      price: 22500.0,
      stock: 55,
      category: "Abarrotes",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
      storeId: "store-superior-centro",
    },
    {
      id: "prod-platano-huilense",
      name: "Plátano Maduro y Verde Huilense (Mano x 6)",
      description: "Plátanos frescos recolectados en fincas de Rivera y Campoalegre. Ideales para patacones crocantes o asados familiares.",
      price: 4500.0,
      stock: 80,
      category: "Frutas y Verduras",
      imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
      storeId: "store-surabastos-neiva",
    },
    {
      id: "prod-leche-alqueria",
      name: "Leche Entera La Alquería 1L",
      description: "Leche entera ultrapasteurizada enriquecida con calcio y minerales esenciales. Infaltable en la mesa de los neivanos.",
      price: 4300.0,
      stock: 75,
      category: "Lácteos y Huevos",
      imageUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/leche_entera.jpg",
      storeId: "store-popular-neiva",
    },
    {
      id: "prod-aguacate-hass-neiva",
      name: "Aguacate Hass Huilense de Exportación",
      description: "Cosechado en las laderas de Algeciras y Santa María (Huila). Textura cremosa perfecta para ensaladas y guacamoles.",
      price: 4200.0,
      stock: 60,
      category: "Frutas y Verduras",
      imageUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/aguacate_hass.jpg",
      storeId: "store-surabastos-neiva",
    },
    {
      id: "prod-pan-monito-neiva",
      name: "Pan Moñito Huilense Tradicional (Bolsa x 6)",
      description: "Panadería clásica opita con queso campesino rallado y mantequilla pura horneado fresco al alba en el centro de Neiva.",
      price: 5200.0,
      stock: 45,
      category: "Panadería",
      imageUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/pan_artesanal.jpg",
      storeId: "store-peter-pan",
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
    console.log(`📦 [PRODUCTO NEIVA REGISTRADO]: ${p.name} - $${p.price}`);
  }

  console.log("==============================================================================");
  console.log("🎉 [DATABASE-MASTER] Seed de Neiva completado exitosamente en Neon PostgreSQL.");
  console.log("==============================================================================");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
