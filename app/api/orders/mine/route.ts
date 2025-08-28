import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const cuser = await currentUser();
    const email = cuser?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure DB user exists
    const dbUser = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: cuser?.fullName || cuser?.firstName || email,
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
