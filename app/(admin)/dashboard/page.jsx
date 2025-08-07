import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function page() {
  const session = await auth();

  if (!session || session.user?.email !== "linkon.softzino@gmail.com") {
    redirect("/login"); // Redirect non-admins
  }

  return (
    <div>
      <p className="text-center border py-4">
        <Link href={"/dashboard"}>Welcome to the Dashboard</Link>
      </p>
      <p className="text-center py-2">Explore manage product nav</p>
    </div>
  );
}
