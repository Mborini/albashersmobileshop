import pool from "../../../lib/db";

export async function GET() {
  try {
    const client = await pool.connect();

    const res = await client.query(`
      SELECT * FROM brands
      WHERE id NOT IN (SELECT "brandId" FROM promo_codes)
      ORDER BY name ASC
    `);

    client.release();

    return new Response(JSON.stringify(res.rows), {
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
