import pool from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const client = await pool.connect();

    try {
      const productsQuery = `
       SELECT 
  p.*, 
  b.name AS brand_name,

  
  COALESCE(
    jsonb_object_agg(a.name, pa.value) 
    FILTER (WHERE a.name IS NOT NULL), 
    '{}'::jsonb
  ) AS attributes,


  COALESCE(
    array_agg(DISTINCT pi.image_url) 
    FILTER (WHERE pi.image_url IS NOT NULL), 
    '{}'
  ) AS images

FROM products p
INNER JOIN brands b ON p.brand_id = b.id
LEFT JOIN product_images pi ON pi.product_id = p.id
LEFT JOIN product_attributes pa ON p.id = pa.product_id
LEFT JOIN attributes a ON pa.attribute_id = a.id

WHERE p.subcategory_id = $1

GROUP BY p.id, b.name

      `;

      const brandsQuery = `
        SELECT DISTINCT b.name
        FROM products p
        INNER JOIN brands b ON p.brand_id = b.id
        WHERE p.subcategory_id = $1
        ORDER BY b.name ASC
      `;

      const productsResult = await client.query(productsQuery, [slug]);
      const brandsResult = await client.query(brandsQuery, [slug]);

      return new Response(
        JSON.stringify({
          products: productsResult.rows,
          brands: brandsResult.rows,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("API error:", error);
      return new Response(
        JSON.stringify({ error: (error as Error).message }),
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error occurred" }),
      { status: 500 }
    );
  }
}
