import pool from '../../../../../lib/db';

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const id = params.id;
  
    const body = await req.json();
    const { image } = body;
  console.log('Received request to add image for product ID:', id, 'with image URL:', image);
  
    if (!id || !image) {
      return new Response(JSON.stringify({ error: 'Invalid request data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    const client = await pool.connect();
  
    try {
      // Check product exists
      const productCheck = await client.query(
        'SELECT id FROM products WHERE id = $1',
        [id]
      );
  
      if (productCheck.rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Product not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Insert new image
      const result = await client.query(
        'INSERT INTO product_images (product_id, image_url) VALUES ($1, $2) RETURNING *',
        [id, image]
      );
  
      // Fetch all images
      const allImagesResult = await client.query(
        'SELECT id, image_url FROM product_images WHERE product_id = $1 ORDER BY id',
        [id]
      );
  
      return new Response(
        JSON.stringify({
          success: true,
          product_images: allImagesResult.rows,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Error adding product image:', error);
      return new Response(
        JSON.stringify({
          error: 'Database error',
          details: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
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
    const params = await context.params;
    const imageId = params.id;
  
    if (!imageId) {
      return new Response(JSON.stringify({ error: 'Missing image ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    const client = await pool.connect();
  
    try {
      // استرجاع بيانات الصورة
      const imageCheck = await client.query(
        'SELECT product_id, image_url FROM product_images WHERE id = $1',
        [imageId]
      );
  
      if (imageCheck.rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Image not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const { product_id: productId, image_url: imageUrl } = imageCheck.rows[0];
  
      // حذف الصورة من قاعدة البيانات
      await client.query('DELETE FROM product_images WHERE id = $1', [imageId]);
  
      // حذف الصورة من Cloudinary
      if (imageUrl) {
        const publicId = extractPublicId(imageUrl);
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.error('Cloudinary Deletion Error:', cloudErr);
        }
      }
  
      // إرجاع الصور المتبقية
      const allImagesResult = await client.query(
        'SELECT id, image_url FROM product_images WHERE product_id = $1 ORDER BY id',
        [productId]
      );
  
      return new Response(
        JSON.stringify({
          success: true,
          images: allImagesResult.rows,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Error deleting product image:', error);
      return new Response(
        JSON.stringify({
          error: 'Database error',
          details: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } finally {
      client.release();
    }
  }
  
  