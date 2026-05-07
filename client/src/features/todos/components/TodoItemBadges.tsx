import type { Todo } from "@taskflow/shared";
import { formatLabel } from "../utils/todoFilters.utils";

interface TodoItemBadgesProps {
  priority: Todo["priority"];
  status: Todo["status"];
  onPriorityClick?: () => void;
  onStatusClick?: () => void;
}

export const TodoItemBadges = ({
  priority,
  status,
  onPriorityClick,
  onStatusClick,
}: TodoItemBadgesProps) => (
  <div className="flex gap-2">
    <span
      className={`badge badge-${priority} ${onPriorityClick ? "cursor-pointer" : ""}`}
      onClick={onPriorityClick}
    >
      {formatLabel(priority)}
    </span>
    <span
      className={`badge badge-${status} ${onStatusClick ? "cursor-pointer" : ""}`}
      onClick={onStatusClick}
    >
      {formatLabel(status)}
    </span>
  </div>
);
