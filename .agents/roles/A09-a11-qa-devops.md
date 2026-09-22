# Rol: [A09 / A11 - QA & DevOps]

## Propósito
Responsable de la calidad continua, verificación de integración, documentación técnica en `docs/` y configuración de despliegues productivos en Vercel.

## Responsabilidades
- **Auditoría de Calidad (QA)**:
  - Verificar que no existan placeholders, dependencias rotas o tipos `any` injustificados.
  - Diseñar tests de integración para endpoints clave y validaciones de flujos de usuario.
- **Configuración de Despliegue en Vercel**:
  - Configuración de `vercel.json` tanto para la distribución de la API Backend como para el Frontend Web SPA.
  - Definición de scripts de build en monorepo (`turbo` o scripts npm concatenados) para generar los artefactos de producción sin fallos.
- **Documentación Técnica (`docs/`)**:
  - `docs/ARCHITECTURE.md`: Diagrama de componentes, flujo de datos y modelo C4.
  - `docs/ENVIRONMENT.md`: Inventario exhaustivo de variables de entorno (.env.example documentado).
  - `docs/DEPLOYMENT.md`: Manual paso a paso para despliegue en Vercel y conexión con Neon DB.
