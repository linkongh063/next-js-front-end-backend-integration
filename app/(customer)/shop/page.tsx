import ProductListing from "@/components/client/ProductListing";
import { CategoryService } from "@/lib/services/category.service";
import { ProductService } from "@/lib/services/product.service";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([
    ProductService.getProducts(),
    CategoryService.getAllCategories(),
  ]);

  // console.log("products", products);
  // console.log("categories", categories);
  // Convert Prisma Decimal and other non-plain values to plain JS before passing to Client Component
  const normalizeProducts = (items: any[]) =>
    (items || []).map((p) => ({
      ...p,
      variants: (p.variants || []).map((v: any) => ({
        ...v,
        price: v?.price != null ? Number(v.price) : v?.price,
        cost: v?.cost != null ? Number(v.cost) : v?.cost,
      })),
    }));

  const flatCategories = (cats: any[]) => {
    const out: any[] = [];
    const walk = (arr: any[]) => {
      arr.forEach((c) => {
        out.push({ id: c.id, name: c.name });
        if (c.children?.length) walk(c.children);
      });
    };
    walk(categories || []);
    return out;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner */}
      <section className="rounded-lg bg-gray-900 text-white p-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Shop Our Products</h1>
        <p className="text-white/80 mt-1">Discover a wide selection with powerful filtering options.</p>
      </section>

      <ProductListing
        initialProducts={normalizeProducts(products || [])}
        categories={flatCategories(categories || [])}
        initialCategoryId={sp?.category ?? "all"}
      />
    </div>
  );
}
