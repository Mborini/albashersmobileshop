import pool from "../../../lib/db";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ brand: string }> }
) {
  try {
    const { brand } = await context.params;

    const client = await pool.connect();
   
    const res = await client.query(
     `SELECT p.id, p.title, p.description, p.price, p.subcategory_id, p.brand_id, p.created_at, p."discountedPrice",
       COALESCE(json_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '[]') AS images
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.brand_id = $1
GROUP BY p.id;
`,
      [brand]
    );
    client.release();
   
    return new Response(JSON.stringify(res.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    }
    catch (error) {
    console.error("DB Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
    }
    }

