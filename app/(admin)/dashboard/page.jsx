import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
export default async function page() {

  const authObj = await auth();
  const userObj = await currentUser();

  console.log("User Object:", authObj);
  console.log("Current User:", userObj);

  return (
    <div>
      <p className="text-center border py-4">
        <Link href={"/dashboard"}>Welcome to the Dashboard</Link>
      </p>
      <p className="text-center py-2">Explore manage product nav</p>
    </div>
  );
}
