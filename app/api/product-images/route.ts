import { NextResponse } from 'next/server';
import { ProductImageService } from '@/lib/services/product-image.service';

export async function GET() {
  const images = await ProductImageService.getAllImages();
  return NextResponse.json(images);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newImage = await ProductImageService.createImage(body);

  // Serialize dates to string if needed
  const serialized = {
    ...newImage,
    createdAt: newImage.createdAt.toISOString(),
  };

  return NextResponse.json(serialized, { status: 201 });
}
