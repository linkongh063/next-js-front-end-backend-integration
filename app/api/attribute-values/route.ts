import { NextResponse } from 'next/server';
import { AttributeValueService } from '@/lib/services/attribute-value.service';

export async function GET() {
  const items = await AttributeValueService.getAll();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await AttributeValueService.create(body);
  return NextResponse.json(created, { status: 201 });
}
