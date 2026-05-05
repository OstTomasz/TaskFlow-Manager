import { cn } from "@/lib/cn";
import { formatLabel } from "../utils/todoFilters.utils";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onToggle: () => void;
}

export const FilterChip = ({ label, isActive, onToggle }: FilterChipProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "comic-btn",
        isActive ? `badge-${label}` : "comic-btn-ghost",
      )}
    >
      {formatLabel(label)}
    </button>
  );
};
