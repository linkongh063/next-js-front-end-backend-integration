import { ProductService } from "@/lib/services/product.service";
import ProductDetails from "@/components/client/product/ProductDetails";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await ProductService.getProductById(id);
  if (!product) return <div className="container py-8">Product not found.</div>;
  
  // Serialize Decimal fields to strings for client component
  const serializedProduct = {
    ...product,
    variants: product.variants?.map(variant => ({
      ...variant,
      price: variant.price.toString(),
      cost: variant.cost?.toString() || null,
    })) || []
  };
  
  return (
    <div>
      <ProductDetails product={serializedProduct} />
    </div>
  );
}
