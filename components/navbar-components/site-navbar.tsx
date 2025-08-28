"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Menu, Search, User } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";

const navLinks = [
  { href: "/shop", label: "Shops" },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [cats, setCats] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    let active = true;
    const CACHE_KEY = "navCatsCache_v1";
    const DAY_MS = 24 * 60 * 60 * 1000;

    const loadFromCache = (): any[] | null => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        const { updatedAt, data } = parsed as { updatedAt: number; data: any[] };
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
      } catch {
        // ignore quota or serialization issues
      }
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
        console.log("category data", data)
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

  // load cart count
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cart/items", { cache: "no-store" });
        if (res.status === 401) return; // signed-out; show 0
        const data = await res.json();
        if (!cancelled) {
          const items = Array.isArray(data?.items) ? data.items : [];
          const totalQty = items.reduce((s: number, it: any) => s + (Number(it.quantity) || 0), 0);
          setCartCount(totalQty);
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // react to cart updates globally
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/cart/items", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        const totalQty = items.reduce((s: number, it: any) => s + (Number(it.quantity) || 0), 0);
        setCartCount(totalQty);
      } catch {}
    };
    window.addEventListener("cart:updated", handler as EventListener);
    return () => window.removeEventListener("cart:updated", handler as EventListener);
  }, []);

  // const flatRecentCats = useMemo(() => {
  //   const out: any[] = [];
  //   const walk = (arr: any[]) => {
  //     arr.forEach((c) => {
  //       out.push(c);
  //       if (c.children?.length) walk(c.children);
  //     });
  //   };
  //   walk(cats || []);
  //   return out.slice(0, 3);
  // }, [cats]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger className="md:hidden p-2" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 grid gap-2">
                {navLinks.map((l) => (
                  <Link key={l.href} href={l.href} className="py-2 text-base">
                    {l.label}
                  </Link>
                ))}
                {/* Signed-in only mobile link */}
                <SignedIn>
                  <Link href="/profile" className="py-2 text-base">
                    Profile
                  </Link>
                  <Link href="/orders" className="py-2 text-base">
                    My Orders
                  </Link>
                </SignedIn>
                {/* {flatRecentCats.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs uppercase text-gray-500 mb-2">Recent categories</div>
                    <div className="grid gap-1">
                      {flatRecentCats.map((c) => (
                        <Link key={c.id} href={`/shop?category=${c.id}`} className="py-1 text-sm">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )} */}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="font-semibold text-xl">
            ECOMX
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navLinks.map((l) => (
                <NavigationMenuItem key={l.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={l.href}
                      className={`px-3 py-2 rounded-md text-sm transition-colors ${
                        pathname === l.href
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              {cats.map((c) => (
                <NavigationMenuItem key={`rc-${c.id}`}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/shop?category=${c.id}`}
                      className={`px-3 py-2 rounded-md text-sm transition-colors ${
                        pathname.startsWith("/shop") ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      title={c.name}
                    >
                      {c.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Middle: Search */}
        <div className="hidden md:flex items-center gap-2 max-w-md w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search products" className="pl-9" />
          </div>
          <Button variant="default">Search</Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative">
            <Button asChild variant="ghost" size="icon" aria-label="Cart">
              <span>
                <ShoppingCart className="h-5 w-5" />
              </span>
            </Button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] h-4 min-w-4 px-1">
                {cartCount}
              </span>
            )}
          </Link>
          {/* Signed-in actions */}
          <SignedIn>
            <Link href="/profile">
              <Button variant="ghost" size="icon" aria-label="Profile">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            {/* <Link href="/orders">
              <Button variant="ghost" className="hidden md:inline-flex">My Orders</Button>
            </Link> */}
          </SignedIn>
          {/* Signed-out action */}
          <SignedOut>
            <SignInButton
              mode="modal"
              fallbackRedirectUrl="/"
              forceRedirectUrl={typeof window !== "undefined" ? window.location.href : "/"}
            >
              <Button variant="default">Sign in</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}

export default SiteNavbar;
