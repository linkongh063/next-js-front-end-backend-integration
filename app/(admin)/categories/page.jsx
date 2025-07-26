"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
const data = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    parentId: null,
    children: [
      {
        id: "2",
        name: "Mobile Phones",
        slug: "mobile-phones",
        parentId: "1",
      },
      {
        id: "3",
        name: "Laptops",
        slug: "laptops",
        parentId: "1",
      },
      {
        id: "4",
        name: "Cameras",
        slug: "cameras",
        parentId: "1",
      },
    ],
  },
  {
    id: "5",
    name: "Fashion",
    slug: "fashion",
    parentId: null,
    children: [
      {
        id: "6",
        name: "Men's Clothing",
        slug: "mens-clothing",
        parentId: "5",
      },
      {
        id: "7",
        name: "Women's Clothing",
        slug: "womens-clothing",
        parentId: "5",
      },
      {
        id: "8",
        name: "Accessories",
        slug: "accessories",
        parentId: "5",
      },
    ],
  },
  {
    id: "9",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    parentId: null,
    children: [
      {
        id: "10",
        name: "Furniture",
        slug: "furniture",
        parentId: "9",
      },
      {
        id: "11",
        name: "Appliances",
        slug: "appliances",
        parentId: "9",
      },
      {
        id: "12",
        name: "Decor",
        slug: "decor",
        parentId: "9",
      },
    ],
  },
  {
    id: "13",
    name: "Books",
    slug: "books",
    parentId: null,
    children: [
      {
        id: "14",
        name: "Fiction",
        slug: "fiction",
        parentId: "13",
      },
      {
        id: "15",
        name: "Non-Fiction",
        slug: "non-fiction",
        parentId: "13",
      },
      {
        id: "16",
        name: "Educational",
        slug: "educational",
        parentId: "13",
      },
    ],
  },
  {
    id: "17",
    name: "Sports",
    slug: "sports",
    parentId: null,
    children: [
      {
        id: "18",
        name: "Outdoor",
        slug: "outdoor",
        parentId: "17",
      },
      {
        id: "19",
        name: "Indoor",
        slug: "indoor",
        parentId: "17",
      },
      {
        id: "20",
        name: "Fitness",
        slug: "fitness",
        parentId: "17",
      },
    ],
  },
];
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
