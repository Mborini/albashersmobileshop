import pool from "../../lib/db"; // Adjust path if needed
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") || "";
    const client = await pool.connect();

    const res = await client.query(
      `SELECT DISTINCT ON (p.id) 
           p.id, 
           p.title, 
           pi.image_url,
           s.name AS subcategory_name,
           c.name AS category_name,
           b.name AS brand_name
       FROM products p
       LEFT JOIN product_images pi ON p.id = pi.product_id
       INNER JOIN brands b ON p.brand_id = b.id
       INNER JOIN "subCategories" s ON p.subcategory_id = s.id
       INNER JOIN categories c ON s.category_id = c.id
       WHERE p.title ILIKE $1
       ORDER BY p.id, pi.id
       `,
      [`%${search}%`]
    );

    client.release();

    return new Response(JSON.stringify(res.rows), {
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
