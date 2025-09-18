import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();// prisma/seed.ts

async function main() {
  // Seed Roles (optional)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: '#absc$$b', // Replace with real hashed password
      phone: '01700000000',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: '#absc$$b',
      phone: '01800000000',
    },
  });

  // Brands
  const apple = await prisma.brand.create({
    data: {
      name: 'Apple',
      slug: 'apple',
      logoUrl: 'https://logo.clearbit.com/apple.com',
    },
  });

  const samsung = await prisma.brand.create({
    data: {
      name: 'Samsung',
      slug: 'samsung',
    },
  });

  // Categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
    },
  });

  const phones = await prisma.category.create({
    data: {
      name: 'Mobile Phones',
      slug: 'mobile-phones',
      parentId: electronics.id,
    },
  });

  // Products
  const iphone = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      brandId: apple.id,
      categoryId: phones.id,
      description: 'Latest Apple flagship phone',
      status: 'ACTIVE',
      images: {
        create: [
          { imageUrl: 'https://example.com/iphone.jpg', isFeatured: true },
        ],
      },
    },
  });

  const iphoneVariant = await prisma.productVariant.create({
    data: {
      productId: iphone.id,
      sku: 'IPHONE15PRO-256GB-BLACK',
      price: 1299.99,
      cost: 999.99,
      stockQuantity: 20,
      isDefault: true,
    },
  });

  // Inventory Log
  await prisma.inventoryLog.create({
    data: {
      variantId: iphoneVariant.id,
      change: 20,
      reason: 'RESTOCK',
      note: 'Initial stock',
    },
  });

  // Wishlist
  await prisma.wishlist.create({
    data: {
      userId: customer.id,
      productId: iphone.id,
    },
  });

  // Cart
  const cart = await prisma.cart.create({
    data: {
      userId: customer.id,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      variantId: iphoneVariant.id,
      quantity: 1,
    },
  });

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
