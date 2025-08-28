import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

function generateOrderNumber() {
  const rand = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
  return `ORD-${Date.now()}-${rand}`;
}

export async function POST(req: NextRequest) {
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
        password: "", // not used for Clerk users
      },
      update: {},
    });

    const body = await req.json();
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    } = body || {};

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode || !country) {
      return NextResponse.json({ error: "Missing required address fields" }, { status: 400 });
    }

    // Load cart with items and variant/product info
    const cart = await prisma.cart.findFirst({
      where: { userId: dbUser.id },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    const items = cart?.items || [];
    if (!items.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    // Calculate totals
    let subtotal = 0;
    const mapped = items.map((it) => {
      const unitPrice = Number(it.variant.price);
      const totalPrice = unitPrice * it.quantity;
      subtotal += totalPrice;
      return {
        productId: it.variant.productId,
        variantId: it.variantId,
        quantity: it.quantity,
        unitPrice,
        totalPrice,
      };
    });

    const shippingCost = 0;
    const discount = 0;
    const total = subtotal + shippingCost - discount;

    const orderNumber = generateOrderNumber();

    // Transaction: create address (optional save), create order + items, clear cart, optionally adjust stock
    const result = await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
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
          isDefault: false,
        },
      });

      const order = await tx.order.create({
        data: {
          userId: dbUser.id,
          addressId: address.id,
          orderNumber,
          status: "PENDING",
          paymentStatus: "UNPAID",
          paymentMethod: "COD",
          total,
          discount,
          shippingCost,
        },
      });

      // Create order items and reduce stock
      for (const it of mapped) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: it.productId,
            variantId: it.variantId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            totalPrice: it.totalPrice,
          },
        });
        // Reduce stock and create inventory log
        await tx.productVariant.update({
          where: { id: it.variantId },
          data: { stockQuantity: { decrement: it.quantity } },
        });
        await tx.inventoryLog.create({
          data: {
            variantId: it.variantId,
            change: -it.quantity,
            reason: "SALE",
            referenceId: order.id,
            note: "COD checkout",
          },
        });
      }

      // Clear cart items
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return order;
    });

    return NextResponse.json({ ok: true, orderId: result.id, orderNumber });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
