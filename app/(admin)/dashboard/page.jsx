import Link from "next/link";

export default async function page() {
  // Admin access is enforced by app/(admin)/layout.tsx via NextAuth.
  return (
    <div>
      <p className="text-center border py-4">
        <Link href={"/dashboard"}>Welcome to the Dashboard</Link>
      </p>
      <p className="text-center py-2">Explore manage product nav</p>
    </div>
  );
}
