import { Check, Pencil, Trash2, X } from "lucide-react";

interface TodoItemActionsProps {
  open: boolean;
  activeForm: "edit" | "delete" | null;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmEdit: () => void;
  onConfirmDelete: () => void;
  onCancel: () => void;
}

export const TodoItemActions = ({
  open,
  activeForm,
  onEdit,
  onDelete,
  onConfirmEdit,
  onConfirmDelete,
  onCancel,
}: TodoItemActionsProps) => {
  if (!open) return null;

  if (activeForm === "edit")
    return (
      <>
        <button type="button" onClick={onConfirmEdit}>
          <Check size={16} />
        </button>
        <button type="button" onClick={onCancel}>
          <X size={16} />
        </button>
      </>
    );

  if (activeForm === "delete")
    return (
      <>
        <button type="button" onClick={onConfirmDelete}>
          <Trash2 size={16} />
        </button>
        <button type="button" onClick={onCancel}>
          <X size={16} />
        </button>
      </>
    );

  return (
    <>
      <button type="button" onClick={onEdit}>
        <Pencil size={16} />
      </button>
      <button type="button" onClick={onDelete}>
        <Trash2 size={16} />
      </button>
    </>
  );
};
