import { TODO_PRIORITIES, TODO_STATUSES, type Todo } from "@taskflow/shared";

export interface TodoFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: Todo["status"][];
  setStatusFilter: (val: Todo["status"][]) => void;
  priorityFilter: Todo["priority"][];
  setPriorityFilter: (val: Todo["priority"][]) => void;
  sortBy: "creationDate" | "priority" | "status";
  setSortBy: (val: "creationDate" | "priority" | "status") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (val: "asc" | "desc") => void;
  resetFilters: () => void;
  layout?: "row" | "col";
  isOpen?: boolean;
  handleClose?: () => void;
}

export const STATUS_OPTIONS = TODO_STATUSES;
export const PRIORITY_OPTIONS = TODO_PRIORITIES;

export const SORT_OPTIONS = ["creationDate", "priority", "status"] as const;

export const toggleChip = <T>(current: T[], value: T): T[] =>
  current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];

export const formatLabel = (label: string): string =>
  label
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (c) => c.toUpperCase());
