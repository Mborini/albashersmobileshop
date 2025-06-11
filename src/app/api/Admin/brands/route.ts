import pool from "../../../lib/db"; // if using relative path

export async function GET() {
  try {
    const client = await pool.connect();
    

    const res = await client.query("SELECT * FROM brands");
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

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, image, isCommon } = body;

    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO brands (name, image,"isCommon") VALUES ($1, $2,$3) RETURNING *',
      [name, image, isCommon]
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
