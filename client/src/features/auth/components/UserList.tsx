import { Loader } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { UserCard } from "./UserCard";
import { useLocation } from "react-router-dom";

export const UserList = () => {
  const { data, isLoading, isError } = useUsers();

  const { pathname } = useLocation();

  if (isLoading)
    return (
      <p>
        <Loader className="animate-spin inline" /> Loading data
      </p>
    );
  if (isError) return <p>Cannot load users. Try reload page.</p>;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-(--space-md) px-(--space-md) my-(--space-md)">
      {data.map((user) => {
        return <UserCard key={user.id + pathname} user={user} />;
      })}
    </ul>
  );
};
