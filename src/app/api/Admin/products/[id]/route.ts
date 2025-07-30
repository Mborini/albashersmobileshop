import { NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
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
    in_stock,
    is_advertised,
  } = body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
// ✅ تحقق من حالة المنتج الحالي
const currentProductRes = await client.query(
  `SELECT is_advertised FROM products WHERE id = $1`,
  [id]
);

if (currentProductRes.rows.length === 0) {
  return new Response(JSON.stringify({ error: "Product not found." }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

const currentProduct = currentProductRes.rows[0];

// ✅ التحقق: إذا كان المنتج الحالي غير مُعلَن وتريد جعله مُعلَن
if (!currentProduct.is_advertised && is_advertised === true) {
  const countQuery = `
    SELECT COUNT(*) FROM products WHERE "is_advertised" = true;
  `;
  const countResult = await client.query(countQuery);
  const currentCount = parseInt(countResult.rows[0].count, 10);

  // ✅ إذا كان العدد الحالي 8 أو أكثر، ارفض
  if (currentCount >= 8) {
    await client.query("ROLLBACK");
    return new Response(
      JSON.stringify({
        error: "Cannot advertise product. Maximum of 8 advertised products allowed.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

    // ✅ التحديث بعد التحقق
    const updateProductQuery = `
      UPDATE products
      SET title = $1, brand_id = $2, description = $3, price = $4, "discountedPrice" = $5,
          "is_new_arrival" = $6, "is_best_offer" = $7, "in_stock" = $8, "is_advertised" = $9
      WHERE id = $10
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
      in_stock,
      is_advertised,
      id,
    ]);

    await client.query("COMMIT");

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating product:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update product." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    client.release();
  }
}


function extractPublicId(imageUrl: string) {
  const parts = imageUrl.split("/");
  const folderAndId = parts.slice(-2).join("/").split(".")[0];
  return folderAndId;
}
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// دالة لاستخراج المفتاح من رابط S3
function extractS3KeyFromUrl(s3Url: string): string | null {
  const bucket = process.env.AWS_S3_BUCKET_NAME!;
  const region = process.env.AWS_REGION!;
  const prefix = `https://${bucket}.s3.${region}.amazonaws.com/`;
  if (s3Url.startsWith(prefix)) {
    return s3Url.replace(prefix, "");
  }
  return null;
}

// دالة لحذف صورة من S3
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
  } catch (error) {
    console.error("❌ Failed to delete from S3:", error);
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. جلب روابط الصور من قاعدة البيانات قبل الحذف
    const imagesResult = await client.query(
      "SELECT image_url FROM product_images WHERE product_id = $1",
      [id]
    );
    const imageUrls: string[] = imagesResult.rows.map((row) => row.image_url);

    // 2. حذف الصور من S3
    for (const url of imageUrls) {
      await deleteFromS3(url);
    }

    // 3. حذف السجلات المرتبطة في قاعدة البيانات
    await client.query("DELETE FROM product_images WHERE product_id = $1", [
      id,
    ]);
    await client.query("DELETE FROM product_attributes WHERE product_id = $1", [
      id,
    ]);
    await client.query("DELETE FROM products WHERE id = $1", [id]);

    await client.query("COMMIT");

    return new Response(
      JSON.stringify({ message: "Product and images deleted successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting product:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete product." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    client.release();
  }
}
