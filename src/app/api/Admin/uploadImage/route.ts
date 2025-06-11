import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicId(imageUrl: string) {
  // مثال URL: https://res.cloudinary.com/demo/image/upload/v1234567890/subcategories/abc123.jpg
  const parts = imageUrl.split('/');
  const folderAndId = parts.slice(-2).join('/').split('.')[0]; // subcategories/abc123
  return folderAndId;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob;
  const oldImageUrl = formData.get('oldImageUrl') as string | null;
    const folder = formData.get('folder') as string ; // Default to 'subcategories' if not provided
  if (!file) {
    return NextResponse.json({ message: 'No file provided' }, { status: 400 });
  }

  // إذا في صورة قديمة، نحذفها أولاً
  if (oldImageUrl) {
    const publicId = extractPublicId(oldImageUrl);
    try {
      await cloudinary.uploader.destroy(publicId);
     
    } catch (error) {
      console.error('Error deleting old image:', error);
    }
  }

  // رفع الصورة الجديدة
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error || !result) {
          console.error(error);
          resolve(NextResponse.json({ message: 'Upload failed' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ url: result.secure_url }));
        }
      }
    );
    stream.end(buffer);
  });
}
