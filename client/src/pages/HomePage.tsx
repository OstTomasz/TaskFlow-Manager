import { Layout } from "@/components";
import { UserList } from "@/features/auth/components/UserList";
import { UserRoundPlus } from "lucide-react";

export const HomePage = () => {
  return (
    <Layout>
      <div className="h-full flex flex-col justify-around items-center">
        <h2>Identify Yourself</h2>

        <UserList />

        {/* New user */}
        <div className="border p-(--space-sm)">
          <h3>Create New User</h3>
          <button className="flex mx-auto py-(--space-sm)">
            <UserRoundPlus size={70} />
          </button>
          {/* After clicking button - it dissapear and appear form */}
          <form className="flex flex-col ">
            <select>Select avatar</select>
            <input placeholder="name"></input>
            <input placeholder="password"></input>
            <input placeholder="confirm password"></input>
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};
