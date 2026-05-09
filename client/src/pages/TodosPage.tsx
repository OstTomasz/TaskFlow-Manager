import { Layout } from "@/components";
import { useTodos } from "@/features/todos/hooks/useTodos";
import { useTodoFilters } from "@/features/todos/hooks/useTodoFilters";
import { FunnelPlus, Plus } from "lucide-react";
import { TodoFilterDrawer } from "@/features/todos/components/TodoFilterDrawer";
import { useState } from "react";
import { TodoList } from "@/features/todos/components/TodoList";
import { TodoCreateDrawer } from "@/features/todos/components/TodoCreateDrawer";
import { TodoEmptyState } from "@/features/todos/components/TodoEmptyState";
import { TodoPagination } from "@/features/todos/components/TodoPagination";

export const TodosPage = () => {
  const { todos } = useTodos();
  const { paginated, page, setPage, totalPages, ...paginatedProps } =
    useTodoFilters(todos);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  return (
    <Layout>
      <div className="flex gap-(--space-sm) my-4 mx-auto">
        {todos.length > 0 ? (
          <button
            type="button"
            className="comic-btn"
            onClick={() => setIsFilterDrawerOpen(true)}
          >
            <FunnelPlus /> <span>Show filters</span>
          </button>
        ) : null}
        <button
          type="button"
          className="comic-btn comic-btn-primary"
          onClick={() => setIsCreateDrawerOpen(true)}
        >
          <Plus className="stroke-ink" />
          <span>Create task</span>
        </button>
      </div>
      {todos.length === 0 ? (
        <TodoEmptyState variant="empty" />
      ) : paginated.length === 0 ? (
        <TodoEmptyState variant="filtered" />
      ) : (
        <TodoList todos={paginated} />
      )}
      <TodoPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <TodoFilterDrawer
        isOpen={isFilterDrawerOpen}
        handleClose={() => setIsFilterDrawerOpen(false)}
        {...paginatedProps}
      />

      <TodoCreateDrawer
        isOpen={isCreateDrawerOpen}
        handleClose={() => setIsCreateDrawerOpen(false)}
      />
    </Layout>
  );
};
