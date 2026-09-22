# AntiGravity Kit: Monolith Governance Framework (MGF) & OmniCode

Este directorio contiene la definición, roles, reglas de gobernanza y flujos de trabajo del equipo multi-agente bajo el **Monolith Governance Framework** y el sistema de ingeniería **OmniCode**.

## Principios Fundamentales

1. **Gobernanza Monolito (Monorepo Aislado)**:
   - `apps/web/`: React + Vite (Frontend Web)
   - `apps/mobile/`: React Native + Expo (Frontend Móvil)
   - `packages/backend/`: Node.js + Express + TypeScript (API REST)
   - `packages/database/`: Prisma ORM + PostgreSQL en Neon + Migraciones y Seeds
   - `docs/`: Documentación, SRS, diagramas de arquitectura y manuales de despliegue

2. **Regla de Cero Placeholders (Zero Placeholders)**:
   - Prohibido terminantemente el uso de comentarios elípticos (`// tu código aquí`, `/* TODO */`, `...resto del archivo`).
   - Todo código generado debe ser 100% completo, funcional, fuertemente tipado en TypeScript y libre de ambigüedades.

3. **Flujo de Aprobación Estricto**:
   - `[Idea / Requerimiento]` → `[Tech Lead & Orquestador estructura]` → `[Security & Database blindan el plan]` → `[Frontend Web, Mobile & Backend ejecutan en carpetas aisladas]` → `[QA & DevOps auditan y configuran despliegue]`.

4. **Stack Tecnológico Homologado (PERN Typed)**:
   - **Runtime**: Node.js (LTS) con TypeScript estricto.
   - **Backend**: Express.js modular, validación Zod, sanitización de entradas, Helmet, CORS.
   - **Frontend Web**: React 18+ con Vite, TailwindCSS / CSS modular (Paleta: Naranja Vibrante `#FF6B00`, Verde Esmeralda `#00B074`).
   - **Frontend Mobile**: React Native con Expo, TypeScript.
   - **Base de Datos**: PostgreSQL en Neon (Serverless), Prisma ORM con Prepared Statements obligatorios.
   - **Storage**: Cloudinary SDK para activos multimedia.
   - **Despliegue & CI/CD**: Vercel (`vercel.json`), variables de entorno validadas.
