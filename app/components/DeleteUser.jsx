"use client";

import { useRouter } from 'next/navigation'

export default function DeleteUser({ id }) {
  const router = useRouter()
  async function handleDelete() {
    const res = await fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      //   revalidatePath("/user");
       router.push('/user')
    } else {
      alert("Failed to delete user");
    }
  }
  return (
    <div>
      <button type="submit" className="btn" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}
