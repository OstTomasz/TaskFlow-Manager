import { Layout } from "@/components";
import { UserList } from "@/features/auth/components/UserList";
import { CreateUser } from "@/features/createUser/components/CreateUser";

export const HomePage = () => {
  return (
    <Layout>
      <div className="h-full flex flex-col justify-around items-center">
        <h2 className="mt-4">Identify Yourself</h2>
        <UserList />
        <CreateUser />
      </div>
    </Layout>
  );
};
