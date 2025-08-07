import { BASE_URL } from "@/utils/api";
import { log } from "console";
import React, { Suspense } from "react";
import Table from "@/containers/admin/brand/BandTable";
import { Skeleton } from "@/components/ui/skeleton";
export default async function page() {
  const brands = await fetch(BASE_URL + "/brands");
  if (!brands.ok) {
    console.error("Failed to fetch brands:", brands.statusText);
    return <div>Error loading brands</div>;
  }
  const data = await brands.json();
  console.log("# Fetched brands #:", data.length);
  return (
    <div>
      <Suspense fallback={<div><Skeleton /></div>}>
        {/* Suspense is used to handle loading state */}
        <Table data={data} />
      </Suspense>
    </div>
  );
}
