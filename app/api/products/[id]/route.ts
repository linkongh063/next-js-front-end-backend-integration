import { ProductService } from '@/lib/services/product.service';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await ProductService.getProductById(params.id);
  return product
    ? NextResponse.json(product)
    : NextResponse.json({ error: 'Product not found' }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updated = await ProductService.updateProduct(params.id, data);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await ProductService.deleteProduct(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
