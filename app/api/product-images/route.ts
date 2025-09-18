import { NextResponse } from 'next/server';
import { ProductImageService } from '@/lib/services/product-image.service';

export async function GET() {
  try {
    const images = await ProductImageService.getAllImages();
    return NextResponse.json(images);
  } catch (error: any) {
    console.error('Error fetching product images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product images', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newImage = await ProductImageService.createImage(body);

    // Serialize dates to string if needed
    const serialized = {
      ...newImage,
      createdAt: newImage.createdAt.toISOString(),
    };

    return NextResponse.json(serialized, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product image:', error);
    return NextResponse.json(
      { error: 'Failed to create product image', details: error.message },
      { status: 500 }
    );
  }
}
