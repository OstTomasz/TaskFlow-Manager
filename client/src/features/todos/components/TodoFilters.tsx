import { FilterChip } from "./FilterChip";
import { cn } from "@/lib/cn";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import {
  formatLabel,
  PRIORITY_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  toggleChip,
  type TodoFiltersProps,
} from "../utils/todoFilters.utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const isShortScreen = useMediaQuery("(max-height: 630px)");

  return (
    <div
      className={cn(
        "flex flex-wrap flex-col gap-(--space-sm) items-center justify-center mx-auto",
        isShortScreen ? "pt-25" : "pt-0",
      )}
    >
      <div className="comic-card w-[95%] md:w-full h-fit p-3 flex flex-col items-center gap-1">
        <p>Find task</p>
        <input
          type="text"
          value={search}
          placeholder="search your task.."
          onChange={(e) => setSearch(e.target.value)}
          className="comic-input w-full"
        ></input>
      </div>
      <div className="comic-card w-[95%] md:w-full h-fit p-3 flex flex-col items-center gap-1">
        <p>Filter by status</p>
        <div className="flex gap-(--space-md)">
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
      <div className="comic-card w-[95%] md:w-full h-fit p-3 flex flex-col items-center gap-1">
        <p>Filter by priority</p>
        <div className="flex gap-(--space-sm) md:gap-(--space-md)">
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
      <div className="comic-card w-[95%] md:w-full h-fit p-3 flex flex-col items-center gap-1">
        <p>Sort by status</p>
        <div className="flex gap-(--space-md) flex-wrap justify-center">
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
              {formatLabel(option)}
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
      <div className="comic-card w-[95%] md:w-full h-fit p-3 flex flex-col items-center gap-2">
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
