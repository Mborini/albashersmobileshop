import pool from "../../../../../lib/db";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const orderId = Number(id);

  if (isNaN(orderId)) {
    return new Response(JSON.stringify({ error: "Invalid order ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = await pool.connect();

    const query = `
      UPDATE checkouts
      SET "isdeclined" = true
      WHERE id = $1
      RETURNING *;
    `;
    const values = [orderId];

    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Update Error:", error);
    return new Response(JSON.stringify({ error: "Failed to update status" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
