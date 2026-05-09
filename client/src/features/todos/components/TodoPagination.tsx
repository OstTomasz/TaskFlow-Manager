import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TodoPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TodoPagination = ({
  page,
  totalPages,
  onPageChange,
}: TodoPaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex gap-2 items-center justify-center my-4">
      <button
        type="button"
        onClick={() => onPageChange(1)}
        className="comic-btn"
        disabled={page <= 1}
      >
        <ChevronFirst />
      </button>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        className="comic-btn"
        disabled={page <= 1}
      >
        <ChevronLeft />
      </button>
      <p>
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        className="comic-btn"
        disabled={page >= totalPages}
      >
        <ChevronRight />
      </button>

      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        className="comic-btn"
        disabled={page >= totalPages}
      >
        <ChevronLast />
      </button>
    </div>
  );
};
