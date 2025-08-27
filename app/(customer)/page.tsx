import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductService } from "@/lib/services/product.service";
import { CategoryService } from "@/lib/services/category.service";

export default async function CustomerHomePage() {
  const [products, categories] = await Promise.all([
    ProductService.getProducts(),
    CategoryService.getAllCategories(),
  ]);

  const featured = products?.[0];
  const recentProducts = (products || []).slice(0, 10);

  // flatten categories to get recent 5
  const flatCategories = (cats: any[]) => {
    const out: any[] = [];
    const walk = (arr: any[]) => {
      arr.forEach((c) => {
        out.push(c);
        if (c.children?.length) walk(c.children);
      });
    };
    walk(cats || []);
    return out;
  };
  const categoriesFlat = flatCategories(categories || []).slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-6 rounded-lg bg-gradient-to-r from-gray-900 to-gray-700 p-6 text-white">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-semibold">{featured?.name ?? "Featured Product"}</h1>
          <p className="mt-2 text-white/80 line-clamp-2">
            {featured?.description ?? "Hand-picked item just for you."}
          </p>
          {featured?.variants?.[0]?.price != null && (
            <p className="mt-4 text-2xl font-bold">
              ${featured.variants[0].price.toFixed(2)}
            </p>
          )}
          <div className="mt-4">
            <Button asChild>
              <Link href={featured ? `/products/${featured.id}` : "/products"}>Shop Now</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-56 w-full bg-white rounded-md">
          <Image
            src={featured?.images?.[0]?.url || "/next.svg"}
            alt={featured?.name || "Featured"}
            fill
            className="object-contain p-6"
          />
        </div>
      </section>

      {/* Recent Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Categories</h2>
          <Link href="/categories" className="text-sm text-gray-600 hover:underline">View all</Link>
        </div>
        {categoriesFlat.length === 0 ? (
          <p className="text-sm text-gray-500">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categoriesFlat.map((c) => (
              <Link key={c.id} href={`/categories/${c.slug}`}>
                <Card className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                    <div className="relative h-16 w-16 bg-gray-50 rounded">
                      <Image src="/next.svg" alt={c.name} fill className="object-contain p-3" />
                    </div>
                    <span className="text-sm font-medium">{c.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Offer Section */}
      <section className="rounded-lg border bg-white p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Summer Sale</h3>
            <p className="text-gray-600">Save up to 30% on selected items this week only.</p>
          </div>
          <Button asChild>
            <Link href="/products">Shop Deals</Link>
          </Button>
        </div>
      </section>

      {/* Recent Products Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Products</h2>
          <Link href="/products" className="text-sm text-gray-600 hover:underline">Browse all</Link>
        </div>
        {recentProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentProducts.map((p: any) => (
              <Card key={p.id} className="overflow-hidden">
                <div className="relative h-36 w-full bg-gray-50">
                  <Image src={p.images?.[0]?.url || "/next.svg"} alt={p.name} fill className="object-contain p-3" />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-base">{p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
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
                <CardFooter>
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/products/${p.id}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
