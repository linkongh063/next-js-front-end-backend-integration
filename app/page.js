import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default function Home() {
  console.log('!!########### prisma loaded ################!!')
  return (
    <div className="bg-white">
      <h1>Hello Home Page</h1>
    </div>
  );
}
