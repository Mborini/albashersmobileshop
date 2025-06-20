import pool from "../../../lib/db";

export async function GET() {
  try {
    const client = await pool.connect();

    const productRes = await client.query(`
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
      LEFT JOIN product_colors pc ON pc.product_id = p.id
      LEFT JOIN colors clr ON pc.color_id = clr.id
      WHERE p.is_best_offer = true
      GROUP BY p.id, b.name
    `);

    const products = productRes.rows;

    // استخراج جميع الألوان من المنتجات
    const allColors = products.flatMap(p => p.colors || []);

    // إزالة التكرارات بناءً على id
    const uniqueColorsMap = new Map();
    for (const color of allColors) {
      if (!uniqueColorsMap.has(color.id)) {
        uniqueColorsMap.set(color.id, color);
      }
    }
    const colors = Array.from(uniqueColorsMap.values());

    // استخراج الماركات
    const brandIds = [...new Set(products.map((p) => p.brand_id))];
    let brands = [];

    if (brandIds.length > 0) {
      const brandQuery = `
        SELECT id, name 
        FROM brands 
        WHERE id = ANY($1)
        ORDER BY name ASC
      `;
      const brandRes = await client.query(brandQuery, [brandIds]);
      brands = brandRes.rows;
    }

    client.release();

    return new Response(JSON.stringify({ products, brands, colors }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DB Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
