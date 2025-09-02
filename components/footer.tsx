import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, CreditCard, Truck, Shield } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/shop" },
        { name: "New Arrivals", href: "/new-arrivals" },
        { name: "Best Sellers", href: "/best-sellers" },
        { name: "Sale", href: "/sale" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQs", href: "/faq" },
        { name: "Shipping & Returns", href: "/shipping-returns" },
        { name: "Size Guide", href: "/size-guide" },
      ],
    },
    {
      title: "About Us",
      links: [
        { name: "Our Story", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <Truck className="h-8 w-8 text-gray-400" />
              <div>
                <h3 className="font-medium">Free Shipping</h3>
                <p className="text-sm text-gray-400">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-gray-400" />
              <div>
                <h3 className="font-medium">Secure Payment</h3>
                <p className="text-sm text-gray-400">100% secure payment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
              <div>
                <h3 className="font-medium">Money Back Guarantee</h3>
                <p className="text-sm text-gray-400">30 days return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4">LOGO</h2>
            <p className="text-gray-400 mb-6">
              Discover the latest trends in fashion, electronics, and more. Quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              {currentYear} ecomx. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-sm text-gray-400 hover:text-white">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
