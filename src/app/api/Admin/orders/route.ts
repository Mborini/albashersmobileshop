import pool from '../../../lib/db'; // if using relative path

export async function GET() {
    try {
      const client = await pool.connect();
      console.log('Connected to DB');
  
      const res = await client.query('SELECT * FROM checkouts ORDER BY id ASC');
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
