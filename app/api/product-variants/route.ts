import { ProductVariantService } from '@/lib/services/product-variant.service';
import { NextResponse } from 'next/server';

export async function GET() {
    const variants = await ProductVariantService.getVariants();
    return NextResponse.json(variants);
}

export async function POST(req: Request) {
    const body = await req.json();
    console.log('body', body)
    const newVariant = await ProductVariantService.createVariant(body);
    console.log('new varient', newVariant)
    return NextResponse.json(newVariant, { status: 201 });
}
