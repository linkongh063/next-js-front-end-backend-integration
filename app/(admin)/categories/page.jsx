"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const deleteCategory = async (category) => {
    try {
      const res = await fetch(`/api/category/${category.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Deleted successfully:", data);
      } else {
        console.error("Delete failed:", data.error);
      }
      fetchCategories()
    } catch (error) {
      console.error("Error while deleting:", error);
    }
  };

  const renderCategoryTree = (category) => (
    <li key={category.id} className="border-4 p-2 rounded bg-red-200 my-2">
      <div className="bg-amber-200 px-4 flex justify-between items-center">
        <div className="flex items-center py-1">
          <h2 className="text-lg font-semibold">{category.name}</h2>
          <p className="px-4">Slug: {category.slug}</p>
        </div>
        <button
          onClick={() => deleteCategory(category)}
          className="px-4 text-white font-bold hover:cursor-pointer hover:bg-red-900 py-1 rounded bg-red-500 my-2"
        >
          X
        </button>
      </div>
      {category.children && category.children.length > 0 && (
        <ul className="ml-4 space-y-2">
          {category.children.map((child) => renderCategoryTree(child))}
        </ul>
      )}
    </li>
  );

  async function fetchCategories() {
    try {
      // Simulating API call with JSON data
      const response = await fetch("/api/category");
      const data = await response.json();
      console.log("data", data);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

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
