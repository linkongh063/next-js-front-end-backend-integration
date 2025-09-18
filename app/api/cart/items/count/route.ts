import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email;
    
    if (!email) {
      return NextResponse.json({ 
        count: 0,
        cartId: null,
        items: []
      });
    }

    // Find the user's cart with items and variant details
    const cart = await prisma.cart.findFirst({
      where: { user: { email } },
      include: { 
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: true
                  }
                }
              }
            }
          }
        } 
      },
    });

    if (!cart) {
      return NextResponse.json({ 
        count: 0,
        cartId: null,
        items: []
      });
    }

    // Format items for client
    const items = cart.items.map(item => ({
      id: item.id,
      variantId: item.variantId,
      name: item.variant.product.name,
      price: Number(item.variant.price) || 0,
      quantity: item.quantity,
      maxQuantity: item.variant.stockQuantity ? Number(item.variant.stockQuantity) : undefined,
      image: item.variant.product.images?.[0]?.imageUrl || ''
    }));

    // Calculate total items in cart
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return NextResponse.json({ 
      count,
      cartId: cart.id,
      items
    });
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch cart count',
        count: 0,
        cartId: null,
        items: []
      },
      { status: 500 }
    );
  }
}
