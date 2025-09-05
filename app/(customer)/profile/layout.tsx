"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <SignOutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className="border rounded p-3 h-max">
          <nav className="grid gap-1">
            <Link
              href="/profile/profileinfo"
              className={`px-3 py-2 rounded ${
                isActive("/profile/profileinfo")
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Profile info
            </Link>
            <Link
              href="/profile/orders"
              className={`px-3 py-2 rounded ${
                isActive("/profile/orders")
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Orders
            </Link>
            <Link
              href="/profile/addresses"
              className={`px-3 py-2 rounded ${
                isActive("/profile/addresses")
                  ? "bg-gray-900 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Addresses
            </Link>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
