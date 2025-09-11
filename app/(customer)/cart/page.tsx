"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/app/store/cartStore";

interface CartItemDto {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variantId: string;
  maxQuantity?: number;
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, fetchCartCount } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  console.log("cart from cart page", cart)

  // Fetch cart data when component mounts
  useEffect(() => {
    fetchCartCount().catch(console.error);
  }, [fetchCartCount]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/cart/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity })
      });
      
      if (!res.ok) throw new Error('Failed to update quantity');
      
      updateQuantity(itemId, newQuantity);
      await fetchCartCount();
    } catch (error) {
      setError('Failed to update item');
      console.error('Update quantity error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/cart/items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });
      
      if (!res.ok) throw new Error('Failed to remove item');
      
      removeFromCart(itemId);
      await fetchCartCount(); // Refresh cart count from server
    } catch (error) {
      setError('Failed to remove item');
      console.error('Remove item error:', error);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0)
  , [cart]);

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 border-b pb-4"
              >
                <div className="h-24 w-24 bg-gray-100 rounded-md flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm font-medium">${Number(item.price || 0).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={loading}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max={item.maxQuantity}
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      className="w-16 text-center"
                      disabled={loading}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={loading || (item.maxQuantity ? item.quantity >= item.maxQuantity : false)}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-0 h-auto mt-2"
                    disabled={loading}
                  >
                    Remove
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={() => router.push('/checkout')}
              disabled={loading || cart.length === 0}
            >
              Proceed to Checkout
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              or{' '}
              <Link href="/shop" className="text-blue-500 hover:underline">
                Continue Shopping
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
