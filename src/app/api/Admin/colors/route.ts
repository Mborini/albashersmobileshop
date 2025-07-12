import pool from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
  const client = await pool.connect();
  const res = await client.query(`SELECT * FROM colors ORDER BY name DESC`);
  client.release();

  return new Response(JSON.stringify(res.rows), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}