import { BrandService } from '@/lib/services/brand.service';
import { NextResponse } from 'next/server';

export async function GET() {
    const brands = await BrandService.getBrands();
    console.log('888 Fetched brands:', brands.length);
    return NextResponse.json(brands);
}

export async function POST(req: Request) {
    const body = await req.json();
    console.log('@@@@POST body:', body);
    const newBrand = await BrandService.createBrand(body);
    console.log('%%%New brand created:', newBrand);
    return NextResponse.json(newBrand, { status: 201 });
}
