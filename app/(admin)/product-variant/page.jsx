// app/admin/product-variants/page.tsx

import ProductVariantPage from "@/containers/admin/product-variants/ProductVariantTable";

export default async function ProductVariantsPage() {
  const [productVariantsRes, productsRes] = await Promise.all([
    fetch(`/api/product-variants`, { cache: "no-store" }),
    fetch(`/api/products`, { cache: "no-store" }),
  ]);

  if (!productVariantsRes.ok || !productsRes.ok) {
    console.error("API fetch error", {
      productVariants: productVariantsRes.statusText,
      products: productsRes.statusText,
    });

    return <div>Error loading data</div>;
  }

  const [productVariantData, productsData] = await Promise.all([
    productVariantsRes.json(),
    productsRes.json(),
  ]);

  return (
    <div>
      <ProductVariantPage
        productVariant={productVariantData}
        product={productsData}
      />
    </div>
  );
}
