import pool from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
  const client = await pool.connect();
  const res = await client.query(`
    SELECT promo_codes.*, b.name as brand_name
    FROM promo_codes
    INNER JOIN brands as b ON promo_codes."brandId" = b.id
    WHERE expiry_date >= CURRENT_DATE
  `);
  client.release();

  return new Response(JSON.stringify(res.rows), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
