import { Loader } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { UserCard } from "./UserCard";
import { useLocation } from "react-router-dom";

export const UserList = () => {
  const { users, isLoading, isError } = useUsers();

  const { pathname } = useLocation();

  if (isLoading)
    return (
      <p>
        <Loader className="animate-spin inline" /> Loading data
      </p>
    );
  if (isError) return <p>Cannot load users. Try reload page.</p>;

  return (
    <>
      <h2 className="text-2xl">
        {users.length > 0 ? "Identify Yourself" : null}
      </h2>
      <ul className="max-w-3xl flex flex-wrap items-center justify-center gap-(--space-md) mx-auto my-(--space-md)">
        {users.map((user) => (
          <UserCard key={user.id + pathname} user={user} />
        ))}
      </ul>
    </>
  );
};
