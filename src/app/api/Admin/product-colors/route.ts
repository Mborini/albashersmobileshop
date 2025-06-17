import pool from "@/app/lib/db";

export async function POST(req) {
    try {
      const body = await req.json();
      const {  color_id, product_id } = body;
  
      console.log("Received data:", body);
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO product_colors (color_id, product_id) VALUES ($1, $2) RETURNING *',
        [color_id, product_id]
      );
        client.release();
        return new Response(JSON.stringify(result.rows[0]), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
            });
    }
    catch (error) {
      console.error("POST Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
}

export async function DELETE(req: Request) {
    const body = await req.json();
    const { product_id, color_id } = body;
  
    const client = await pool.connect();
    try {
      await client.query(
        'DELETE FROM product_colors WHERE product_id = $1 AND color_id = $2',
        [product_id, color_id]
      );
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
      console.error("DELETE Error:", err);
      return new Response("Failed to delete color", { status: 500 });
    } finally {
      client.release();
    }
  }
  