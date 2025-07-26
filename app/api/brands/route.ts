import { BrandService } from '@/lib/services/brand.service';
import { NextResponse } from 'next/server';

export async function GET() {
    const brands = await BrandService.getBrands();
    return NextResponse.json(brands);
}

export async function POST(req: Request) {
    const body = await req.json();
    const newBrand = await BrandService.createBrand(body);
    return NextResponse.json(newBrand, { status: 201 });
}
