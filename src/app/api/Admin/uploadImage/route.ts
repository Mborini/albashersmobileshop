import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

function extractPublicId(imageUrl: string) {
  const afterUpload = imageUrl.split("/upload/")[1];
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  const publicId = withoutVersion.split(".")[0];
  return publicId;
}

async function deleteOldMedia(oldMediaUrl: string | null) {
  if (!oldMediaUrl) return null;

  const publicId = extractPublicId(oldMediaUrl);

  // تحديد نوع المورد بناءً على امتداد الملف
  let resourceType: "image" | "video" = "image";
  if (oldMediaUrl.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/i)) {
    resourceType = "video";
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error("Error deleting old media:", error);
    return null;
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const oldImageUrl = formData.get("oldImageUrl") as string | null;
  const folder = (formData.get("folder") as string) || "Ads";


  if (oldImageUrl) {
    await deleteOldMedia(oldImageUrl);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    cloudinary.config().api_secret!
  );

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: cloudinary.config().api_key,
    cloudName: cloudinary.config().cloud_name,
    folder,
  });
}
