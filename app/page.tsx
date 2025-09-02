import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductService } from "@/lib/services/product.service";
import HeroSectionImage from "@/public/hero-section.png";
import { CategoryService } from "@/lib/services/category.service";
import { ArrowRight, ChevronRight, ShoppingBag } from "lucide-react";

// Components
import SiteNavbar from "@/components/navbar-components/site-navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/client/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for categories
const categories = [
  { id: 1, name: "Fashion", image: "/placeholder-fashion.jpg" },
  { id: 2, name: "Electronics", image: "/placeholder-electronics.jpg" },
  { id: 3, name: "Home & Garden", image: "/placeholder-home.jpg" },
  { id: 4, name: "Beauty", image: "/placeholder-beauty.jpg" },
];

// Mock data for featured products
const featuredProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    imageUrl: "/placeholder-product-1.jpg",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    imageUrl: "/placeholder-product-2.jpg",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 89.99,
    imageUrl: "/placeholder-product-3.jpg",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Backpack",
    price: 49.99,
    imageUrl: "/placeholder-product-4.jpg",
    rating: 4.3,
  },
];

export default async function Home() {
  // Fetch data on the server
  const [products, categories] = await Promise.all([
    ProductService.getProducts(),
    CategoryService.getAllCategories(),
  ]);

  const flatCategories = (cats) => {
    const out = [];
    const walk = (c, level = 0) => {
      c.forEach((cat) => {
        out.push({ id: cat.id, name: cat.name, slug: cat.slug, level });
        if (cat.children?.length) walk(cat.children, level + 1);
      });
    };
    walk(cats);
    return out;
  };

  const categoriesFlat = flatCategories(categories || []);
  const normalizeProducts = (items: any[]) =>
    (items || []).map((p) => ({
      ...p,
      variants: (p.variants || []).map((v: any) => ({
        ...v,
        price: v?.price != null ? Number(v.price) : v?.price,
        cost: v?.cost != null ? Number(v.cost) : v?.cost,
      })),
    }));

  const displayProducts =
    products?.length > 0 ? products.slice(0, 4) : featuredProducts;

  console.log("products", products);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[500px] bg-gray-100">
          <div className="absolute inset-0 bg-black/30 z-10 flex items-center">
            <div className="container mx-auto px-4 text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-2xl">
                Summer Collection 2024
              </h1>
              <p className="text-xl mb-8 max-w-xl">
                Discover our latest arrivals and get 20% off on your first
                purchase.
              </p>
              <Link href="/shop">
                <Button className="bg-white text-black hover:bg-gray-300 px-8 py-6 text-lg">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-r from-black/60 to-transparent"></div>
          </div>
          <Image
            src={HeroSectionImage}
            alt="Summer Collection 2024"
            fill
            loading="eager"
            className="object-cover"
            priority
          />
        </section>

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categoriesFlat &&
                categoriesFlat.slice(0, 6).map((category) => (
                  <Link key={category.id} href={`/shop?category=${category.id}`}>
                    <Card
                      className={`group relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg ${
                        category.level === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <CardHeader className="flex flex-row items-center gap-4">
                        <ShoppingBag className="h-8 w-8 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">
                          Explore our collection of{" "}
                          {category.name.toLowerCase()} products.
                        </p>
                      </CardContent>
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-300 rounded-lg transition-colors" />
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <Link
                href="/new-arrivals"
                className="flex items-center text-gray-600 hover:text-black"
              >
                View All <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Sale</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Up to 50% off on selected items. Limited time offer!
            </p>
            <Link href="/shop">
              <Button variant="outline" className="border-white text-black cursor-pointer">
                Shop the Sale
              </Button>
            </Link>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Best Sellers</h2>
              <Link
                href="/best-sellers"
                className="flex items-center text-gray-600 hover:text-black"
              >
                View All <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayProducts.map((product) => (
                <ProductCard key={`best-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 mb-8">
              Get the latest updates on new products and upcoming sales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Button className="px-8 py-4 cursor-pointer h-full">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
