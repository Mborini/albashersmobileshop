import pool from "../../../lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    console.log("Connected to DB");

    // 1. Get new arrival products
    const productRes = await client.query(`
      SELECT 
  p.*, 
  b.name AS brand_name,

  -- تجميع الصفات ككائن JSON
  COALESCE(
    jsonb_object_agg(a.name, pa.value) 
    FILTER (WHERE a.name IS NOT NULL), 
    '{}'::jsonb
  ) AS attributes,

  -- تجميع الصور بدون تكرار
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

WHERE p.is_new_arrival = true

GROUP BY p.id, b.name

    `);

    const products = productRes.rows;

    // 2. Extract unique brand IDs from those products
    const brandIds = [...new Set(products.map((p) => p.brand_id))];

    let brands = [];

    if (brandIds.length > 0) {
      // 3. Get brand details for those IDs
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

    return new Response(JSON.stringify({ products, brands }), {
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
