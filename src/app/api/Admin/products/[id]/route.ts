import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const {
    title,
    brand_id,
    description,
    price,
    discountedPrice,
    is_new_arrival,
    is_best_offer,
  } = body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); 

    const updateProductQuery = `
      UPDATE products
      SET title = $1, brand_id = $2, description = $3, price = $4, "discountedPrice" = $5, "is_new_arrival" = $6, "is_best_offer" = $7
      WHERE id = $8
      RETURNING *;
    `;
    const result = await client.query(updateProductQuery, [
      title,
      brand_id,
      description,
      price,
      discountedPrice,
      is_new_arrival,
      is_best_offer, 
      id,

    ]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Product not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await client.query('COMMIT'); 
    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ error: 'Failed to update product.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    client.release(); 
  }
}
import { v2 as cloudinary } from 'cloudinary';

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
    await client.query('BEGIN');

    // 1. جلب روابط الصور قبل حذفها
    const imagesResult = await client.query(
      'SELECT image_url FROM product_images WHERE product_id = $1',
      [id]
    );
    const imageUrls: string[] = imagesResult.rows.map((row) => row.image_url);

    // 2. حذف الصور من Cloudinary
    for (const url of imageUrls) {
      const publicId = extractPublicId(url);
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error('Cloudinary Deletion Error:', cloudErr);
      }
    }

    // 3. حذف الصور من قاعدة البيانات
    await client.query('DELETE FROM product_images WHERE product_id = $1', [id]);

    // 4. حذف الخصائص المرتبطة
    await client.query('DELETE FROM product_attributes WHERE product_id = $1', [id]);

    // 5. حذف المنتج نفسه
    await client.query('DELETE FROM products WHERE id = $1', [id]);

    await client.query('COMMIT');

    return new Response(JSON.stringify({ message: 'Product and images deleted successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete product.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    client.release();
  }
}
