import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import type { Todo } from "@taskflow/shared";
import { useTodoMutations } from "../hooks/useTodoMutations";
import { formatLabel } from "../utils/todoFilters.utils";
import { TodoItemActions } from "./TodoItemsActions";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const { deleteTodo, updateTodo } = useTodoMutations();
  const [activeForm, setActiveForm] = useState<"edit" | "delete" | null>(null);

  //todelete
  console.log(updateTodo);

  return (
    <Disclosure>
      {({ open }) => (
        <div className="p-3 w-full">
          {/* mobile: row 1 — title + chevron */}
          <div className="flex items-center justify-between md:hidden">
            <DisclosureButton className="flex items-center justify-between gap-2 flex-1 text-left">
              <p className="font-medium">{todo.title}</p>
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </DisclosureButton>
          </div>

          {/* mobile: row 2 — badges + actions */}
          <div className="flex items-center gap-2 mt-2 md:hidden">
            {activeForm === null ? (
              <>
                <span className={`badge badge-${todo.priority}`}>
                  {formatLabel(todo.priority)}
                </span>
                <span className={`badge badge-${todo.status}`}>
                  {formatLabel(todo.status)}
                </span>
                {open && (
                  <>
                    <button type="button" onClick={() => setActiveForm("edit")}>
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveForm("delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </>
            ) : null}
            <TodoItemActions
              open={open}
              activeForm={activeForm}
              onEdit={() => setActiveForm("edit")}
              onDelete={() => setActiveForm("delete")}
              onConfirmEdit={() => console.log("submit")}
              onConfirmDelete={() => deleteTodo.mutate(todo.id)}
              onCancel={() => setActiveForm(null)}
            />
          </div>

          {/* desktop: single row */}
          <div className="hidden md:flex items-center justify-between gap-4 w-full">
            {/* title — stała szerokość */}
            <DisclosureButton className="flex items-center gap-3 flex-1 text-left">
              <p className="font-medium">{todo.title}</p>
              {/* badges */}
              {activeForm === null && (
                <div className="flex items-center gap-2">
                  <span className={`badge badge-${todo.priority}`}>
                    {formatLabel(todo.priority)}
                  </span>
                  <span className={`badge badge-${todo.status}`}>
                    {formatLabel(todo.status)}
                  </span>
                </div>
              )}
            </DisclosureButton>

            {/* akcje + chevron na końcu */}
            <div className="flex items-center gap-3">
              <TodoItemActions
                open={open}
                activeForm={activeForm}
                onEdit={() => setActiveForm("edit")}
                onDelete={() => setActiveForm("delete")}
                onConfirmEdit={() => console.log("submit")}
                onConfirmDelete={() => deleteTodo.mutate(todo.id)}
                onCancel={() => setActiveForm(null)}
              />
              <DisclosureButton>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </DisclosureButton>
            </div>
          </div>

          <DisclosurePanel
            transition
            className="pt-2 overflow-hidden transition-all duration-300 ease-in-out data-closed:max-h-0 data-closed:-translate-y-2 data-closed:opacity-0 data-closed:pt-0 max-h-80"
          >
            {todo.description ?? "No description."}
          </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};
