import { NextResponse } from 'next/server';
import { AttributeService } from '@/lib/services/attribute.service';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await AttributeService.getById(id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const updated = await AttributeService.update(id, body);
  return NextResponse.json(updated);
}

export async function PATCH(req: Request, ctx: any) {
  return PUT(req, ctx);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await AttributeService.delete(id);
  return NextResponse.json({ ok: true });
}
