import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        {/* Top Grid */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">ecomx</h3>
            <p className="text-sm">
              Quality products, curated for you.  
              Shop smarter with exclusive offers and fast delivery.
            </p>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/returns" className="hover:text-white">Returns & Refunds</Link></li>
              <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
              <li><Link href="/support" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              ecomx
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Earn With Us */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Earn With Us
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/affiliate" className="hover:text-white">Affiliate Program</Link></li>
              <li><Link href="/seller" className="hover:text-white">Sell on ecomx</Link></li>
              <li><Link href="/partner" className="hover:text-white">Become a Partner</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-neutral-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Social Media */}
          <div className="flex space-x-6">
            <Link href="https://facebook.com" target="_blank" className="hover:text-white">
              <Facebook size={20} />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-white">
              <Twitter size={20} />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-white">
              <Instagram size={20} />
            </Link>
            <Link href="https://youtube.com" target="_blank" className="hover:text-white">
              <Youtube size={20} />
            </Link>
          </div>
        </div>

        <Separator className="my-6 bg-neutral-700" />

        {/* Copyright */}
        <div className="text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} ecomx. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
