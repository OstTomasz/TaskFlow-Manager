import { Layout } from "@/components";
import { useTodos } from "@/features/todos/hooks/useTodos";
import { useTodoFilters } from "@/features/todos/hooks/useTodoFilters";
import { TodoFilters } from "@/features/todos/components/TodoFilters";

export const TodosPage = () => {
  const { todos } = useTodos();
  const filters = useTodoFilters(todos);
  return (
    <Layout>
      <div className="p-4">
        <TodoFilters
          search={filters.search}
          setSearch={filters.setSearch}
          statusFilter={filters.statusFilter}
          setStatusFilter={filters.setStatusFilter}
          priorityFilter={filters.priorityFilter}
          setPriorityFilter={filters.setPriorityFilter}
          sortBy={filters.sortBy}
          setSortBy={filters.setSortBy}
          sortOrder={filters.sortOrder}
          setSortOrder={filters.setSortOrder}
          resetFilters={filters.resetFilters}
        />
        <pre>{JSON.stringify(filters.filtered, null, 2)}</pre>
      </div>
    </Layout>
  );
};
