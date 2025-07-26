import { NextResponse } from 'next/server';
import { ProductImageService } from '@/lib/services/product-image.service';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const image = await ProductImageService.getImageById(params.id);
  if (!image) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  return NextResponse.json(image);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updatedImage = await ProductImageService.updateImage(params.id, body);

  // Serialize date
  const serialized = {
    ...updatedImage,
    createdAt: updatedImage.createdAt.toISOString(),
  };

  return NextResponse.json(serialized);
}


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await ProductImageService.deleteImage(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
