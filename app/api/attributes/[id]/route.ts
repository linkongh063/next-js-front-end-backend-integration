import { NextResponse } from 'next/server';
import { AttributeService } from '@/lib/services/attribute.service';

export async function GET(_: Request, context: any) {
  const { id } = context.params || {};
  const item = await AttributeService.getById(id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function POST(req: Request, context: any) {
  const { id } = context.params || {};
  const { value } = await req.json();
  console.log('id', id)
  console.log('value', value)
  
  if (!value?.trim()) return NextResponse.json({ error: "Value is required" }, { status: 400 });

  try {
    const updated = await AttributeService.addValue(id, value.trim());
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(req: Request, context: any) {
  const { id } = context.params || {};
  const body = await req.json();
  const updated = await AttributeService.update(id, body);
  return NextResponse.json(updated);
}

export async function PATCH(req: Request, context: any) {
  return PUT(req, context);
}

export async function DELETE(_: Request, context: any) {
  const { id } = context.params || {};
  await AttributeService.delete(id);
  return NextResponse.json({ ok: true });
}
