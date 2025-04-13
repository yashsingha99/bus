import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinery';
import streamifier from 'streamifier';

interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: unknown;
}

// This is a workaround for handling file uploads in Next.js App Router
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const streamUpload = () =>
      new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result as CloudinaryUploadResult);
          else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });

    const result = await streamUpload();
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
