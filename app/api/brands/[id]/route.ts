import { BrandService } from '@/lib/services/brand.service';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await BrandService.getBrandById(id);
  return brand
    ? NextResponse.json(brand)
    : NextResponse.json({ error: 'Brand not found' }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const updated = await BrandService.updateBrand(id, data);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await BrandService.deleteBrand(id);
  return NextResponse.json({ message: 'Deleted' });
}
