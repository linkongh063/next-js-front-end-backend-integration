import React from 'react'
import ProductTable from "@/containers/admin/product/ProductTable";
import { BASE_URL } from '@/utils/api';
export default async function page() {
  const [productRes, brandRes, categoriesRes] = await Promise.all([
    fetch(`${BASE_URL}/products`, { cache: "no-store" }),
    fetch(`${BASE_URL}/brands`, { cache: "no-store" }),
    fetch(`${BASE_URL}/category`, { cache: "no-store" }),
  ]); 

  if (!productRes.ok || !brandRes.ok || !categoriesRes.ok) {
    console.error("API fetch error", {
      products: productRes.statusText,
      brands: brandRes.statusText,
      categories: categoriesRes.statusText,
    });
    return <div>Error loading data</div>;
  }

  const [product, brands, categories] = await Promise.all([
    productRes.json(),
    brandRes.json(),
    categoriesRes.json(),
  ]);

  return (
    <div>
      <ProductTable propsProducts={product} propsBrands={brands} propsCategories={categories} />
    </div>
  )
}
