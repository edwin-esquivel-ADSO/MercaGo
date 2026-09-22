# Flujo de Aprobación y Orquestación

## Pipeline de Ejecución de la Gobernanza Monolito

El proceso de desarrollo desde la concepción hasta el despliegue sigue una secuencia obligatoria:

```
[Idea / Requerimiento]
         │
         ▼
[1. Tech Lead & Orquestador] ────► Estructura la arquitectura y monorepo
         │
         ▼
[2. Security & Database] ────────► Blindan esquemas Prisma, DDL Neon y políticas OWASP
         │
         ▼
[3. Frontend & Backend] ─────────► Ejecutan en carpetas aisladas:
         │                         - apps/web/
         │                         - apps/mobile/
         │                         - packages/backend/
         ▼
[4. QA & DevOps] ────────────────► Auditan cero placeholders, generan docs/ y vercel.json
```

## Estándares de Entrega
1. **Entorno (.env / .env.example)**: Prellenado con variables validadas para Neon y Cloudinary.
2. **Script de Base de Datos (`database/init-db`)**: Script ejecutable de creación y seed en Neon.
3. **Árbol de Archivos Aislado**: Conformidad absoluta con la estructura de Monorepo.
4. **Código Fuente Integral**: Cero placeholders, sin truncar archivos.
5. **Despliegue Vercel**: `vercel.json` y scripts listos para build productivo.
