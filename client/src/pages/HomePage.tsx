import { Layout } from "@/components";
import { UserList } from "@/features/auth/components/UserList";
import { CreateUser } from "@/features/createUser/components/CreateUser";

export const HomePage = () => {
  return (
    <Layout>
      <div className="h-full flex flex-col justify-around items-center">
        <UserList />
        <CreateUser />
      </div>
    </Layout>
  );
};
