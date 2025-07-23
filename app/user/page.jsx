import Link from "next/link";
export default async function Page() {
  const res = await fetch("http://localhost:3000/api/user");
  const users = await res.json();
  console.log("all users data", users);
  return (
    <div>
      <div className="border flex justify-between items-center px-4 py-4">
        <h1 className="text-center capitalize py-4  mb-2">User Page</h1>
        <Link href={'/user/create'}>
          <button className="px-8 py-2 border bg-sky-300 hover:bg-amber-200 hover:cursor-pointer">
            +User
          </button>
        </Link>
      </div>
      <div className="border ">
        {users.map((user) => (
          <div key={user.id} className="flex m-4 p-2 border border-red-500">
            <p className="mx-1">{user.id}.</p>
            <p className="mx-1">{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
