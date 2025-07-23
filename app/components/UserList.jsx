import DeleteUser from "./DeleteUser";

export default function UserList({ users }) {
  return (
    <div>
      <div className="border ">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex m-4 p-2 border border-red-500 justify-between"
          >
            <div className="flex">
              <p className="mx-1">{user.id}.</p>
              <p className="mx-1">{user.name}</p>
              <p className="mx-1">{user.email}</p>
            </div>
            <DeleteUser id={user.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
