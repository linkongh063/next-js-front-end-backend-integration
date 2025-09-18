import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/auth";
import { CategoryService } from "@/lib/services/category.service";
import { CartCount } from "@/components/cart-count";

export async function SiteNavbar() {
  const session = await auth();

  const [categories] = await Promise.all([
    CategoryService.getAllCategories(),
  ])


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Desktop logo */}
        <div className="hidden lg:flex w-auto">
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
            {
              categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/shop?category=${c.id}`}
                    className="text-sm font-medium hover:text-gray-600"
                  >
                    {c.name}
                  </Link>
                </li>
              ))
            }
          </ul>
        </nav>

        {/* actions */}
        <div className="flex flex-1 items-center justify-end space-x-4">

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>

          {/* User account */}
          <div>
            <span className="px-2">{session?.user?.name && session.user.name}</span>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile/profileinfo">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            <Link href="/search" className="p-2 text-gray-700 hover:text-gray-900">
              <Search className="h-5 w-5" />
            </Link>
            <CartCount />
          </div>
        </div>
      </div>
    </header>
  );
}

export default SiteNavbar;
