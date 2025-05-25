import pool from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
): Promise<Response> {
  try {
    const { params } = await contextPromise;
    const { id } = params;

    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, name FROM attributes WHERE subcategory_id = $1 ORDER BY id ASC;",
      [id]
    );
    client.release();

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("DB Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
