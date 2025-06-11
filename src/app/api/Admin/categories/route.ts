import pool from '../../../lib/db'; // if using relative path

export async function GET() {
    try {
      const client = await pool.connect();
   
  
      const res = await client.query('SELECT * FROM categories');
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

  export async function POST(req) {
    try {
      const body = await req.json();
      const { name, image } = body;
  
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO categories (name, image) VALUES ($1, $2) RETURNING *',
        [name, image]
      );
      client.release();
  
      return new Response(JSON.stringify(result.rows[0]), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("POST Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    }
 
  