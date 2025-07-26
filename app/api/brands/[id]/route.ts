import { BrandService } from '@/lib/services/brand.service';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const brand = await BrandService.getBrandById(params.id);
  return brand
    ? NextResponse.json(brand)
    : NextResponse.json({ error: 'Brand not found' }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updated = await BrandService.updateBrand(params.id, data);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await BrandService.deleteBrand(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
