import { Layout } from "@/components";
import { UserList } from "@/features/auth/components/UserList";
import { CreateUser } from "@/features/createUser/components/CreateUser";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Loader } from "lucide-react";

export const HomePage = () => {
  const isNavigating = useAuthStore((s) => s.isNavigating);

  return (
    <Layout>
      {isNavigating ? (
        /**
         * Full-screen overlay shown during login → /todos transition.
         * Gives visual feedback while React Router mounts the new route.
         */
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-(--bg-primary)">
          <Loader className="w-12 h-12 animate-spin text-(--accent)" />
          <p className="text-lg font-bold">Loading your tasks...</p>
        </div>
      ) : null}
      <div className="h-full flex flex-col justify-around items-center">
        <UserList />
        <CreateUser />
      </div>
    </Layout>
  );
};
