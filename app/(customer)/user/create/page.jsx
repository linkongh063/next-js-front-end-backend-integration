"use client";
// import prisma from "@/lib/prisma";
import { useState } from "react";
import { BASE_URL } from "@/utils/api";
export default function page() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user form", form);
    const res = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await fetch(`${BASE_URL}/user`);
    const users = await data.json();
    setForm({ name: "", email: "" });
    setUsers(users);
  };
  return (
    <div>
      <div>
        <h1>Create User</h1>
        <form
          onSubmit={handleSubmit}
          className="border border-amber-300 flex justify-center items-center"
        >
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            required
            className="border mx-4 my-2"
            type="text"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            required
            className="border mx-4 my-2"
          />
          <button type="submit" className="px-4 border hover:bg-amber-700">
            Add
          </button>
        </form>

        <h2 className="text-center capitalize py-8">User List</h2>
        <ul>
          {users.map((user) => (
            <div key={user.id} className="flex m-4 p-2 border border-red-500">
              <p className="mx-1 border-r-2 px-1">{user.id}.</p>
              <p className="mx-1 border-r-2 px-1">{user.name}</p>
              <p className="mx-1 border-r-2 px-1">{user.email}</p>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
