import { TODO_PRIORITIES, TODO_STATUSES, type Todo } from "@taskflow/shared";
import { FilterChip } from "./FilterChip";
import { cn } from "@/lib/cn";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

interface TodoFiltersProps {
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
}

const STATUS_OPTIONS = TODO_STATUSES;
const PRIORITY_OPTIONS = TODO_PRIORITIES;
const SORT_OPTIONS = ["creationDate", "priority", "status"] as const;

const toggleChip = <T,>(current: T[], value: T): T[] =>
  current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];

export const TodoFilters = ({
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
}: TodoFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-(--space-sm) items-center justify-center mx-auto">
      <div className="comic-card w-fit h-fit p-3 flex flex-col items-center gap-1">
        <p>Find task</p>
        <input
          type="text"
          value={search}
          placeholder="search your task.."
          onChange={(e) => setSearch(e.target.value)}
          className="comic-input w-65"
        ></input>
      </div>
      <div className="comic-card w-fit h-fit p-3 flex flex-col items-center gap-1">
        <p>Filter by status</p>
        <div className="flex gap-(--space-sm)">
          {STATUS_OPTIONS.map((status) => (
            <FilterChip
              key={status}
              label={status}
              isActive={statusFilter.includes(status)}
              onToggle={() => setStatusFilter(toggleChip(statusFilter, status))}
            />
          ))}
        </div>
      </div>
      <div className="comic-card w-fit h-fit p-3 flex flex-col items-center gap-1">
        <p>Filter by priority</p>
        <div className="flex gap-(--space-sm)">
          {PRIORITY_OPTIONS.map((priority) => (
            <FilterChip
              key={priority}
              label={priority}
              isActive={priorityFilter.includes(priority)}
              onToggle={() =>
                setPriorityFilter(toggleChip(priorityFilter, priority))
              }
            />
          ))}
        </div>
      </div>
      <div className="comic-card w-fit h-fit p-3 flex flex-col items-center gap-1">
        <p>Sort by status</p>
        <div className="flex gap-(--space-sm)">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSortBy(option)}
              className={cn(
                "comic-btn",
                sortBy === option ? "comic-btn-primary" : "comic-btn-ghost",
              )}
            >
              {option}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="comic-btn comic-btn-ghost"
          >
            {sortOrder === "asc" ? <ArrowBigUp /> : <ArrowBigDown />}
          </button>
        </div>
      </div>
      <div className="comic-card w-fit h-fit p-3 flex flex-col items-center gap-1">
        <p>Reset</p>
        <button
          type="button"
          onClick={resetFilters}
          className="comic-btn comic-btn-ghost"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
};
