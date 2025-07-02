import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function extractS3KeyFromUrl(s3Url: string): string | null {
  const bucket = process.env.AWS_S3_BUCKET_NAME!;
  const region = process.env.AWS_REGION!;
  const prefix = `https://${bucket}.s3.${region}.amazonaws.com/`;
  if (s3Url.startsWith(prefix)) {
    return s3Url.substring(prefix.length);
  }
  return null;
}

async function deleteFromS3(s3Url: string) {
  const key = extractS3KeyFromUrl(s3Url);
  if (!key) return;

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
      })
    );
    console.log("Deleted old image from S3:", key);
  } catch (error) {
    console.error("Error deleting old image from S3:", error);
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const { name, image, isCommon, oldImageUrl } = body;

  try {
    const client = await pool.connect();

    // إذا في صورة قديمة واللينك مختلف عن الصورة الجديدة
    if (oldImageUrl && oldImageUrl !== image) {
      // استخرج المفتاح من الرابط (key) لـ S3
      const bucket = process.env.AWS_S3_BUCKET_NAME!;
      const region = process.env.AWS_REGION!;
      const prefix = `https://${bucket}.s3.${region}.amazonaws.com/`;
      const oldKey = oldImageUrl.startsWith(prefix)
        ? oldImageUrl.replace(prefix, "")
        : null;

      if (oldKey) {
        // حذف الصورة القديمة من S3
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: bucket,
              Key: oldKey,
            })
          );
          console.log("✅ Deleted old image from S3:", oldKey);
        } catch (err) {
          console.error("❌ Failed to delete old image from S3:", err);
        }
      }
    }

    // تحديث بيانات البراند مع الرابط الجديد للصورة
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

    // تحقق من وجود منتجات مرتبطة
    const result = await client.query('SELECT COUNT(*) FROM "products" WHERE brand_id = $1', [id]);
    const count = parseInt(result.rows[0].count, 10);

    if (count > 0) {
      client.release();
      return new Response(
        JSON.stringify({ error: 'Cannot delete brand with existing products' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // جلب رابط الصورة من قاعدة البيانات
    const brandResult = await client.query('SELECT image FROM brands WHERE id = $1', [id]);
    const imageUrl = brandResult.rows[0]?.image;

    if (imageUrl) {
      const bucket = process.env.AWS_S3_BUCKET_NAME!;
      const region = process.env.AWS_REGION!;
      const prefix = `https://${bucket}.s3.${region}.amazonaws.com/`;
      const key = imageUrl.startsWith(prefix) ? imageUrl.replace(prefix, "") : null;

      if (key) {
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: bucket,
              Key: key,
            })
          );
          console.log("✅ Deleted brand image from S3:", key);
        } catch (s3Err) {
          console.error("❌ Failed to delete image from S3:", s3Err);
        }
      }
    }

    // حذف السجل من قاعدة البيانات
    await client.query('DELETE FROM brands WHERE id = $1', [id]);
    client.release();

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Delete Error:", error);
    return new Response(JSON.stringify({ error: "Cannot delete brand" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

