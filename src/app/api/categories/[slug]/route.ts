import { NextRequest } from "next/server";
import pool from "../../../lib/db"; // عدل المسار حسب مشروعك

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    

    const client = await pool.connect();

    const query = `
      SELECT * FROM "subCategories"
      WHERE category_id = $1
    `;

    const result = await client.query(query, [slug]);

    client.release();

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}
