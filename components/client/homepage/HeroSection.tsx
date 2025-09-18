"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import hero from "@/public/hero.webp"
export default function HeroSection() {
  return (
    <section className="relative grid md:grid-cols-2 gap-8 items-center rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-black p-10 text-white shadow-lg">
      {/* Left Content */}
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Step Into <span className="text-orange-400">Style</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-lg">
          Discover the latest sneakers, running shoes, and casual footwear.
          Upgrade your shoe game with comfort and style.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>

      {/* Right Product Showcase */}
      <Card className="relative overflow-hidden border-none ">
        <CardContent className="p-6 flex justify-center items-center">
          <Image
            src={hero}
            alt="Featured Shoes"
            width={450}
            height={450}
            className="object-contain drop-shadow-2xl transition-all duration-300 ease-in hover:scale-105"
            priority
          />
        </CardContent>
      </Card>

      {/* Background Accent */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
    </section>
  );
}
