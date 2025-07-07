import pool from "@/app/lib/db";

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM delivery_prices ORDER BY created_at DESC LIMIT 1');

    const data = result.rows.length > 0 ? result.rows[0] : null;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('GET delivery_prices error:', err);
    return new Response(JSON.stringify({ message: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req: Request) {
  try {
    const {
      id,
      lessThanX,
      priceLtX,
      betweenFrom,
      betweenTo,
      priceBetween,
      greaterOrEqualZ,
      priceGeZ,
    } = await req.json();

    if (id) {
      // Update
      await pool.query(
        `
        UPDATE delivery_prices
        SET 
          less_than_x = $1,
          price_lt_x = $2,
          between_x_z_from = $3,
          between_x_z_to = $4,
          price_between = $5,
          greater_equal_z = $6,
          price_ge_z = $7
        WHERE id = $8
      `,
        [
          lessThanX,
          priceLtX,
          betweenFrom,
          betweenTo,
          priceBetween,
          greaterOrEqualZ,
          priceGeZ,
          id,
        ]
      );
    } else {
      // Insert
      await pool.query(
        `
        INSERT INTO delivery_prices (
          less_than_x, price_lt_x,
          between_x_z_from, between_x_z_to, price_between,
          greater_equal_z, price_ge_z
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          lessThanX,
          priceLtX,
          betweenFrom,
          betweenTo,
          priceBetween,
          greaterOrEqualZ,
          priceGeZ,
        ]
      );
    }

    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('POST delivery_prices error:', err);
    return new Response(JSON.stringify({ message: 'Failed to save' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
