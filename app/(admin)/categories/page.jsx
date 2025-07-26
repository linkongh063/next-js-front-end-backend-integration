"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Simulating API call with JSON data
        const response = await fetch("/api/category");
        const data = await response.json();
        console.log('data', data)
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const renderCategoryTree = (category) => (
    <li key={category.id} className="border p-2 rounded">
      <h2 className="text-lg font-semibold">{category.name}</h2>
      <p>Slug: {category.slug}</p>
      {category.children && category.children.length > 0 && (
        <ul className="ml-4 space-y-2">
          {category.children.map((child) => renderCategoryTree(child))}
        </ul>
      )}
    </li>
  );

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Category Page</h1>
        <Link href="/categories/new-category">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Add New Category
          </button>
        </Link>
      </div>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => renderCategoryTree(category))}
        </ul>
      )}
    </div>
  );
}
