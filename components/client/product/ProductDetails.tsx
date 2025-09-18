"use client";

import { Product } from "@/lib/types/product";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/app/store/cartStore";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// handle price coming as Prisma.Decimal | string | number
function formatPrice(value: any): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  // Prisma.Decimal has toString()
  if (typeof value.toString === "function") return value.toString();
  try {
    return String(value);
  } catch {
    return "";
  }
}

export default function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const pathname = usePathname();
  const cover =
    product.images?.find((i: any) => i.isFeatured)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    "/next.svg";

  // Variants
  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const [mainImage, setMainImage] = useState(cover);
  const [qty, setQty] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const { addToCart, fetchCartCount, getCartCount } = useCartStore();

  // Compute a fallback price from variants (min price) since Product has no direct price field
  const variantPrices: number[] = Array.isArray(variants)
    ? variants
        .map((v: any) => {
          const n = Number(v?.price);
          return isNaN(n) ? undefined : n;
        })
        .filter((n: number | undefined): n is number => n != null)
    : [];
  const minVariantPrice = variantPrices.length ? Math.min(...variantPrices) : 0;

  type CartItem = { id: string; name: string; price: any; sku?: string };

  const getCartItem = (): CartItem | null => {
    // Only allow cart items when a variant is explicitly selected
    if (variants.length === 0) return null;
    if (!selectedVariant) return null;
    return {
      id: selectedVariant.id,
      name: product.name,
      price: selectedVariant.price,
      sku: (selectedVariant as any)?.sku,
    };
  };

  // Clamp quantity to stock when variant changes
  useEffect(() => {
    if (!selectedVariant) return;
    const max = Number((selectedVariant as any)?.stockQuantity || 0);
    setQty(prevQty => {
      if (prevQty < 1) return 1;
      if (max > 0 && prevQty > max) return max;
      return prevQty;
    });
  }, [selectedVariant]);
  
  // Fetch initial cart count
  useEffect(() => {
    fetchCartCount().catch(console.error);
  }, [fetchCartCount]);

  const handleAddToCart = async () => {
    const cartItem = getCartItem();
    console.log("item is doing cart", cartItem)
    if (!cartItem) {
      setToast({ show: true, message: 'Please select a variant' });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
      return;
    }
    
    const max = Number((selectedVariant as any)?.stockQuantity || 0);
    if (max > 0 && qty > max) {
      setToast({ show: true, message: `Only ${max} left in stock` });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
      setQty(max);
      return;
    }

    console.log("max:", max)

    try {
      setIsAddingToCart(true);
      console.log("cartItem", cartItem)
      const cartItemStore = {
        ...cartItem,
        quantity: qty,
        variantId: cartItem.id, 
        maxQuantity: max,
      }

      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          variantId: cartItem.id, 
          quantity: qty 
        }),
      });
      
      if (res.status === 401) {
        // Not authenticated → go to sign-in and return back here
        router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname || "/")}`);
        return;
      }
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add to cart');
      }
      
      // Refresh the cart state
      // await fetchCartCount(); 
      
      // Show success message
      setToast({ 
        show: true, 
        message: `✅ Successfully added ${qty}x ${product.name} to cart!` 
      });

      addToCart(cartItemStore);
      console.log("getCartCount", getCartCount())
      
      // Clear toast after delay
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } catch (e: any) {
      console.error('Add to cart error:', e);
      setToast({ 
        show: true, 
        message: e?.message || 'Failed to add to cart. Please try again.' 
      });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return alert("Please select a variant.");
    alert(`Proceeding to checkout for ${product.name} (${selectedVariant.sku}).`);
  };

  const handleWishlist = () => {
    alert(`Toggled wishlist for ${product.name}`);
  };

  const canAddToCart = variants.length > 0 && !!selectedVariant;

  // Fake reviews
  const reviews = [
    { id: "r1", user: "Alice", rating: 5, comment: "Excellent quality!", date: "2025-08-12" },
    { id: "r2", user: "Bob", rating: 4, comment: "Great value for money.", date: "2025-08-27" },
  ];
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

  // Recommended products (demo)
  const recommended = [
    { id: "rec-1", name: "Nike Air Zoom", price: 550, imageUrl: cover },
    { id: "rec-2", name: "Adidas Run Lite", price: 420, imageUrl: cover },
  ];

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
        {/* Images */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex flex-col gap-3 w-20">
              {product.images.map((img: any) => (
                <div
                  key={img.id}
                  className={`relative w-20 h-20 border rounded-md cursor-pointer ${
                    mainImage === img.imageUrl ? "ring-2 ring-black" : ""
                  }`}
                  onClick={() => setMainImage(img.imageUrl)}
                >
                  <Image src={img.imageUrl} alt={product.name} fill className="object-contain p-2" />
                </div>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="relative flex-1 aspect-square bg-gray-50 rounded-lg">
            <Image src={mainImage} alt={product.name} fill className="object-contain p-4" />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          {product.brand?.name && <p className="text-sm text-gray-500">Brand: {product.brand.name}</p>}
          {product.category?.name && <p className="text-sm text-gray-500">Category: {product.category.name}</p>}

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-yellow-500">
              {"★".repeat(Math.round(avgRating))}
              {"☆".repeat(5 - Math.round(avgRating))}
            </span>
            <span className="text-sm text-gray-600">
              {avgRating.toFixed(1)} / 5 ({reviews.length} reviews)
            </span>
          </div>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium">Select Variant</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {variants.map((v: any) => (
                  <Button
                    key={v.id}
                    variant={selectedVariant?.id === v.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v.sku} — ${formatPrice(v.price)} ({v.stockQuantity} in stock)
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          {selectedVariant && (
            <p className="mt-4 text-2xl font-bold text-gray-900">${formatPrice(selectedVariant.price)}</p>
          )}

          {/* Toast Notification */}
          {toast.show && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center space-x-2">
                <span>{toast.message}</span>
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="mt-4 text-sm text-gray-700">{product.description}</p>
          )}

          {/* Quantity */}
          {selectedVariant && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-gray-600">Quantity</span>
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  type="button"
                  className="px-3 py-1 disabled:opacity-50"
                  onClick={() => setQty(prevQty => Math.max(1, prevQty - 1))}
                  disabled={qty <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={Number((selectedVariant as any)?.stockQuantity || 9999)}
                  value={qty}
                  onChange={(e) => {
                    const v = Math.max(1, Number(e.target.value) || 1);
                    const max = Number((selectedVariant as any)?.stockQuantity || 0);
                    setQty(max > 0 ? Math.min(v, max) : v);
                  }}
                  aria-label="Quantity"
                  title="Quantity"
                  className="w-16 text-center outline-none py-1"
                />
                <button
                  type="button"
                  className="px-3 py-1 disabled:opacity-50"
                  onClick={() => {
                    const max = Number((selectedVariant as any)?.stockQuantity || 0);
                    setQty(prevQty => (max > 0 ? Math.min(prevQty + 1, max) : prevQty + 1));
                  }}
                  disabled={(() => {
                    const max = Number((selectedVariant as any)?.stockQuantity || 0);
                    return max > 0 && qty >= max;
                  })()}
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500">In stock: {Number((selectedVariant as any)?.stockQuantity || 0)}</span>
            </div>
          )}

          {/* Availability / Selection notice */}
          {!variants.length && (
            <p className="mt-4 text-sm text-red-600">This product is currently unavailable (no variants).</p>
          )}
          {variants.length > 0 && !selectedVariant && (
            <p className="mt-4 text-sm text-amber-600">Please select a variant to proceed.</p>
          )}

          {/* CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={!canAddToCart || isAddingToCart}
              className="w-full"
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button onClick={handleBuyNow} className="bg-green-600 hover:bg-green-700 disabled:opacity-50" disabled={!canAddToCart} title={!canAddToCart ? "Select a variant first" : undefined}>
              ⚡ Buy Now
            </Button>
            <Button variant="outline" onClick={handleWishlist}>
              ♡ Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <span className="font-medium">{r.user}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(r.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-yellow-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
                <p className="mt-2 text-sm">{r.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-4">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommended.map((p) => (
            <Card key={p.id} className="group hover:shadow-md transition">
              <Link href={`/products/${p.id}`}>
                <div className="relative w-full aspect-square bg-gray-50">
                  <Image src={p.imageUrl} alt={p.name} fill className="object-contain p-4" />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium group-hover:underline">{p.name}</p>
                  <p className="text-sm text-gray-900">${p.price}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
