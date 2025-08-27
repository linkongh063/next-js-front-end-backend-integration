import { ProductService } from "@/lib/services/product.service";
import Image from "next/image";

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const product = await ProductService.getProductById(params.id);
  if (!product) return <div className="container py-8">Product not found.</div>;

  const cover =
    product.images?.find((i: any) => i.isFeatured)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    "/next.svg";

  const prices: number[] = Array.isArray(product.variants)
    ? product.variants
        .map((v: any) => {
          const n = Number(v?.price);
          return isNaN(n) ? undefined : n;
        })
        .filter((n: number | undefined): n is number => n != null)
    : [];
  const minPrice = prices.length ? Math.min(...prices) : undefined;

  return (
    <div className="container py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative w-full aspect-square bg-gray-50">
        <Image src={cover} alt={product.name} fill className="object-contain p-4" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        {minPrice != null && (
          <p className="mt-2 text-xl text-gray-900">${minPrice.toFixed(2)}</p>
        )}
        {product.brand?.name && (
          <p className="mt-2 text-sm text-gray-600">Brand: {product.brand.name}</p>
        )}
        {product.category?.name && (
          <p className="text-sm text-gray-600">Category: {product.category.name}</p>
        )}
        {product.description && (
          <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">{product.description}</p>
        )}
      </div>
    </div>
  );
}
