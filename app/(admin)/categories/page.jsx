import { Skeleton } from "@/components/ui/skeleton";
import Table from "@/containers/admin/categories/CategoryTable";
import { BASE_URL } from "@/utils/api";
import React, { Suspense } from "react";

export default async function page() {
  const categories = await fetch(`${BASE_URL}/category`);
  const data = await categories.json();
  if (!categories.ok) {
    console.error("Failed to fetch categories:", categories.statusText);
    return <div>Error loading categories</div>;
  }
  console.log("Fetched categories:", data);
  return (
    <div>
      <Suspense fallback={<div><Skeleton /></div>}>
        <Table data={data} />
      </Suspense>
    </div>
  );
}
