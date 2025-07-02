import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// استخراج اسم الملف من رابط S3
function extractS3KeyFromUrl(s3Url: string): string | null {
  const bucket = process.env.AWS_S3_BUCKET_NAME!;
  const region = process.env.AWS_REGION!;
  const prefix = `https://${bucket}.s3.${region}.amazonaws.com/`;
  return s3Url.startsWith(prefix) ? s3Url.replace(prefix, "") : null;
}

// حذف الصورة من S3
async function deleteFromS3(s3Url: string) {
  const key = extractS3KeyFromUrl(s3Url);
  if (!key) return;

  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    }));
    console.log("✅ Deleted old image from S3:", key);
  } catch (error) {
    console.error("❌ Failed to delete old image from S3:", error);
  }
}

// رفع الصورة
async function uploadToS3(fileBuffer: Buffer, bucketName: string, key: string) {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: "image/jpeg", // عدل حسب نوع الصورة لو ضروري
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("❌ Error uploading to S3:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const oldImageUrl = formData.get("oldImageUrl") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // حذف الصورة القديمة أولاً إذا كانت موجودة
    if (oldImageUrl) {
      console.log("🧹 Trying to delete old image:", oldImageUrl);
      await deleteFromS3(oldImageUrl);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucketName = process.env.AWS_S3_BUCKET_NAME!;
    const fileName = `${folder}/${Date.now()}_${file.name}`;

    console.log("📤 Uploading to S3 as:", fileName);

    const s3Url = await uploadToS3(buffer, bucketName, fileName);

    return NextResponse.json({ s3Url });
  } catch (error) {
    console.error("🔥 Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: (error as Error).message },
      { status: 500 }
    );
  }
}

