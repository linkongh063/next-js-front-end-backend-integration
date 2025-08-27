import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductService } from "@/lib/services/product.service";
import { CategoryService } from "@/lib/services/category.service";
import SiteNavbar from "@/components/navbar-components/site-navbar";
import Footer from "@/components/footer";

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

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero */}
          <section className="flex flex-col md:flex-row items-center gap-6 rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 p-6 text-white">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-semibold">Discover products you’ll love</h1>
              <p className="mt-2 text-white/80">Browse our curated collection across categories and brands.</p>
              <div className="mt-4 flex gap-3">
                <Link href="/products"><Button size="sm">Shop now</Button></Link>
                <Link href="/categories"><Button size="sm" variant="secondary">All categories</Button></Link>
              </div>
            </div>
            <div className="relative h-32 w-full md:h-40 md:w-80">
              <Image src="/next.svg" alt="Hero" fill className="object-contain" />
            </div>
          </section>

          {/* Categories */}
          <section className="mt-10">
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
          </section>

          {/* Products */}
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Featured products</h2>
              <Link href="/products" className="text-sm text-gray-600 hover:underline">Browse all</Link>
            </div>
            {(!products || products.length === 0) ? (
              <p className="text-sm text-gray-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.slice(0, 12).map((p) => {
                  const cover = p.images?.[0]?.url || "/next.svg";
                  return (
                    <Card key={p.id} className="overflow-hidden">
                      <div className="relative h-40 w-full bg-gray-50">
                        <Image src={cover} alt={p.name} fill className="object-contain p-3" />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1 text-base">{p.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {p.brand?.name && <span>{p.brand.name}</span>}
                          {p.category?.name && (
                            <span className="inline-flex items-center gap-1">
                              <span className="h-1 w-1 rounded-full bg-gray-300 inline-block" />
                              {p.category.name}
                            </span>
                          )}
                        </div>
                        {p.variants?.length ? (
                          <p className="mt-2 text-gray-900 font-medium">
                            ${p.variants[0].price?.toFixed(2) ?? "-"}
                          </p>
                        ) : null}
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button asChild size="sm" className="w-full">
                          <Link href={`/products/${p.id}`}>View</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>


  );
}
