import { NextResponse } from 'next/server';
import { AttributeService } from '@/lib/services/attribute.service';

export async function GET() {
  const items = await AttributeService.getAll();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await AttributeService.create(body);
  return NextResponse.json(created, { status: 201 });
}
