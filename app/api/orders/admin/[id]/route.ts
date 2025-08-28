import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import type { OrderStatus } from "@prisma/client";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const role = (session as any)?.user?.role;
    if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const body = await req.json();
    const statusRaw = String(body?.status || "").toUpperCase();
    const allowed: OrderStatus[] = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ] as unknown as OrderStatus[];

    if (!allowed.includes(statusRaw as OrderStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: statusRaw as OrderStatus },
    });

    return NextResponse.json({ ok: true, order: updated });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
