import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session as any)?.user?.role;
    if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 10)));
    const status = (searchParams.get("status") || "").toUpperCase() as OrderStatus | "";
    const q = (searchParams.get("q") || "").trim();

    const statusFilter = status && [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ].includes(status)
      ? { status }
      : {};

    const searchFilter = q
      ? {
          OR: [
            { orderNumber: { contains: q, mode: "insensitive" } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { user: { name: { contains: q, mode: "insensitive" } } },
            { address: { fullName: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {};

    const where = { ...statusFilter, ...searchFilter } as any;

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { placedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: true,
          address: true,
          orderItems: {
            include: { product: true, variant: true },
          },
        },
      }),
    ]);

    return NextResponse.json({ total, page, pageSize, orders });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
