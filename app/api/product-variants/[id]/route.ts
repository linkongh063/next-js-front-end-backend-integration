import { ProductVariantService } from '@/lib/services/product-variant.service';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const variant = await ProductVariantService.getVariantById(params.id);
  return variant
    ? NextResponse.json(variant)
    : NextResponse.json({ error: 'Variant not found' }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await ProductVariantService.updateVariant(params.id, body);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await ProductVariantService.deleteVariant(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
