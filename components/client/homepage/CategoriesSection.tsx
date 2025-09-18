'use client'
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Shirt, Watch, Smartphone, Laptop, Headphones } from "lucide-react";
import { useEffect, useState } from "react";


type CategoryNode = {
  id: string | number;
  name: string;
  slug?: string;
  children?: CategoryNode[];
};

type FlatCategory = { id: string | number; name: string; slug?: string; level: number };

export default function CategoriesSection({ propsCategories }: { propsCategories: CategoryNode[] }) {
  const [categories, setCategories] = useState<FlatCategory[]>([]);

  const flatCategories = (cats: CategoryNode[]): FlatCategory[] => {
    const out: FlatCategory[] = [];
    const walk = (c: CategoryNode[], level = 0) => {
      c.forEach((cat: CategoryNode) => {
        out.push({ id: cat.id, name: cat.name, slug: cat.slug, level });
        if (cat.children?.length) walk(cat.children, level + 1);
      });
    };
    walk(cats ?? []);
    return out;
  };



  useEffect(() => {
    const categoriesFlat = flatCategories(propsCategories || []);
    setCategories(categoriesFlat);
  }, [propsCategories]);

  return (
    <section className="mt-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
        <Link href="/shop">
          <Button variant="outline" className="text-sm hover:bg-gray-100">
            View All Products
          </Button>
        </Link>
      </div>
      {categories && categories.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No categories available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories && categories.slice(0, 6).map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card
                className={`group relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg ${
                  category.level === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <ShoppingBag className="h-8 w-8 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Explore our collection of {category.name.toLowerCase()} products.
                  </p>
                </CardContent>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-300 rounded-lg transition-colors" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}