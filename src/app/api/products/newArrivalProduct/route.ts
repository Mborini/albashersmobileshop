import pool from '../../../lib/db'; // if using relative path

export async function GET() {
    try {
      const client = await pool.connect();
      console.log('Connected to DB');
  
      const res = await client.query(`SELECT p.*, b.name AS brand_name,
       COALESCE(array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '{}') AS images
FROM products p
INNER JOIN brands b ON p.brand_id = b.id
LEFT JOIN product_images pi ON pi.product_id = p.id
WHERE p.is_new_arrival = true
GROUP BY p.id, b.name`);
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
  