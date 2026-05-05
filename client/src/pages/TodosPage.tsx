import { Layout } from "@/components";
import { useTodos } from "@/features/todos/hooks/useTodos";
import { useTodoFilters } from "@/features/todos/hooks/useTodoFilters";
import { FunnelPlus } from "lucide-react";
import { TodoFilterDrawer } from "@/features/todos/components/TodoFilterDrawer";
import { useState } from "react";

export const TodosPage = () => {
  const { todos } = useTodos();
  const { filtered, ...filterProps } = useTodoFilters(todos);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  //TO DELETE
  console.log(filtered);

  return (
    <Layout>
      <div className="p-4">
        <button
          type="button"
          className="comic-btn flex gap-1 mx-auto"
          onClick={() => setIsDrawerOpen(true)}
        >
          <FunnelPlus /> Show filters
        </button>
      </div>
      <TodoFilterDrawer
        isOpen={isDrawerOpen}
        handleClose={() => setIsDrawerOpen(false)}
        {...filterProps}
      />
    </Layout>
  );
};
