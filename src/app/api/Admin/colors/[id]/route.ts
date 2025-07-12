import { NextRequest } from "next/server";
import pool from "../../../../lib/db";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params.id;
  

  const body = await req.json();
  const { name, hex_code } = body;

  if (!name || !hex_code) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing fields" }),
      { status: 400 }
    );
  }

  const client = await pool.connect();

  try {
    await client.query(
      "UPDATE colors SET name = $1, hex_code = $2 WHERE id = $3",
      [name, hex_code, id]
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("DB error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Database error" }),
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
