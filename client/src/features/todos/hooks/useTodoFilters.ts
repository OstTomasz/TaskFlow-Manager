import { useMemo, useState } from "react";
import type { Todo } from "@taskflow/shared";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type SortOptions = "creationDate" | "priority" | "status";
const PRIORITY_WEIGHT = { low: 0, medium: 1, high: 2, crucial: 3 } as const;
const STATUS_WEIGHT = { todo: 0, in_progress: 1, done: 2 } as const;

export const useTodoFilters = (todos: Todo[]) => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<Todo["status"][]>([
    "todo",
    "in_progress",
  ]);
  const [priorityFilter, setPriorityFilter] = useState<Todo["priority"][]>([]);
  const [sortBy, setSortBy] = useState<SortOptions>("priority");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const isShortScreen = useMediaQuery("(max-height: 630px)");
  const pageSize = isShortScreen ? 5 : 10;
  const [page, setPage] = useState(1);

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

  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  );

  const handleSetSearch = (v: string) => {
    setPage(1);
    setSearch(v);
  };
  const handleSetStatusFilter = (v: Todo["status"][]) => {
    setPage(1);
    setStatusFilter(v);
  };
  const handleSetPriorityFilter = (v: Todo["priority"][]) => {
    setPage(1);
    setPriorityFilter(v);
  };
  const handleSetSortBy = (v: SortOptions) => {
    setPage(1);
    setSortBy(v);
  };
  const handleSetSortOrder = (v: "asc" | "desc") => {
    setPage(1);
    setSortOrder(v);
  };

  const resetFilters = () => {
    setPage(1);
    setSearch("");
    setStatusFilter(["todo", "in_progress"]);
    setPriorityFilter([]);
    setSortBy("priority");
    setSortOrder("desc");
  };

  return {
    filtered,
    paginated,
    page,
    setPage,
    totalPages,
    pageSize,
    search,
    setSearch: handleSetSearch,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    priorityFilter,
    setPriorityFilter: handleSetPriorityFilter,
    sortBy,
    setSortBy: handleSetSortBy,
    sortOrder,
    setSortOrder: handleSetSortOrder,
    resetFilters,
  };
};
