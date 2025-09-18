import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function page() {
  // Admin access is enforced by app/(admin)/layout.tsx via NextAuth.
  const [ordersCount, paidSalesAgg, productsCount, inventoryAgg] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.product.count(),
    prisma.productVariant.aggregate({ _sum: { stockQuantity: true } }),
  ]);

  const totalOrders = ordersCount;
  const totalSales = Number(paidSalesAgg._sum.total || 0);
  const totalProducts = productsCount;
  const totalInventory = inventoryAgg._sum.stockQuantity || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of orders, sales, and inventory.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>All-time number of orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
            <CardDescription>Sum of paid orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
            <CardDescription>Active + draft products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Inventory</CardTitle>
            <CardDescription>Sum of variant stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalInventory}</div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center border py-4 rounded-xl">
        <Link href={"/dashboard/orders"} className="underline">Go to Orders</Link>
      </div>
    </div>
  );
}
