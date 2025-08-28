import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductService } from "@/lib/services/product.service";
import { CategoryService } from "@/lib/services/category.service";
import SiteNavbar from "@/components/navbar-components/site-navbar";
import Footer from "@/components/footer";
import HeroSection from "@/components/client/homepage/HeroSection";
import CategoriesSection from "@/components/client/homepage/CategoriesSection";
import { ShoppingBag } from "lucide-react";
import ProductListing from "@/components/client/ProductListing";

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
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero */}
          <HeroSection />

          {/* Categories */}
          <section className="mt-10 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Shop by Category
              </h2>
              <Link href="/shop">
                <Button variant="outline" className="text-sm hover:bg-gray-100">
                  View All Products
                </Button>
              </Link>
            </div>
            {categoriesFlat && categoriesFlat.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">
                No categories available.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoriesFlat &&
                  categoriesFlat.slice(0, 6).map((category) => (
                    <Link key={category.id} href={`/shop`}>
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
            )}
          </section>
          {/* <CategoriesSection categories={categories} /> */}

          {/* <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Categories</h2>
              <Link href="/categories" className="text-sm text-gray-600 hover:underline">View all</Link>
            </div>
            {categoriesFlat.length === 0 ? (
              <p className="text-sm text-gray-500">No categories found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categoriesFlat.slice(0, 16).map((c) => (
                  <Link key={c.id} href={`/categories/${c.slug}`}>
                    <Badge variant={c.level === 0 ? "default" : "secondary"}>{c.name}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </section> */}

          {/* Products */}
          <div className="py-8 px-8">
            <h2 className="text-2xl font-bold text-gray-900 py-8">
              Our Recent Products
            </h2>
            <ProductListing
              initialProducts={normalizeProducts(products || [])}
              categories={flatCategories(categories || [])}
              showPagination={false}
              showFilters={false}
            />
          </div>

          {/* Offer Section */}
          <section className="rounded-lg border bg-white p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Summer Sale</h3>
                <p className="text-gray-600">
                  Save up to 30% on selected items this week only.
                </p>
              </div>
              <Button asChild>
                <Link href="/products">Shop Deals</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
