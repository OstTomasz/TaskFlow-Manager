import { Layout } from "@/components";
import { useTodos } from "@/features/todos/hooks/useTodos";
import { useTodoFilters } from "@/features/todos/hooks/useTodoFilters";
import { FunnelPlus } from "lucide-react";
import { TodoFilterDrawer } from "@/features/todos/components/TodoFilterDrawer";
import { useState } from "react";
import { TodoList } from "@/features/todos/components/TodoList";
import { useAuthStore } from "@/features/auth/store/authStore";

export const TodosPage = () => {
  const { todos } = useTodos();
  const { filtered, ...filterProps } = useTodoFilters(todos);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuthStore();

  console.log("todos:", todos);
  console.log("filtered:", filtered);
  console.log("user:", user);

  //TO DELETE
  console.log(filtered);

  return (
    <Layout>
      <div className="m-4">
        <button
          type="button"
          className="comic-btn flex gap-1 mx-auto"
          onClick={() => setIsDrawerOpen(true)}
        >
          <FunnelPlus /> Show filters
        </button>
      </div>
      <TodoList todos={filtered} />

      <TodoFilterDrawer
        isOpen={isDrawerOpen}
        handleClose={() => setIsDrawerOpen(false)}
        {...filterProps}
      />
    </Layout>
  );
};
