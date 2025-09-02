import { ProductService } from '@/lib/services/product.service';
import { NextResponse } from 'next/server';

export async function GET() {
  const products = await ProductService.getProducts();
  console.log('products from controller',products)
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newProduct = await ProductService.createProduct(body);
  return NextResponse.json(newProduct, { status: 201 });
}
