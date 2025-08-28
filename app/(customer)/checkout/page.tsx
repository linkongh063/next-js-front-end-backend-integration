"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 401) {
        // redirect to Clerk sign-in and return back
        const cb = encodeURIComponent("/checkout");
        window.location.href = `/sign-in?redirect_url=${cb}`;
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to place order");
      setOrderNumber(data.orderNumber);
      // Update navbar cart count
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:updated"));
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Load cart items
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setCartLoading(true);
        const res = await fetch("/api/cart/items", { cache: "no-store" });
        if (res.status === 401) {
          const cb = encodeURIComponent("/checkout");
          if (typeof window !== "undefined") {
            window.location.href = `/sign-in?redirect_url=${cb}`;
          }
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          const items = Array.isArray(data?.items) ? data.items : [];
          setCartItems(items);
        }
      } catch (e) {
        if (!cancelled) setCartItems([]);
      } finally {
        if (!cancelled) setCartLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const priceFmt = (n: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);

  const { subtotal, shippingCost, discount, total } = useMemo(() => {
    let sub = 0;
    cartItems.forEach((it: any) => {
      const unit = Number(it?.variant?.price ?? 0);
      const qty = Number(it?.quantity ?? 0);
      sub += unit * qty;
    });
    const ship = 0;
    const disc = 0;
    return { subtotal: sub, shippingCost: ship, discount: disc, total: sub + ship - disc };
  }, [cartItems]);

  if (orderNumber) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold mb-4">Order placed!</h1>
        <p className="mb-6">Your order number is <span className="font-mono font-medium">{orderNumber}</span>.</p>
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={() => router.push("/")}
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Checkout - Cash on Delivery</h1>
      {/* Cart summary */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">Order summary</h2>
        {cartLoading ? (
          <div className="text-sm text-gray-600">Loading your cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-sm text-gray-600">Your cart is empty. <button className="underline" onClick={() => router.push("/shop")}>Go shopping</button></div>
        ) : (
          <div className="border rounded">
            <div className="divide-y">
              {cartItems.map((it: any) => {
                const name = it?.variant?.product?.name || "Product";
                const unit = Number(it?.variant?.price ?? 0);
                const qty = Number(it?.quantity ?? 0);
                const line = unit * qty;
                return (
                  <div key={it.id} className="flex items-center justify-between p-3 text-sm">
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-gray-600">Qty: {qty}</div>
                    </div>
                    <div className="text-right">
                      <div>{priceFmt(unit)} <span className="text-gray-500">ea</span></div>
                      <div className="font-medium">{priceFmt(line)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{priceFmt(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{priceFmt(shippingCost)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-{priceFmt(discount)}</span></div>
              <div className="flex justify-between font-semibold text-base mt-2"><span>Total</span><span>{priceFmt(total)}</span></div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>
      )}
      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="addressLine1">Address line 1</label>
          <input
            id="addressLine1"
            name="addressLine1"
            value={form.addressLine1}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="addressLine2">Address line 2 (optional)</label>
          <input
            id="addressLine2"
            name="addressLine2"
            value={form.addressLine2}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="state">State</label>
            <input
              id="state"
              name="state"
              value={form.state}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="postalCode">Postal code</label>
            <input
              id="postalCode"
              name="postalCode"
              value={form.postalCode}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="country">Country</label>
            <input
              id="country"
              name="country"
              value={form.country}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-black text-white rounded disabled:opacity-60"
        >
          {loading ? "Completing..." : "Complete order"}
        </button>
      </form>
    </div>
  );
}
