import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
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
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

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

    const result = await client.query('SELECT COUNT(*) FROM "products" WHERE brand_id = $1', [id]);
    const count = parseInt(result.rows[0].count, 10);

    if (count > 0) {
      client.release();
      return new Response(
        JSON.stringify({ error: 'Cannot delete brand with existing products' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const brandResult = await client.query('SELECT image FROM brands WHERE id = $1', [id]);
    const imageUrl = brandResult.rows[0]?.image;

    if (imageUrl) {
      const publicId = extractPublicId(imageUrl);
      try {
        await cloudinary.uploader.destroy(publicId);
        
      } catch (cloudErr) {
        console.error('Cloudinary Deletion Error:', cloudErr);
      }
    }

    // حذف البراند
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