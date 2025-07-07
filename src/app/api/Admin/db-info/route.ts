import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// أضف الحجم الكلي المتاح (من لوحة Neon) مباشرة هنا
const MAX_DB_SIZE_MB = 536.87;
const MAX_DB_SIZE_BYTES = MAX_DB_SIZE_MB * 1024 * 1024;

export async function GET() {
  try {
    const versionRes = await pool.query("SELECT version()");
    const version = versionRes.rows[0].version;

    const tablesRes = await pool.query(
      "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'"
    );
    const tableCount = parseInt(tablesRes.rows[0].count, 10);

    const sizeRes = await pool.query(
      "SELECT pg_database_size(current_database()) as size"
    );
    const sizeBytes = parseInt(sizeRes.rows[0].size, 10);
    const sizeMB = sizeBytes / (1024 * 1024);

    const prettyRes = await pool.query(
      "SELECT pg_size_pretty(pg_database_size(current_database())) AS pretty"
    );
    const readableSize = prettyRes.rows[0].pretty;

    return NextResponse.json({
      connected: true,
      version,
      tableCount,
      sizeBytes,
      sizeMB,
      readableSize,
      maxSizeMB: MAX_DB_SIZE_MB,
      maxSizeBytes: MAX_DB_SIZE_BYTES,
    });
  } catch (error) {
    console.error("DB connection error:", error);
    return NextResponse.json(
      { connected: false, error: "Failed to connect to database" },
      { status: 500 }
    );
  }
}
