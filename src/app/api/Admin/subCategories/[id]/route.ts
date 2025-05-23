import pool from '../../../../lib/db';

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const { name, image, category_id } = body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE "subCategories" SET name = $1, image = $2, category_id = $3 WHERE id = $4 RETURNING *',
      [name, image, category_id, id]
    );
    client.release();

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update subcategory' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const client = await pool.connect();

  try {
    const result = await client.query('SELECT COUNT(*) FROM "products" WHERE subcategory_id = $1', [id]);
    const count = parseInt(result.rows[0].count, 10);

    if (count > 0) {
      return new Response(
        JSON.stringify({ error: 'Cannot delete subcategory with existing products' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await client.query('DELETE FROM "subCategories" WHERE id = $1', [id]);

    return new Response(null, { status: 204 }); 
  } catch (error) {
    console.error('Delete Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete subcategory' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    client.release(); 
  }
}

