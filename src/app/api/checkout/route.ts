import pool from "@/app/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, address, country, note, cartItems, totalPrice , city, phone } = body;

    const client = await pool.connect();
    const result = await client.query(
      `
      INSERT INTO checkouts (firstName,lastName, email, address,country,note, cart_items, total_price, created_at ,isCompleted,city, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8,  NOW(), false,$9, $10)
      RETURNING *;
      `,
        [firstName, lastName, email, address, country, note, JSON.stringify(cartItems), totalPrice, city, phone]
    );
    client.release();

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
