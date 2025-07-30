import pool from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
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
        LEFT JOIN product_colors pc ON p.id = pc.product_id
        LEFT JOIN colors clr ON pc.color_id = clr.id
        WHERE p.is_advertised = true
        GROUP BY p.id, b.name
      `;

      const productsResult = await client.query(productsQuery);

      const allColors = productsResult.rows.flatMap((p) => p.colors || []);
      const uniqueColorsMap = new Map();
      for (const color of allColors) {
        if (!uniqueColorsMap.has(color.id)) {
          uniqueColorsMap.set(color.id, color);
        }
      }
      const colors = Array.from(uniqueColorsMap.values());

      return new Response(
        JSON.stringify({
          products: productsResult.rows,
          colors,
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
