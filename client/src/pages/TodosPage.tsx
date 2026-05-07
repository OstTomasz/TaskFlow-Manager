import { Layout } from "@/components";
import { useTodos } from "@/features/todos/hooks/useTodos";
import { useTodoFilters } from "@/features/todos/hooks/useTodoFilters";
import { FunnelPlus, Plus } from "lucide-react";
import { TodoFilterDrawer } from "@/features/todos/components/TodoFilterDrawer";
import { useState } from "react";
import { TodoList } from "@/features/todos/components/TodoList";
import { TodoCreateDrawer } from "@/features/todos/components/TodoCreateDrawer";

export const TodosPage = () => {
  const { todos } = useTodos();
  const { filtered, ...filterProps } = useTodoFilters(todos);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  return (
    <Layout>
      <div className="flex gap-(--space-sm) my-4 mx-auto">
        <button
          type="button"
          className="comic-btn flex gap-1 items-center justify-center"
          onClick={() => setIsFilterDrawerOpen(true)}
        >
          <FunnelPlus /> Show filters
        </button>
        <button
          type="button"
          className="comic-btn comic-btn-primary flex gap-1 items-center justify-center"
          onClick={() => setIsCreateDrawerOpen(true)}
        >
          <Plus className="stroke-ink" /> Create task
        </button>
      </div>
      <TodoList todos={filtered} />

      <TodoFilterDrawer
        isOpen={isFilterDrawerOpen}
        handleClose={() => setIsFilterDrawerOpen(false)}
        {...filterProps}
      />

      <TodoCreateDrawer
        isOpen={isCreateDrawerOpen}
        handleClose={() => setIsCreateDrawerOpen(false)}
      />
    </Layout>
  );
};
