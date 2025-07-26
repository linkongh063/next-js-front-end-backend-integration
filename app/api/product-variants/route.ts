import { ProductVariantService } from '@/lib/services/product-variant.service';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const variants = await ProductVariantService.getVariants();
        return NextResponse.json(variants);
    } catch (error) {
        console.error('Error fetching product variants:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product variants', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newVariant = await ProductVariantService.createVariant(body);
        return NextResponse.json(newVariant, { status: 201 });
    } catch (error) {
        console.error('Error creating product variant:', error);
        return NextResponse.json(
            { error: 'Failed to create product variant', details: error.message },
            { status: 500 }
        );
    }
}
