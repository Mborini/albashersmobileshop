import pool from '../../../../lib/db'; // if using relative path
import { v2 as cloudinary } from 'cloudinary';

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
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  function extractPublicId(imageUrl: string) {
    const parts = imageUrl.split('/');
    const folderAndId = parts.slice(-2).join('/').split('.')[0];
    return folderAndId;
  }
  
  export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
  
    try {
      const client = await pool.connect();
  
      const checkRes = await client.query(
        'SELECT COUNT(*) FROM "subCategories" WHERE category_id = $1',
        [id]
      );
  
      const count = parseInt(checkRes.rows[0].count, 10);
  
      if (count > 0) {
        client.release();
        return new Response(
          JSON.stringify({ error: 'This Category has Subcategories, please delete them first' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
  
      const categoryResult = await client.query('SELECT image FROM categories WHERE id = $1', [id]);
      const imageUrl = categoryResult.rows[0]?.image;
  
      if (imageUrl) {
        const publicId = extractPublicId(imageUrl);
        try {
          await cloudinary.uploader.destroy(publicId);
         
        } catch (cloudErr) {
          console.error('Cloudinary Deletion Error:', cloudErr);
        }
      }
  
      // حذف الكاتيجوري
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
  
  