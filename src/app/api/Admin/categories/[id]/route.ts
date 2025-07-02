import pool from "../../../../lib/db";
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
  return s3Url.startsWith(prefix) ? s3Url.replace(prefix, "") : null;
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
    console.log("✅ Deleted from S3:", key);
  } catch (err) {
    console.error("❌ Failed to delete from S3:", err);
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const { name, image } = body;

  try {
    const client = await pool.connect();

    // 1. جلب الصورة القديمة
    const oldImageResult = await client.query('SELECT image FROM categories WHERE id = $1', [id]);
    const oldImageUrl = oldImageResult.rows[0]?.image;

    // 2. تحديث الداتا
    const result = await client.query(
      'UPDATE categories SET name = $1, image = $2 WHERE id = $3 RETURNING *',
      [name, image, id]
    );

    client.release();

    // 3. حذف الصورة القديمة إذا كانت مختلفة
    if (oldImageUrl && oldImageUrl !== image) {
      await deleteFromS3(oldImageUrl);
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Update Error:", error);
    return new Response(JSON.stringify({ error: "Failed to update category" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
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
        JSON.stringify({ error: "This Category has Subcategories, please delete them first" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const categoryResult = await client.query('SELECT image FROM categories WHERE id = $1', [id]);
    const imageUrl = categoryResult.rows[0]?.image;

    if (imageUrl) {
      await deleteFromS3(imageUrl);
    }

    await client.query('DELETE FROM categories WHERE id = $1', [id]);
    client.release();

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Delete Error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete category" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
