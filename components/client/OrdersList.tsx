"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function OrdersList() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const priceFmt = (n: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/orders/mine", { cache: "no-store" });
        if (res.status === 401) {
          if (typeof window !== "undefined") {
            const cb = encodeURIComponent("/orders");
            window.location.href = `/sign-in?callbackUrl=${cb}`;
          }
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load orders");
        if (!cancelled) setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const normalized = useMemo(() => {
    return orders.map((o: any) => {
      const itemsCount = Array.isArray(o?.orderItems)
        ? o.orderItems.reduce((s: number, it: any) => s + Number(it.quantity || 0), 0)
        : 0;
      const total = Number(o?.total ?? 0);
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        placedAt: o.placedAt,
        itemsCount,
        total,
        items: o.orderItems || [],
      };
    });
  }, [orders]);

  return (
    <div>
      {loading && <div className="text-sm text-gray-600">Loading orders...</div>}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>
      )}
      {!loading && !error && normalized.length === 0 && (
        <div className="text-sm text-gray-700">
          You don&apos;t have any orders yet. <Link className="underline" href="/shop">Start shopping</Link>
        </div>
      )}
      <div className="grid gap-4">
        {normalized.map((o) => (
          <div key={o.id} className="border rounded p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">Order {o.orderNumber}</div>
              <div className="text-sm text-gray-600">
                Placed on {new Date(o.placedAt).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>
                <div className="text-gray-500">Status</div>
                <div className="font-medium">{o.status}</div>
              </div>
              <div>
                <div className="text-gray-500">Payment</div>
                <div className="font-medium">{o.paymentStatus}</div>
              </div>
              <div>
                <div className="text-gray-500">Items</div>
                <div className="font-medium">{o.itemsCount}</div>
              </div>
              <div>
                <div className="text-gray-500">Total</div>
                <div className="font-medium">{priceFmt(o.total)}</div>
              </div>
            </div>
            {o.items.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <div className="text-sm text-gray-600 mb-2">Items</div>
                <div className="divide-y">
                  {o.items.map((it: any) => (
                    <div key={it.id} className="py-2 text-sm flex items-center justify-between">
                      <div>
                        <div className="font-medium">{it?.product?.name || "Product"}</div>
                        <div className="text-gray-600">Qty: {it.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div>
                          {priceFmt(Number(it.unitPrice || 0))} <span className="text-gray-500">ea</span>
                        </div>
                        <div className="font-medium">{priceFmt(Number(it.totalPrice || 0))}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
