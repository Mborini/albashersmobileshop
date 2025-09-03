import pool from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const client = await pool.connect();

  try {
    const query = `
      SELECT 
        p.*, 
        s.name AS subcategory_name,
        c.name AS category_name,
        b.name AS brand_name,
       pcodes.name AS promo_code,
        pcodes.discount AS discount_value,
        COALESCE(
          jsonb_object_agg(a.name, pa.value) FILTER (WHERE a.name IS NOT NULL), 
          '{}'::jsonb
        ) AS attributes,
        COALESCE(
          array_agg(DISTINCT pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), 
          '{}'::text[]
        ) AS images,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('id', clr.id, 'name', clr.name, 'hex_code', clr.hex_code)
          ) FILTER (WHERE clr.id IS NOT NULL),
          '[]'::jsonb
        ) AS colors
      FROM products p
      INNER JOIN brands b ON p.brand_id = b.id
      INNER JOIN "subCategories" s ON p.subcategory_id = s.id
      INNER JOIN categories c ON s.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      LEFT JOIN product_attributes pa ON pa.product_id = p.id
      LEFT JOIN attributes a ON pa.attribute_id = a.id
      LEFT JOIN product_colors pc ON pc.product_id = p.id
      LEFT JOIN colors clr ON pc.color_id = clr.id
      LEFT JOIN promo_codes pcodes ON p.brand_id = pcodes."brandId" AND pcodes.expiry_date >= CURRENT_DATE
      WHERE p.id = $1
      GROUP BY p.id, b.name, s.name, c.name, pcodes.name, pcodes.discount
    `;

    const result = await client.query(query, [id]);

    if (!result.rows.length) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("DB Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    client.release();
  }
}
