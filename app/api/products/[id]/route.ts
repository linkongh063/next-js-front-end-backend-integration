import { ProductService } from '@/lib/services/product.service';
import { NextResponse } from 'next/server';

export async function GET(_: Request, context: any) {
  const { id } = context.params || {};
  const product = await ProductService.getProductById(id);
  return product
    ? NextResponse.json(product)
    : NextResponse.json({ error: 'Product not found' }, { status: 404 });
}

export async function PATCH(req: Request, context: any) {
  try {
    const { id } = context.params || {};
    const data = await req.json();
    const updated = await ProductService.updateProduct(id, data);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const { id } = context.params || {};
    const data = await req.json();
    const updated = await ProductService.updateProduct(id, data);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: any) {
  const { id } = context.params || {};
  await ProductService.deleteProduct(id);
  return NextResponse.json({ message: 'Deleted' });
}
