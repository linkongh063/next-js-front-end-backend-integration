import { NextResponse } from 'next/server';
import { ProductImageService } from '@/lib/services/product-image.service';
import { unlink } from 'fs/promises';
import path from 'path';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const image = await ProductImageService.getImageById(id);
  if (!image) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  return NextResponse.json(image);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updatedImage = await ProductImageService.updateImage(id, body);

    // Serialize date
    const serialized = {
      ...updatedImage,
      createdAt: updatedImage.createdAt.toISOString(),
    };

    return NextResponse.json(serialized);
  } catch (error: any) {
    console.error('Error updating product image:', error);
    return NextResponse.json(
      { error: 'Failed to update product image', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updatedImage = await ProductImageService.updateImage(id, body);

    // Serialize date
    const serialized = {
      ...updatedImage,
      createdAt: updatedImage.createdAt.toISOString(),
    };

    return NextResponse.json(serialized);
  } catch (error: any) {
    console.error('Error updating product image:', error);
    return NextResponse.json(
      { error: 'Failed to update product image', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // First get the image to retrieve the imageUrl before deleting
    const image = await ProductImageService.getImageById(id);
    
    if (image) {
      // Delete from database
      await ProductImageService.deleteImage(id);
      
      // Delete physical file
      try {
        const filename = path.basename(image.imageUrl);
        const filepath = path.join(process.cwd(), 'public', 'uploads', 'products', filename);
        
        await unlink(filepath);
      } catch (fileError: any) {
        // File might not exist, which is okay
        if (fileError.code !== 'ENOENT') {
          console.error('Error deleting physical file:', fileError);
        }
        // Continue even if file deletion fails
      }
    }
    
    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    console.error('Error deleting product image:', error);
    return NextResponse.json(
      { error: 'Failed to delete product image', details: error.message },
      { status: 500 }
    );
  }
}
