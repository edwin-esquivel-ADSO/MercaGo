const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("==============================================================================");
  console.log("🌱 [DATABASE-MASTER / A10] Inyectando datos semilla (Seed) en Neon DB...");
  console.log("==============================================================================");

  const hashedPassword = await bcrypt.hash("MercaGo2026!", 10);

  // 1. Admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@mercago.com" },
    update: {},
    create: {
      email: "admin@mercago.com",
      password: hashedPassword,
      name: "Administrador MercaGo",
      role: "ADMIN",
      phone: "+57 300 000 0001",
      address: "Sede Principal MercaGo",
    },
  });
  console.log(`👤 [ADMIN CREADO]: ${adminUser.email}`);

  // 2. Tendero
  const tenderoUser = await prisma.user.upsert({
    where: { email: "tendero@mercago.com" },
    update: {},
    create: {
      email: "tendero@mercago.com",
      password: hashedPassword,
      name: "Don Pepe Comerciante",
      role: "TENDERO",
      phone: "+57 310 555 1234",
      address: "Carrera 15 # 45-20, Chapinero",
    },
  });
  console.log(`🏪 [TENDERO CREADO]: ${tenderoUser.email}`);

  // 3. Cliente
  const clienteUser = await prisma.user.upsert({
    where: { email: "cliente@mercago.com" },
    update: {},
    create: {
      email: "cliente@mercago.com",
      password: hashedPassword,
      name: "Carlos Esquivel",
      role: "CLIENTE",
      phone: "+57 312 345 6789",
      address: "Calle 45 # 12-34, Apto 302, Chapinero Central",
    },
  });
  console.log(`🛒 [CLIENTE CREADO]: ${clienteUser.email}`);

  // 4. Tienda
  const store = await prisma.store.upsert({
    where: { id: "store-supermercado-centro" },
    update: {},
    create: {
      id: "store-supermercado-centro",
      name: "Supermercado Centro",
      description: "Tu supermercado barrial de confianza con los mejores productos frescos, abarrotes y entrega express.",
      address: "Carrera 15 # 45-20, Chapinero",
      phone: "+57 310 555 1234",
      logoUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_logo.png",
      bannerUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/store_centro_banner.png",
      ownerId: tenderoUser.id,
    },
  });
  console.log(`🏬 [TIENDA CREADA]: ${store.name}`);

  // 5. Productos
  const products = [
    {
      id: "prod-aguacate-hass",
      name: "Aguacate Hass Premium",
      description: "Aguacate fresco de exportación, textura suave y cremosa ideal para ensaladas, tostadas o guacamole casero.",
      price: 3500.0,
      stock: 45,
      category: "Frutas y Verduras",
      imageUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/aguacate_hass.jpg",
      storeId: store.id,
    },
    {
      id: "prod-leche-alqueria",
      name: "Leche Entera La Alquería 1L",
      description: "Leche entera ultrapasteurizada fortificada con calcio, hierro y vitaminas esenciales para la familia.",
      price: 4200.0,
      stock: 60,
      category: "Lácteos y Huevos",
      imageUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/leche_entera.jpg",
      storeId: store.id,
    },
    {
      id: "prod-pan-artesanal",
      name: "Pan Tajado Artesanal Mantequilla",
      description: "Pan suave elaborado artesanalmente con masa madre y mantequilla pura de granja, horneado fresco cada mañana.",
      price: 5800.0,
      stock: 30,
      category: "Panadería",
      imageUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/pan_artesanal.jpg",
      storeId: store.id,
    },
    {
      id: "prod-cafe-colombiano",
      name: "Café Especial Colombiano 500g",
      description: "Café 100% arábica de origen Huila con tostión media, balance perfecto y notas pronunciadas de chocolate y caramelo.",
      price: 18500.0,
      stock: 25,
      category: "Abarrotes",
      imageUrl: "https://res.cloudinary.com/dgvldhbt/image/upload/v1/mercago/cafe_colombiano.jpg",
      storeId: store.id,
    },
  ];

  for (const prod of products) {
    const p = await prisma.product.upsert({
      where: { id: prod.id },
      update: {},
      create: prod,
    });
    console.log(`📦 [PRODUCTO CREADO]: ${p.name} - $${p.price} (${p.category})`);
  }

  console.log("==============================================================================");
  console.log("🎉 [DATABASE-MASTER] Seed completado con éxito en Neon DB.");
  console.log("==============================================================================");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
