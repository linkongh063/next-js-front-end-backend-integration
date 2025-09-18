'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCartStore } from '@/app/store/cartStore';

export function CartCount() {
  const { itemCount, fetchCartCount } = useCartStore();

  // Fetch cart count on mount
  useEffect(() => {
    fetchCartCount().catch(console.error);
  }, [fetchCartCount]);

  return (
    <Link href="/cart" className="relative p-2 text-gray-700 hover:text-gray-900">
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}
