import { ClipboardList, SearchX, type LucideIcon } from "lucide-react";

interface TodoEmptyStateProps {
  variant: "empty" | "filtered";
}

type EmptyStateConfig = {
  icon: LucideIcon;
  message: string;
};

const EMPTY_STATE_CONFIG: Record<"empty" | "filtered", EmptyStateConfig> = {
  empty: {
    icon: ClipboardList,
    message: "There is nothing to do for now.",
  },
  filtered: {
    icon: SearchX,
    message: "There is no task matching your filters. Try something else.",
  },
};

/** Displays an empty state message based on the current list variant. */
export const TodoEmptyState = ({ variant }: TodoEmptyStateProps) => {
  const { icon: Icon, message } = EMPTY_STATE_CONFIG[variant];

  return (
    <div className="comic-panel flex flex-col items-center gap-(--space-sm) p-(--space-sm) max-w-3xl mx-auto w-[90%] md:w-full text-center">
      <Icon className="w-12 h-12 opacity-50" />
      <p className="font-medium">{message}</p>
    </div>
  );
};
