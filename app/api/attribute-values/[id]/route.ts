import { NextResponse } from 'next/server';
import { AttributeValueService } from '@/lib/services/attribute-value.service';

export async function GET(_: Request, context: any) {
  const { id } = context.params || {};
  const item = await AttributeValueService.getById(id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, context: any) {
  const { id } = context.params || {};
  const body = await req.json();
  const updated = await AttributeValueService.update(id, body);
  return NextResponse.json(updated);
}

export async function PATCH(req: Request, ctx: any) {
  return PUT(req, ctx);
}

export async function DELETE(_: Request, context: any) {
  const { id } = context.params || {};
  await AttributeValueService.delete(id);
  return NextResponse.json({ ok: true });
}
