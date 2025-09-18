import { ProductVariantService } from '@/lib/services/product-variant.service';
import { NextResponse } from 'next/server';

export async function GET(_: Request, context: any) {
  const { id } = context.params || {};
  const variant = await ProductVariantService.getVariantById(id);
  return variant
    ? NextResponse.json(variant)
    : NextResponse.json({ error: 'Variant not found' }, { status: 404 });
}

export async function PATCH(req: Request, context: any) {
  try {
    const { id } = context.params || {};
    const body = await req.json();
    const updated = await ProductVariantService.updateVariant(id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating product variant:', error);
    return NextResponse.json(
      { error: 'Failed to update product variant', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = context.params || {};
    const body = await req.json();
    const updated = await ProductVariantService.updateVariant(id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating product variant:', error);
    return NextResponse.json(
      { error: 'Failed to update product variant', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: any) {
  try {
    const { id } = context.params || {};
    await ProductVariantService.deleteVariant(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    console.error('Error deleting product variant:', error);
    return NextResponse.json(
      { error: 'Failed to delete product variant', details: error.message },
      { status: 500 }
    );
  }
}
