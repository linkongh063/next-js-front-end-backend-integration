import Link from "next/link";
import { UserService } from '@/lib/services/user.service';
import UserList from "../../components/UserList";

export default async function Page() {
  const users = await UserService.getAllUsers();
  console.log('users', users)
  // const res = await fetch("http://localhost:3000/api/user");
  // const users = await res.json();
  // console.log("all users data", users);
  return (
    <div>
      <div className="border flex justify-between items-center px-4 py-4">
        <h1 className="text-center capitalize py-4  mb-2">User Page</h1>
        <Link href={"/user/create"}>
          <button className="px-8 py-2 border bg-sky-300 hover:bg-amber-200 hover:cursor-pointer">
            +User
          </button>
        </Link>
      </div>
      <div>
        <UserList users={users} />
      </div>
    </div>
  );
}
