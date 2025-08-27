import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ClientWrapper from "@/components/client/ClientWrapper";

export default function Home() {
  console.log('!!########### prisma loaded ################!!')
  // const cookieStore = cookies()
  // const session = cookieStore.get('session') // your session cookie

  // if (session) {
  //   redirect('/dashboard') // 👈 protected route redirect
  // }

  return (
    <div className="border">
      <ClientWrapper>
        <div className="bg-white text-center py-8">
          <h1>Welcome to the Homepage</h1>
          <p>Please <Link href={'/login'}>login</Link> or <Link href={'/signup'}>signup</Link> to continue.</p>


          <p className="text-center border py-4 mt-4">
            <Link href={"/dashboard"}>Dashboard</Link>
          </p>
        </div>
      </ClientWrapper>
    </div>
  );
}
