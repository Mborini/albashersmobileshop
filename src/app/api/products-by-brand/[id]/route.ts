import pool from "../../../lib/db";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = await pool.connect();

    const productRes = await client.query(
      `SELECT 
        p.*, 
        pcodes.name AS promo_code,
        pcodes.discount AS discount_value,
        
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
        ) AS images,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('id', clr.id, 'name', clr.name, 'hex_code', clr.hex_code)
          ) FILTER (WHERE clr.id IS NOT NULL),
          '[]'::jsonb
        ) AS colors
      FROM products p
      INNER JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      LEFT JOIN product_attributes pa ON p.id = pa.product_id
      LEFT JOIN attributes a ON pa.attribute_id = a.id
      LEFT JOIN product_colors pc ON pc.product_id = p.id
 LEFT JOIN colors clr ON pc.color_id = clr.id
      LEFT JOIN promo_codes pcodes 
        ON p.brand_id = pcodes."brandId" 
        AND pcodes.expiry_date >= CURRENT_DATE
      WHERE p.is_new_arrival = true AND p.brand_id = $1
      GROUP BY p.id, b.name, pcodes.name, pcodes.discount
    `, [id]
    );

    const products = productRes.rows;

    // استخراج الألوان بدون تكرار
    const allColors = products.flatMap((p) => p.colors || []);
    const uniqueColorsMap = new Map();
    for (const color of allColors) {
      if (!uniqueColorsMap.has(color.id)) {
        uniqueColorsMap.set(color.id, color);
      }
    }
    const colors = Array.from(uniqueColorsMap.values());

    client.release();

    return new Response(JSON.stringify({ products, colors }), {
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
