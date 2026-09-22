# 🛒 MercaGo — Plataforma Hiperlocal de Abastecimiento y Compras Familiares

<div align="center">
  <img src="apps/web/public/mercago_logo_oficial.png" alt="MercaGo Logo" width="280"/>
  <p><strong>El Mercado de Neiva, en una Sola Canasta</strong></p>
  <p><em>Aplicativo Multiplataforma Web y Móvil de Promociones y Gestión de Compras de Barrio</em></p>
  
  [![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://mercago.vercel.app)
  [![Stack](https://img.shields.io/badge/Stack-PERN%20Typed-00B47A?style=for-the-badge)](https://www.postgresql.org/)
  [![SENA ADSO](https://img.shields.io/badge/SENA-Ficha%203413974-FF6B00?style=for-the-badge)](https://www.sena.edu.co)
</div>

---

## 📖 Acerca del Proyecto

**MercaGo** es una solución tecnológica diseñada para transformar y digitalizar la experiencia de abastecimiento del hogar en la ciudad de **Neiva (Huila)** y su área de influencia metropolitana. 

Frente a la dispersión de ofertas en redes sociales, folletos físicos y estados de mensajería, MercaGo centraliza los catálogos en tiempo real de los principales supermercados, minimercados y tiendas de barrio tradicionales en una **Canasta Unificada**. Permite a las familias comparar precios, aprovechar descuentos auténticos y recibir productos típicos del Huila (achiras, quesillo, cholupa fresca, café de altura) en un promedio de **25 minutos** mediante despacho barrial express.

El proyecto está construido bajo el rigor metodológico del programa **Tecnología en Análisis y Desarrollo de Software (ADSO)** del **SENA**, dando cumplimiento estricto a la especificación de requisitos definida en [`Proyecto MercaGo - SRS.md`](./Proyecto%20MercaGo%20-%20SRS.md).

---

## 🚀 Características Principales

* **🛒 Canasta Unificada Multi-Tienda:** Permite al comprador seleccionar artículos de distintos supermercados y tiendas en una sola sesión de compra, con separación inteligente de comandas por comercio.
* **🎨 Carrito 3D Interactivo Ultraligero:** Experiencia visual inmersiva en la vista de inicio desarrollada con **Three.js** nativo (0 dependencias externas pesadas, 60 FPS, rotación táctil fluida con control *touch-pan-y* y animación de flotación proporcional donde todas las ruedas y víveres permanecen visibles).
* **📱 Diseño 100% Mobile-First:** Cuadrícula de 2 columnas en teléfonos inteligentes (al estilo de apps como Rappi y MercadoLibre), navegación táctil con *CSS scroll-snap* para comercios y modal de producto con acceso inmediato al botón de compra.
* **🏬 Comercio 100% Neivano y Huilense:** Integración de establecimientos reales de la capital del Huila:
  * *Supermercados Popular* (Barrio El Jardín)
  * *Supermercado Superior* (Centro de Neiva)
  * *Supermercados Merkar Plus* (Prado Alto)
  * *Central Mayorista Surabastos* (Km 1 Vía al Sur)
  * *Panadería y Bizcochería Peter Pan* (Centro)
* **⚡ Checkout Express:** Formulario optimizado con selección de métodos de pago acordados (Efectivo contra entrega, Transferencia QR Nequi/Daviplata y Datáfono móvil) y generación instantánea de identificador de pedido (`#MG-XXXXXX`).
* **🐘 Resiliencia Neon DB Serverless:** Manejo avanzado a nivel de proceso de desconexiones ociosas de PostgreSQL y soporte para pooler PgBouncer transaccional.

---

## 🛠️ Stack Tecnológico

El proyecto implementa una arquitectura monolítica modular orientada a servicios (**PERN Typed Monorepo**):

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend Web** | React 18, TypeScript, Vite, Tailwind CSS, Three.js, Lucide Icons |
| **Backend API** | Node.js, Express, TypeScript, Zod, Helmet, CORS, JWT |
| **ORM & Base de Datos**| Prisma ORM 5.22, PostgreSQL en la nube (**Neon Serverless**) con PgBouncer |
| **Multimedia** | Cloudinary CDN para almacenamiento de fotografías en alta definición |
| **Despliegue** | Vercel (Frontend Web SPA) y Cloud VPS / Serverless functions |

---

## 📁 Estructura del Monorepo

```
Proyecto MercaGo/
├── apps/
│   └── web/                   # Aplicación Web React + Vite + Tailwind CSS + Three.js
│       ├── public/            # Favicon, logos oficiales y multimedia estática
│       ├── src/
│       │   ├── components/    # Header, CartDrawer, ProductModal, InteractiveCart3D
│       │   ├── context/       # AuthContext, CartContext (Gestión de estado global)
│       │   ├── pages/         # Home, Login, Register, Checkout
│       │   └── types/         # Tipos TypeScript compartidos
│       └── vercel.json        # Configuración SPA para despliegue en Vercel
├── packages/
│   ├── backend/               # API REST Express + TypeScript
│   │   └── src/
│   │       ├── controllers/   # Controladores (product, store, order, auth)
│   │       ├── routes/        # Enrutadores REST (/api/products, /api/stores, etc.)
│   │       └── server.ts      # Servidor Express con resiliencia de conexión a Neon
│   └── database/              # Capa de datos con Prisma ORM
│       └── prisma/
│           ├── schema.prisma  # Esquema relacional de base de datos
│           └── seed.ts        # Inyector de datos semilla con comercios de Neiva
├── Proyecto MercaGo - SRS.pdf # Documento original SENA (66 páginas)
├── Proyecto MercaGo - SRS.md  # Especificación formal de requisitos en Markdown
├── vercel.json                # Configuración de build monorepo para Vercel
└── package.json               # Configuración de workspaces monorepo
```

---

## 💻 Instalación y Puesta en Marcha

### Prerrequisitos
* **Node.js** v18 o superior (recomendado v20 LTS / v22).
* **pnpm** o **npm**.

### 1. Clonar el Repositorio
```bash
git clone https://github.com/edwin-esquivel-ADSO/MercaGo.git
cd MercaGo
```

### 2. Instalar Dependencias
```bash
pnpm install
# o con npm:
npm install
```

### 3. Configuración de Variables de Entorno (`.env`)
Crear un archivo `.env` en la raíz del proyecto basándose en la siguiente configuración:

```env
# Servidor
NODE_ENV=development
PORT=5000

# Base de Datos Neon PostgreSQL Serverless
DATABASE_URL="postgresql://neondb_owner:npg_3ibUnd0BDXCk@ep-nameless-shadow-b4yrb4m8-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require&pgbouncer=true&connect_timeout=30&pool_timeout=30"

# Autenticación y Seguridad
JWT_SECRET="mercago_super_secure_jwt_secret_key_2026_production_ready"
JWT_EXPIRES_IN="7d"

# Frontend
FRONTEND_WEB_URL="http://localhost:5173"
```

### 4. Inicializar y Poblar la Base de Datos
```bash
pnpm run db:push
pnpm run db:seed
```

### 5. Iniciar en Modo Desarrollo (Backend + Frontend)
```bash
pnpm run dev
```
* **Frontend Web:** `http://localhost:5173`
* **API REST Backend:** `http://localhost:5000`
* **Health Check API:** `http://localhost:5000/api/health`

---

## 🌐 Despliegue en Vercel

El proyecto incluye archivos [`vercel.json`](./vercel.json) preconfigurados para soportar el enrutamiento SPA de React y la compilación directa:

1. Importar el repositorio en [Vercel](https://vercel.com).
2. Si se despliega desde la raíz del monorepo, Vercel utilizará el comando de build configurado en `vercel.json`:
   * **Build Command:** `cd apps/web && npm install && npm run build`
   * **Output Directory:** `apps/web/dist`
3. Si se configura el *Root Directory* apuntando directamente a `apps/web`:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Agregar las variables de entorno en Vercel Dashboard (`VITE_API_URL` apuntando a la URL del backend en producción).

---

## 👥 Equipo de Desarrollo (SENA ADSO — Ficha 3413974)

* **Edwin Alejandro Esquivel Bahamon** — *Líder del Proyecto & Requerimientos de Negocio* (`esquivel202414@gmail.com`)
* **Jose Esneider Covaleda Hortua** — *Desarrollador Full-Stack & Lógica de Sistema* (`josecovaleda.fisica2024@gmail.com`)
* **Joseph Felipe Aguirre Churta** — *Desarrollador Full-Stack & Diseño de Experiencia UX/UI* (`joseph.churta2009@gmail.com`)

**Instructor Guía:** Juan Carlos Rodriguez Losada  
**Institución:** Servicio Nacional de Aprendizaje (SENA) — 2026

---

## 📄 Licencia

Este proyecto está desarrollado con fines académicos y comerciales bajo la metodología de Gobernanza Monolito SENA. Todos los derechos reservados © 2026 MercaGo Inc.
