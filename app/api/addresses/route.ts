import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email ?? undefined;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: session?.user?.name || email,
        password: "",
      },
      update: {},
    });

    const addresses = await prisma.address.findMany({ where: { userId: dbUser.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ addresses });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email ?? undefined;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: session?.user?.name || email,
        password: "",
      },
      update: {},
    });

    const body = await req.json();
    const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = body || {};
    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode || !country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // If setting default, unset others
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: dbUser.id, isDefault: true }, data: { isDefault: false } });
    }

    const created = await prisma.address.create({
      data: {
        userId: dbUser.id,
        fullName,
        phone,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        postalCode,
        country,
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json({ ok: true, address: created });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
