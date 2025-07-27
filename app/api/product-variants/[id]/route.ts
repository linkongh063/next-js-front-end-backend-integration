import { ProductVariantService } from '@/lib/services/product-variant.service';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const variant = await ProductVariantService.getVariantById(id);
  return variant
    ? NextResponse.json(variant)
    : NextResponse.json({ error: 'Variant not found' }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await ProductVariantService.updateVariant(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product variant:', error);
    return NextResponse.json(
      { error: 'Failed to update product variant', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await ProductVariantService.updateVariant(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product variant:', error);
    return NextResponse.json(
      { error: 'Failed to update product variant', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await ProductVariantService.deleteVariant(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting product variant:', error);
    return NextResponse.json(
      { error: 'Failed to delete product variant', details: error.message },
      { status: 500 }
    );
  }
}
