"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function SiteNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [cats, setCats] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  // ✅ Fetch categories with caching
  useEffect(() => {
    let active = true;
    const CACHE_KEY = "navCatsCache_v1";
    const DAY_MS = 24 * 60 * 60 * 1000;

    const loadFromCache = (): any[] | null => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const { updatedAt, data } = parsed;
        if (!updatedAt || !Array.isArray(data)) return null;
        if (Date.now() - updatedAt > DAY_MS) return null; // expired
        return data;
      } catch {
        return null;
      }
    };

    const saveToCache = (data: any[]) => {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ updatedAt: Date.now(), data })
        );
      } catch {}
    };

    (async () => {
      const cached = loadFromCache();
      if (cached && active) {
        setCats(cached);
        return;
      }
      try {
        const res = await fetch("/api/category", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        const arr = Array.isArray(data) ? data : [];
        setCats(arr);
        saveToCache(arr);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // ✅ Fetch cart count
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cart/items", { cache: "no-store" });
        if (res.status === 401) return; // signed-out; show 0
        const data = await res.json();
        if (!cancelled) {
          const items = Array.isArray(data?.items) ? data.items : [];
          const totalQty = items.reduce(
            (s: number, it: any) => s + (Number(it.quantity) || 0),
            0
          );
          setCartCount(totalQty);
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // ✅ React to global cart updates
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/cart/items", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        const totalQty = items.reduce(
          (s: number, it: any) => s + (Number(it.quantity) || 0),
          0
        );
        setCartCount(totalQty);
      } catch {}
    };
    window.addEventListener("cart:updated", handler as EventListener);
    return () =>
      window.removeEventListener("cart:updated", handler as EventListener);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mr-2"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">Ecomx</span>
          </Link>
        </div>

        {/* Desktop logo */}
        <div className="hidden lg:flex lg:flex-1">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">Ecomx</span>
          </Link>
        </div>

        {/* Navigation links - Desktop */}
        <nav className="hidden lg:flex lg:flex-1 lg:justify-center">
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                href="/shop"
                className="text-sm font-medium hover:text-gray-600"
              >
                Shop
              </Link>
            </li>
            {/* {cats.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/shop?category=${c.id}`}
                  className="text-sm font-medium hover:text-gray-600"
                >
                  {c.name}
                </Link>
              </li>
            ))} */}
            <li>
              <Link
                href="/new-arrivals"
                className="text-sm font-medium hover:text-gray-600"
              >
                New Arrivals
              </Link>
            </li>
            <li>
              <Link
                href="/sale"
                className="text-sm font-medium hover:text-gray-600"
              >
                Sale
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search and actions */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Search bar - Desktop */}
          <div className="hidden lg:block w-full max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-full bg-gray-100 pl-10 focus-visible:ring-1 focus-visible:ring-gray-400"
              />
            </div>
          </div>

          {/* Search button - Mobile */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* User account */}
          <SignedIn>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Sign in</span>
              </Button>
            </SignInButton>
          </SignedOut>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 border-t px-4 py-3">
            <Link
              href="/shop"
              className="block py-2 text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            {/* {cats.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.id}`}
                className="block py-2 text-sm font-medium hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {c.name}
              </Link>
            ))} */}
            <Link
              href="/new-arrivals"
              className="block py-2 text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              href="/sale"
              className="block py-2 text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Sale
            </Link>
          </div>
          <div className="border-t px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-full bg-gray-100 pl-10 focus-visible:ring-1 focus-visible:ring-gray-400"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default SiteNavbar;
