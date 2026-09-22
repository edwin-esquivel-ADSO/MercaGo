# Regla de Seguridad: AppSec & Mitigación OWASP

## 1. Persistencia Segura y Prepared Statements
- Toda consulta a Neon PostgreSQL debe realizarse a través del cliente Prisma o prepared statements nativos parametrizados.
- Queda prohibida la interpolación de variables o concatenación directa de strings en sentencias SQL.

## 2. Sanitización y Validación de Entradas
- Todo payload entrante (`req.body`, `req.params`, `req.query`) debe ser validado por esquemas de datos estrictos (p. ej. Zod) antes de llegar a la capa de servicios.
- Rechazar datos no permitidos mediante strip de campos desconocidos.

## 3. Manejo de Secretos y Variables de Entorno
- Los secretos (`DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_API_KEY`, etc.) jamás deben subirse a repositorios ni quemarse en código.
- Validación centralizada en el arranque del backend para abortar inmediatamente si falta alguna variable crítica.

## 4. Cabeceras HTTP y Transporte Seguro
- Implementación de `helmet` para configurar `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`.
- CORS restringido a los dominios autorizados de la aplicación web.
- Cookies de autenticación con banderas `HttpOnly`, `Secure` (en producción) y `SameSite=Strict` o `Lax`.
