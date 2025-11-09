import { Cloudinary } from '@cloudinary/url-builder';

// Initialize Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});

// Helper function to get image URL
interface GetImageUrlOptions {
  publicId: string;
  width?: number;
  height?: number;
  crop?: string;
  quality?: number;
}

export function getImageUrl({
  publicId,
  width = 800,
  height = 600,
  crop = 'fill',
  quality = 80,
}: GetImageUrlOptions): string {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_${crop},w_${width},h_${height},q_${quality}/${publicId}`;
}
