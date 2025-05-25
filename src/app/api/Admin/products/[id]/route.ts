import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await req.json();
  const { name, image, isCommon } = body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE brands SET name = $1, image = $2, "isCommon" = $3 WHERE id = $4 RETURNING *',
      [name, image, isCommon, id]
    );
    client.release();

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update brand' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const client = await pool.connect();

    // أولاً نتأكد إذا في منتجات بنفس الـ brand id
    const result = await client.query('SELECT COUNT(*) FROM "products" WHERE brand_id = $1', [id]);
    const count = parseInt(result.rows[0].count, 10);

    if (count > 0) {
      client.release();
      return new Response(JSON.stringify({ error: 'Cannot delete brand with existing products' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // إذا ما في منتجات، نمسح البراند
    await client.query('DELETE FROM "brands" WHERE id = $1', [id]);
    client.release();

    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Delete Error:', error);
    return new Response(JSON.stringify({ error: 'Cannot delete brand' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

