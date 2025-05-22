import pool from '../../../../lib/db'; // if using relative path

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
  
    const body = await req.json();
    const { name, image } = body;
  
    try {
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE categories SET name = $1, image = $2 WHERE id = $3 RETURNING *',
        [name, image, id]
      );
      client.release();
  
      return new Response(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Update Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to update category' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
  
    try {
      const client = await pool.connect();
  
      // تحقق إذا فيه مجموعات فرعية مرتبطة
      const checkRes = await client.query(
        'SELECT COUNT(*) FROM "subCategories" WHERE category_id = $1',
        [id]
      );
  
      const count = parseInt(checkRes.rows[0].count, 10);
  
      if (count > 0) {
        client.release();
        return new Response(JSON.stringify({ error: 'This Category has Subcategories , Plese delete them first' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // إذا ما في مجموعات فرعية، احذف الكاتيجوري
      await client.query('DELETE FROM categories WHERE id = $1', [id]);
      client.release();
  
      return new Response(null, { status: 204 }); // No Content
    } catch (error) {
      console.error('Delete Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to delete category' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  