import type { Todo } from "@taskflow/shared";
import { useMemo, useState } from "react";

type SortOptions = "creationDate" | "priority" | "status";
const PRIORITY_WEIGHT = { low: 0, medium: 1, high: 2, crucial: 3 } as const;
const STATUS_WEIGHT = { todo: 0, in_progress: 1, done: 2 } as const;

export const useTodoFilters = (todos: Todo[]) => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<Todo["status"][]>([]);
  const [priorityFilter, setPriorityFilter] = useState<Todo["priority"][]>([]);
  const [sortBy, setSortBy] = useState<SortOptions>("creationDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(
    () =>
      todos
        .filter(
          search
            ? (todo) =>
                todo.title.toLowerCase().includes(search.toLowerCase().trim())
            : () => true,
        )
        .filter(
          statusFilter.length > 0
            ? (todo) => statusFilter.includes(todo.status)
            : () => true,
        )
        .filter(
          priorityFilter.length > 0
            ? (todo) => priorityFilter.includes(todo.priority)
            : () => true,
        )
        .sort((a, b) => {
          let result = 0;
          if (sortBy === "creationDate")
            result =
              new Date(b.creationDate).getTime() -
              new Date(a.creationDate).getTime();
          else if (sortBy === "priority")
            result = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
          else if (sortBy === "status")
            result = STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];

          return sortOrder === "desc" ? result : -result;
        }),
    [todos, search, statusFilter, priorityFilter, sortBy, sortOrder],
  );

  const resetFilters = () => {
    setSearch("");
    setStatusFilter([]);
    setPriorityFilter([]);
    setSortBy("creationDate");
    setSortOrder("desc");
  };

  return {
    filtered,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
  };
};
