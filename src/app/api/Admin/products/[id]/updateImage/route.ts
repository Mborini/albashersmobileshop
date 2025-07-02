import pool from "../../../../../lib/db";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params.id;

  const body = await req.json();
  const { image } = body;

  if (!id || !image) {
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = await pool.connect();

  try {
    const productCheck = await client.query("SELECT id FROM products WHERE id = $1", [id]);

    if (productCheck.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await client.query(
      "INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)",
      [id, image]
    );

    const allImagesResult = await client.query(
      "SELECT id, image_url FROM product_images WHERE product_id = $1 ORDER BY id",
      [id]
    );

    return new Response(JSON.stringify({ success: true, product_images: allImagesResult.rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding product image:", error);
    return new Response(
      JSON.stringify({
        error: "Database error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    client.release();
  }
}

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function deleteFromS3(s3Url: string) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const region = process.env.AWS_REGION!;
  const prefix = `https://${bucketName}.s3.${region}.amazonaws.com/`;
  const key = s3Url.startsWith(prefix) ? s3Url.replace(prefix, "") : null;

  if (!key) return;

  const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
  try {
    await s3.send(command);
    console.log("✅ Deleted from S3:", key);
  } catch (err) {
    console.error("❌ Failed to delete from S3:", err);
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const imageId = params.id;

  if (!imageId) {
    return new Response(JSON.stringify({ error: "Missing image ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = await pool.connect();

  try {
    const imageCheck = await client.query(
      "SELECT product_id, image_url FROM product_images WHERE id = $1",
      [imageId]
    );

    if (imageCheck.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Image not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { product_id: productId, image_url: imageUrl } = imageCheck.rows[0];

    await client.query("DELETE FROM product_images WHERE id = $1", [imageId]);

    if (imageUrl) await deleteFromS3(imageUrl);

    const allImagesResult = await client.query(
      "SELECT id, image_url FROM product_images WHERE product_id = $1 ORDER BY id",
      [productId]
    );

    return new Response(JSON.stringify({ success: true, images: allImagesResult.rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    return new Response(
      JSON.stringify({
        error: "Database error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    client.release();
  }
}

