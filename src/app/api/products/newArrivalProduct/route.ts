import pool from '../../../lib/db'; // if using relative path

export async function GET() {
  try {
    const client = await pool.connect();


    const res = await client.query(`
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
        ) AS images,

        -- تجميع الألوان المرتبطة بالمنتج
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

      WHERE p.is_new_arrival = true

      GROUP BY p.id, b.name

      LIMIT 10
    `);

    client.release();

    return new Response(JSON.stringify(res.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("DB Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
