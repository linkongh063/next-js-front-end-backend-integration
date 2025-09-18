"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface ProductImage {
  id: string;
  imageUrl: string;
  isFeatured: boolean;
  productId: string;
}

interface ProductVariant {
  id: string;
  sku: string;
  price: string;
  cost: string;
  isDefault: boolean;
  stockQuantity: number;
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brand?: { id: string; name: string; slug: string; logoUrl: string };
  category?: { id: string; name: string; slug: string };
  images: ProductImage[];
  variants: ProductVariant[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductCard({ product }: { product: ApiProduct }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // ✅ Featured image (fallback to first or placeholder)
  const featuredImage =
    product.images?.find((img) => img.isFeatured)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    "/placeholder-product.jpg";

  // ✅ Price from default variant (fallback to first variant)
  const defaultVariant =
    product.variants?.find((v) => v.isDefault) || product.variants?.[0];
  const price = defaultVariant ? parseFloat(defaultVariant.price) : 0;
  //   const defaultVariant = product.variants?.find((v: any) => v.isDefault) || product.variants?.[0];
  const isOutOfStock = defaultVariant?.stockQuantity <= 0;
  // console.log("isOutOfStock", isOutOfStock);
  // Example original price (for demo)
  const originalPrice = price > 0 ? price + 100 : undefined;

  const rating = 4.5;

  const isNew =
    (new Date().getTime() - new Date(product.createdAt).getTime()) /
      (1000 * 60 * 60 * 24) <
    30;

  const isOnSale = !!originalPrice && originalPrice > price;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(price);

  // ✅ Add to Cart handler
  async function handleAddToCart() {
    try {
      if (!defaultVariant?.id) {
        alert("No purchasable variant available.");
        return;
      }
      setIsAdding(true);
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: defaultVariant.id, quantity: 1 }),
      });
      if (res.status === 401) {
        // Redirect unauthenticated customers
        if (typeof window !== "undefined") {
          const cb = encodeURIComponent(window.location.href);
          window.location.href = `/sign-in?redirect_url=${cb}`;
        }
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to add to cart");
      // Notify cart update
      if (typeof window !== "undefined") {
        console.log("Added to cart", data?.item);
        window.dispatchEvent(new CustomEvent("cart:updated"));
      }
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Could not add to cart");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div
      className="group relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Link href={`/products/${product.id}`}>
          <Image
            src={featuredImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {isNew && (
            <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
              New
            </span>
          )}
          {isOnSale && (
            <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
              Sale
            </span>
          )}
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md"
            >
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition-opacity ${
            isHovered || isWishlist ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsWishlist(!isWishlist)}
          aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* ✅ Add to Cart Button */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-black text-white p-3 text-center transition-transform duration-300 ${
            isHovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 text-white cursor-pointer"
            onClick={handleAddToCart}
            disabled={isAdding || (defaultVariant?.stockQuantity ?? 0) <= 0}
          >
            <ShoppingCart className="h-4 w-4" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <Link href={`/products/${product.id}`}>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>

          {(product.brand || product.category) && (
            <p className="text-xs text-gray-500 mb-2">
              {product.brand?.name}
              {product.brand && product.category && " · "}
              {product.category?.name}
            </p>
          )}

          {/* Rating */}
          {rating && (
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">
                ({rating.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900">
              {price ? formatPrice(price) : "N/A"}
            </span>
            {originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
