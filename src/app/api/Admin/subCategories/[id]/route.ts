import { v2 as cloudinary } from 'cloudinary';
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
  const client = await pool.connect();

  try {
    // 1. تحقق من وجود منتجات مرتبطة
    const productResult = await client.query('SELECT COUNT(*) FROM "products" WHERE subcategory_id = $1', [id]);
    const count = parseInt(productResult.rows[0].count, 10);

    if (count > 0) {
      return new Response(
        JSON.stringify({ error: 'Cannot delete subcategory with existing products' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const subcategoryResult = await client.query('SELECT image FROM "subCategories" WHERE id = $1', [id]);
    const imageUrl = subcategoryResult.rows[0]?.image;

    if (imageUrl) {
      const publicId = extractPublicId(imageUrl);
      try {
        await cloudinary.uploader.destroy(publicId);
      
      } catch (cloudErr) {
        console.error('Cloudinary Deletion Error:', cloudErr);
      }
    }

    // 3. حذف السبكاتيجوري من قاعدة البيانات
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

