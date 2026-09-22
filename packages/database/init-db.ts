import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

// Cargar variables de entorno desde la raíz del monorepo o local
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config(); // fallback local

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ [DATABASE-MASTER] Error fatal: La variable DATABASE_URL no está definida.");
  process.exit(1);
}

async function initializeDatabase(): Promise<void> {
  console.log("==============================================================================");
  console.log("🚀 [DATABASE-MASTER / A10] Iniciando verificación de conexión con Neon DB...");
  console.log("==============================================================================");

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false, // Requerido para conexiones seguras SSL de Neon Serverless
    },
  });

  try {
    const client = await pool.connect();
    console.log("✅ [DATABASE-MASTER] Conexión establecida exitosamente con el cluster de Neon.");

    // Consulta de verificación de salud y versión de PostgreSQL
    const resHealth = await client.query(
      "SELECT NOW() as server_time, version() as pg_version, current_database() as current_db;"
    );

    const { server_time, pg_version, current_db } = resHealth.rows[0];
    console.log(`📡 [NEON DB INFO] Base de datos activa: ${current_db}`);
    console.log(`⏰ [SERVER TIME] Hora del servidor: ${server_time}`);
    console.log(`🐘 [PG VERSION] Motor: ${pg_version}`);

    // DDL para tablas esenciales del MVP si no se ha ejecutado prisma db push aún
    console.log("🛠️  [DATABASE-MASTER] Verificando tablas del modelo de datos MercaGo...");

    const checkTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    const tablesRes = await client.query(checkTablesQuery);
    const existingTables = tablesRes.rows.map((row) => row.table_name);

    console.log(`📊 [TABLAS DETECTADAS]: ${existingTables.length > 0 ? existingTables.join(", ") : "Ninguna tabla creada todavía."}`);

    client.release();
    await pool.end();

    console.log("==============================================================================");
    console.log("🎉 [DATABASE-MASTER] Base de datos Neon validada y lista para Prisma Client.");
    console.log("==============================================================================");
  } catch (error) {
    console.error("❌ [DATABASE-MASTER] Error de conexión con Neon DB:", error);
    process.exit(1);
  }
}

// Ejecución autónoma
initializeDatabase();
