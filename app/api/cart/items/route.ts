import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";


export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email ?? undefined;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure DB user exists (email is unique in schema)
    const dbUser = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: session?.user?.name || email,
        password: "", // required by schema but unused for Clerk users
      },
      update: {},
    });

    const cart = await prisma.cart.findFirst({
      where: { userId: dbUser.id },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
    });
    console.log("cart from the api",cart);
    return NextResponse.json(cart ?? { items: [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
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

    const { variantId, quantity = 1 } = await req.json();
    if (!variantId) return NextResponse.json({ error: "variantId is required" }, { status: 400 });

    // Ensure variant exists
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant) return NextResponse.json({ error: "Variant not found" }, { status: 404 });

    // Find or create cart (userId is not unique in schema)
    let cart = await prisma.cart.findFirst({ where: { userId: dbUser.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: dbUser.id } });
    }

    // Upsert cart item (increase quantity if exists)
    const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, variantId } });
    const requestedQty = Number(quantity || 1);
    const currentQty = existing ? existing.quantity : 0;
    const newQty = currentQty + requestedQty;

    if (variant.stockQuantity != null && newQty > Number(variant.stockQuantity)) {
      const available = Math.max(0, Number(variant.stockQuantity) - currentQty);
      return NextResponse.json(
        { error: `Only ${available} left in stock for this item.` },
        { status: 400 }
      );
    }

    const item = existing
      ? await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: newQty },
        })
      : await prisma.cartItem.create({
          data: { cartId: cart.id, variantId, quantity: requestedQty },
        });

    return NextResponse.json({ ok: true, item });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email ?? undefined;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.upsert({
      where: { email },
      create: { email, name: session?.user?.name || email, password: "" },
      update: {},
    });

    const { itemId, quantity } = await req.json();
    if (!itemId) return NextResponse.json({ error: "itemId is required" }, { status: 400 });
    if (quantity != null && Number(quantity) <= 0) {
      await prisma.cartItem.delete({ where: { id: String(itemId) } });
      return NextResponse.json({ ok: true, deleted: true });
    }

    // Ensure the item belongs to the user's cart
    const item = await prisma.cartItem.findUnique({ where: { id: String(itemId) }, include: { cart: true } });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    const cart = await prisma.cart.findUnique({ where: { id: item.cartId } });
    if (!cart || cart.userId !== dbUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updated = await prisma.cartItem.update({
      where: { id: String(itemId) },
      data: { quantity: Number(quantity || 1) },
    });
    return NextResponse.json({ ok: true, item: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const email = session?.user?.email ?? undefined;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.upsert({
      where: { email },
      create: { email, name: session?.user?.name || email, password: "" },
      update: {},
    });

    const { itemId } = await req.json();
    if (!itemId) return NextResponse.json({ error: "itemId is required" }, { status: 400 });

    // Ensure the item belongs to the user's cart
    const item = await prisma.cartItem.findUnique({ where: { id: String(itemId) } });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    const cart = await prisma.cart.findUnique({ where: { id: item.cartId } });
    if (!cart || cart.userId !== dbUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.cartItem.delete({ where: { id: String(itemId) } });
    return NextResponse.json({ ok: true, deleted: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
