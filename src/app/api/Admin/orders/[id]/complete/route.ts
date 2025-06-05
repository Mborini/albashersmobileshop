import { NextResponse } from "next/server";
import pool from "../../../../../lib/db";

export async function PUT(req: Request, context: { params: { id: string } }) {
  const orderId = Number(context.params.id);

  if (isNaN(orderId)) {
    return new Response(JSON.stringify({ error: "Invalid order ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = await pool.connect();

    const { rows } = await client.query(
      'SELECT "isCompleted" FROM checkouts WHERE id = $1',
      [orderId]
    );

    if (rows.length === 0) {
      client.release();
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentStatus = rows[0].isCompleted;
    const newStatus = !currentStatus;

    const result = await client.query(
      'UPDATE checkouts SET "isCompleted" = $1 WHERE id = $2 RETURNING *',
      [newStatus, orderId]
    );

    client.release();

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
