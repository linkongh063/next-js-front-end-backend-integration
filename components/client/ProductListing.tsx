"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import noProductImage from "@/public/no-product-img.jpg"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
type Product = any;

export default function ProductListing({
  initialProducts,
  categories,
  initialCategoryId = "all",
  showPagination = true,
  showFilters = true,
}: {
  initialProducts: Product[];
  categories: { id: string; name: string }[];
  initialCategoryId?: string;
  showPagination?: boolean;
  showFilters?: boolean;
}) {

  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategoryId = searchParams.get("category") || "all";

  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | "all">(
    initialCategoryId as any
  );
  const [availability, setAvailability] = useState<"all" | "in" | "out">("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [addingIds, setAddingIds] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Sync category state when initialCategoryId changes (e.g., from URL changes)
   useEffect(() => {
    setCategoryId(urlCategoryId);
    setPage(1);
  }, [urlCategoryId]);

  const filtered = useMemo(() => {
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;

    return (initialProducts || []).filter((p) => {
      // text search
      const q = query.toLowerCase();
      const matchesText =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.brand?.name?.toLowerCase().includes(q);
      // category (support either flat categoryId or nested category.id)
      const matchesCat =
        categoryId === "all" ||
        p.categoryId === categoryId ||
        p.category?.id === categoryId;
      // price
      const price = p.variants?.[0]?.price as number | undefined;
      const matchesPrice =
        (min === undefined || (price ?? Infinity) >= min) &&
        (max === undefined || (price ?? -Infinity) <= max);
      // stock
      const stockQty = p.variants?.[0]?.stockQuantity as number | undefined;
      let matchesStock = true;
      if (availability === "in") matchesStock = (stockQty ?? 0) > 0;
      if (availability === "out") matchesStock = (stockQty ?? 0) === 0;
      return matchesText && matchesCat && matchesPrice && matchesStock;
    });
  }, [initialProducts, query, categoryId, availability, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  async function handleAddToCart(p: any) {
    try {
      const variant =
        (p.variants || []).find((v: any) => v.isDefault) || p.variants?.[0];
      if (!variant?.id) {
        alert("No purchasable variant available.");
        return;
      }
      setAddingIds((s) => ({ ...s, [p.id]: true }));
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: variant.id, quantity: 1 }),
      });
      if (res.status === 401) {
        // Redirect to Clerk sign-in for customers
        if (typeof window !== "undefined") {
          const cb = encodeURIComponent(window.location.href);
          window.location.href = `/sign-in?redirect_url=${cb}`;
        }
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to add to cart");
      // Success feedback
      if (typeof window !== "undefined") {
        // replace later with a toast
        console.log("Added to cart", data?.item);
        window.dispatchEvent(new CustomEvent("cart:updated"));
      }
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Could not add to cart");
    } finally {
      setAddingIds((s) => ({ ...s, [p.id]: false }));
    }
  }

  const resetPagination = () => setPage(1);

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-600">Search</label>
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPagination();
              }}
              placeholder="Search products"
            />
          </div>
          <div className="w-48">
            <label className="text-xs text-gray-600">Category</label>
            <Select
              value={categoryId}
              onValueChange={(v) => {
                setCategoryId(v as any);
                resetPagination();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <label className="text-xs text-gray-600">Availability</label>
            <Select
              value={availability}
              onValueChange={(v) => {
                setAvailability(v as any);
                resetPagination();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in">In stock</SelectItem>
                <SelectItem value="out">Out of stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-28">
            <label className="text-xs text-gray-600">Min price</label>
            <Input
              inputMode="decimal"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                resetPagination();
              }}
              placeholder="0"
            />
          </div>
          <div className="w-28">
            <label className="text-xs text-gray-600">Max price</label>
            <Input
              inputMode="decimal"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                resetPagination();
              }}
              placeholder="999"
            />
          </div>
        </div>
      )}

      {/* Grid */}
      {pageItems.length === 0 ? (
        <p className="text-sm text-gray-500">No products match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {pageItems.map((p) => {
            const cover =
              p.images?.find((i: any) => i.isFeatured)?.imageUrl ||
              p.images?.[0]?.imageUrl ||
              noProductImage;
            const isRemote =
              typeof cover === "string" && /^https?:\/\//i.test(cover);
            const prices: number[] = Array.isArray(p.variants)
              ? p.variants
                  .map((v: any) => {
                    const n = Number(v?.price);
                    return isNaN(n) ? undefined : n;
                  })
                  .filter((n: number | undefined): n is number => n != null)
              : [];
            const price = prices.length ? Math.min(...prices) : undefined;
            const stockQty = Number(p.variants?.[0]?.stockQuantity ?? 0);
            return (
              <Card key={p.id} className="overflow-hidden">
                <div className="relative h-36 w-full bg-gray-50">
                  <Image
                    src={cover}
                    alt={p.name}
                    fill
                    className="object-contain p-3"
                    unoptimized={isRemote}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-base">
                    {p.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {p.brand?.name && <span>{p.brand.name}</span>}
                      {p.category?.name && (
                        <span className="inline-flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-gray-300 inline-block" />
                          {p.category.name}
                        </span>
                      )}
                    </div>
                    <Badge variant={stockQty > 0 ? "secondary" : "destructive"}>
                      {stockQty > 0 ? "In stock" : "Out of stock"}
                    </Badge>
                  </div>
                  {price != null && (
                    <p className="mt-2 text-gray-900 font-medium">
                      ${price.toFixed(2)}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="w-1/2"
                  >
                    <Link href={`/products/${p.id}`}>View</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="w-1/2"
                    onClick={() => handleAddToCart(p)}
                    disabled={
                      !!addingIds[p.id] ||
                      Number(p.variants?.[0]?.stockQuantity ?? 0) <= 0
                    }
                  >
                    {addingIds[p.id] ? "Adding..." : "Add to cart"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
