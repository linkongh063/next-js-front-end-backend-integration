import { ProductVariantService } from '@/lib/services/product-variant.service';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const variant = await ProductVariantService.getVariantById(params.id);
  return variant
    ? NextResponse.json(variant)
    : NextResponse.json({ error: 'Variant not found' }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await ProductVariantService.updateVariant(params.id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product variant:', error);
    return NextResponse.json(
      { error: 'Failed to update product variant', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await ProductVariantService.updateVariant(params.id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product variant:', error);
    return NextResponse.json(
      { error: 'Failed to update product variant', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await ProductVariantService.deleteVariant(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting product variant:', error);
    return NextResponse.json(
      { error: 'Failed to delete product variant', details: error.message },
      { status: 500 }
    );
  }
}
