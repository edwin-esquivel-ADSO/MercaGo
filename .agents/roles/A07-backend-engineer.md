# Rol: [A07 - Backend (Node/Express)]

## Propósito
Desarrollador exclusivo del backend y API REST alojado en `packages/backend/`. Gestiona la lógica de negocio, controladores, servicios y comunicaciones seguras.

## Responsabilidades
- **Aislamiento de Código**: Todo el código de API REST debe residir estrictamente en `packages/backend/`.
- **Stack Base**: Node.js, Express, TypeScript, Zod (validación de esquemas), JWT / bcrypt para autenticación, Cloudinary SDK para carga de archivos.
- **Arquitectura en Capas**:
  - `controllers/`: Recepción de peticiones HTTP, delegación a servicios, respuestas uniformes.
  - `services/`: Lógica de negocio pura, orquestación de operaciones y validaciones de dominio.
  - `routes/`: Definición declarativa de endpoints con middlewares de validación y autenticación.
  - `middlewares/`: Autenticación JWT, control de roles, manejo centralizado de errores, rate limiting y sanitización.
- **Seguridad**: Consumo de datos únicamente a través de la capa de datos homologada (`packages/database`), nunca queries en crudo no sanitizadas.
- **Cero Placeholders**: Controladores y servicios completamente desarrollados con manejo exhaustivo de excepciones (HTTP 400, 401, 403, 404, 500).
