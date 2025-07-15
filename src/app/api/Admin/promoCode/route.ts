import pool from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET() {
  const client = await pool.connect();
  const res = await client.query(`SELECT promo_codes.*, b.name as brand_name 
FROM promo_codes 
INNER JOIN brands as b ON "promo_codes"."brandId" = b.id
`);
  client.release();

  return new Response(JSON.stringify(res.rows), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const { name, discount, brandId } = await req.json();

  if (!name || discount === undefined || !brandId) {
    return new Response(
      JSON.stringify({ error: "Name and discount are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const client = await pool.connect();
  const result = await client.query(
    `INSERT INTO promo_codes (name, discount, "brandId") VALUES ($1, $2, $3) RETURNING *`,
    [name, discount, brandId]
  );
  client.release();

  return new Response(JSON.stringify(result.rows[0]), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, discount, brandId } = await req.json();

    if (!id || !name || discount === undefined || !brandId) {
      return new Response(
        JSON.stringify({ error: "ID, name, discount, and brandId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await pool.connect();

    const result = await client.query(
      `UPDATE promo_codes 
       SET name = $1, discount = $2, "brandId" = $3 
       WHERE id = $4 
       RETURNING *`,
      [name, discount, brandId, id]
    );

    client.release();

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: "Promo code not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

