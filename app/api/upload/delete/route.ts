import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  await connectDB();
  
  try {
    // Verify authentication
    const cookie = request.headers.get('cookie')?.split('; ').find(c => c.startsWith('connectrix-token='))?.split('=')[1];
    if (!cookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(cookie);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ error: 'No public ID provided' }, { status: 400 });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true
    });

    if (result.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}
