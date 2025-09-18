import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email ?? undefined;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure DB user exists
    const dbUser = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: session?.user?.name || email,
        password: "",
      },
      update: {},
    });

    const orders = await prisma.order.findMany({
      where: { userId: dbUser.id },
      orderBy: { placedAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
