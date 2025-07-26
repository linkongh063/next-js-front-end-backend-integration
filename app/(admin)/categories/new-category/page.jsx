"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCategory() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { name, slug, parentId };
    console.log('category', categoryData)
    const response = await fetch("/api/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (response.ok) {
      router.push("/admin/categories"); // Redirect to categories page after successful submission
    } else {
      console.error("Failed to create category");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <button
        onClick={() => router.push("/categories")}
        className="bg-gray-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Create New Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="parentId"
            className="block text-sm font-medium text-gray-700"
          >
            Parent Category ID (Optional)
          </label>
          <input
            id="parentId"
            type="text"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Category
        </button>
      </form>
    </div>
  );
}
