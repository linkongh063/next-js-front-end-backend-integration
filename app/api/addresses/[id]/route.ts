import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
  req: NextRequest,
  context: any
) {
  try {
    const { id } = context.params || {};
    const session = await auth();
    const email = session?.user?.email ?? undefined;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email } });
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = body || {};

    // Ensure ownership
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== dbUser.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (isDefault === true) {
      await prisma.address.updateMany({ where: { userId: dbUser.id, isDefault: true }, data: { isDefault: false } });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        ...(fullName != null ? { fullName: String(fullName) } : {}),
        ...(phone != null ? { phone: String(phone) } : {}),
        ...(addressLine1 != null ? { addressLine1: String(addressLine1) } : {}),
        ...(addressLine2 !== undefined ? { addressLine2: addressLine2 ? String(addressLine2) : null } : {}),
        ...(city != null ? { city: String(city) } : {}),
        ...(state != null ? { state: String(state) } : {}),
        ...(postalCode != null ? { postalCode: String(postalCode) } : {}),
        ...(country != null ? { country: String(country) } : {}),
        ...(isDefault != null ? { isDefault: Boolean(isDefault) } : {}),
      },
    });

    return NextResponse.json({ ok: true, address: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: any
) {
  try {
    const { id } = context.params || {};
    const session = await auth();
    const email = session?.user?.email ?? undefined;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email } });
    if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure ownership
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== dbUser.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
