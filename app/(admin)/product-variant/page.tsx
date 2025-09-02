// app/admin/product-variants/page.tsx

import ProductVariantPage from "@/containers/admin/product-variants/ProductVariantTable";
import { BASE_URL } from "@/utils/api";

export default async function ProductVariantsPage() {
  const [productVariantsRes, productsRes] = await Promise.all([
    fetch(`${BASE_URL}/product-variants`, { cache: "no-store" }),
    fetch(`${BASE_URL}/products`, { cache: "no-store" }),
  ]);
  console.log('error',  productsRes)
  if (
    !productVariantsRes.ok ||
    !productsRes.ok
      ) {
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
