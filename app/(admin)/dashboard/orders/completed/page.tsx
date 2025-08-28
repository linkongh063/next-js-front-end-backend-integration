import OrdersTable from "@/components/admin/OrdersTable";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function fetchOrders(searchParams: Record<string, string | string[] | undefined>) {
  const page = Number(searchParams.page || 1);
  const pageSize = Number(searchParams.pageSize || 10);
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const sp = new URLSearchParams();
  sp.set("page", String(page));
  sp.set("pageSize", String(pageSize));
  sp.set("status", "DELIVERED");
  if (q) sp.set("q", q);

  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host");
  const base = `${proto}://${host}`;
  const cookie = h.get("cookie") || "";

  const res = await fetch(`${base}/api/orders/admin?${sp.toString()}`, {
    cache: "no-store",
    headers: { cookie },
  });
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export default async function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const data = await fetchOrders(searchParams);
  const { orders, total, page, pageSize } = data;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Completed Orders</h1>
        <p className="text-sm text-muted-foreground">Delivered orders summary and records.</p>
      </div>
      <OrdersTable
        orders={orders}
        total={total}
        page={page}
        pageSize={pageSize}
        statusFilter="DELIVERED"
        query={q}
        basePath="/dashboard/orders/completed"
      />
    </div>
  );
}
