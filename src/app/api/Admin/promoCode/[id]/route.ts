import { NextRequest } from "next/server";
import pool from "@/app/lib/db";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Promo code ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = await pool.connect();

    const result = await client.query(
      "DELETE FROM promo_codes WHERE id = $1 RETURNING *",
      [id]
    );

    client.release();

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: "Promo code not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
