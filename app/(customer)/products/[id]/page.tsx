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
  console.log('product::',product)
  return (
    <ProductDetails product={product} />
  );
}
