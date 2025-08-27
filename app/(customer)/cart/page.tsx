"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartItemDto {
  id: string;
  quantity: number;
  variant: {
    id: string;
    price?: number | null;
    stock?: number | null;
    product: { id: string; name: string };
  };
}

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CartItemDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/cart/items", { cache: "no-store" });
      if (res.status === 401) {
        // redirect to Clerk sign-in
        if (typeof window !== "undefined") {
          const cb = encodeURIComponent(window.location.href);
          window.location.href = `/sign-in?redirect_url=${cb}`;
        }
        return;
      }
      const data = await res.json();
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.variant?.price) || 0) * (Number(it.quantity) || 0), 0);
  }, [items]);

  const updateQty = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch("/api/cart/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });
      if (!res.ok) throw new Error((await res.json())?.error || "Failed to update");
      await load();
      // notify navbar
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:updated"));
      }
    } catch (e: any) {
      alert(e?.message || "Update failed");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch("/api/cart/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      if (!res.ok) throw new Error((await res.json())?.error || "Failed to remove");
      await load();
      // notify navbar
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:updated"));
      }
    } catch (e: any) {
      alert(e?.message || "Remove failed");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {!loading && items.length === 0 && (
        <div className="text-sm">
          Cart is empty. <Link className="underline" href="/shop">Continue shopping</Link>
        </div>
      )}
      {!loading && items.length > 0 && (
        <div className="grid gap-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">{it.variant?.product?.name ?? "Product"}</div>
                <div className="text-xs text-gray-600">Price: ${Number(it.variant?.price || 0).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQty(it.id, Math.max(0, Number(it.quantity) - 1))}
                >
                  -
                </Button>
                <Input
                  className="w-16 text-center"
                  type="number"
                  min={0}
                  value={it.quantity}
                  onChange={(e) => updateQty(it.id, Math.max(0, Number(e.target.value) || 0))}
                />
                <Button variant="outline" size="sm" onClick={() => updateQty(it.id, Number(it.quantity) + 1)}>
                  +
                </Button>
                <Button variant="destructive" size="sm" onClick={() => removeItem(it.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-lg font-medium">Total: ${total.toFixed(2)}</div>
            <Button asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
