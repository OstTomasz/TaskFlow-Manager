import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  EditTodoSchema,
  TODO_PRIORITIES,
  TODO_STATUSES,
  type EditTodoValues,
  type Todo,
} from "@taskflow/shared";
import { useTodoMutations } from "../hooks/useTodoMutations";
import { cycleValue } from "../utils/todoFilters.utils";
import { TodoItemActions } from "./TodoItemsActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { TodoItemBadges } from "./TodoItemBadges";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const { deleteTodo, updateTodo } = useTodoMutations();
  const [activeForm, setActiveForm] = useState<"edit" | "delete" | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<EditTodoValues>({
    resolver: zodResolver(EditTodoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description ?? "",
      priority: todo.priority,
      status: todo.status,
      badge: todo.badge,
    },
    mode: "onBlur",
  });

  const watchPriority = useWatch({ control, name: "priority" });
  const watchStatus = useWatch({ control, name: "status" });

  const onConfirmEdit = handleSubmit((data) => {
    updateTodo.mutate({ id: todo.id, ...data });
    setActiveForm(null);
  });

  const onCancel = () => {
    reset();
    setActiveForm(null);
  };

  return (
    <Disclosure>
      {({ open }) => {
        const actionProps = {
          open,
          activeForm,
          isDisabled: isSubmitting,
          onEdit: () => setActiveForm("edit"),
          onDelete: () => setActiveForm("delete"),
          onConfirmEdit,
          onConfirmDelete: () => deleteTodo.mutate(todo.id),
          onCancel,
        };

        const editBadgeProps = {
          priority: watchPriority,
          status: watchStatus,
          onPriorityClick: () =>
            setValue(
              "priority",
              cycleValue(TODO_PRIORITIES, getValues("priority")),
            ),
          onStatusClick: () =>
            setValue("status", cycleValue(TODO_STATUSES, getValues("status"))),
        };

        const viewBadgeProps = {
          priority: todo.priority,
          status: todo.status,
        };

        return (
          <div className="p-3 w-full">
            {activeForm === "edit" ? (
              <>
                <input
                  {...register("title")}
                  className="comic-input w-full mb-1"
                />

                <p className="error-message">{errors?.title?.message}</p>
              </>
            ) : null}

            {activeForm !== "edit" && (
              <div className="flex items-center justify-between md:hidden">
                <DisclosureButton className="flex-1 text-left">
                  <p className="font-medium">{todo.title}</p>
                </DisclosureButton>
              </div>
            )}

            <div className="flex items-center gap-2 mt-2 md:hidden">
              {activeForm === "edit" ? (
                <TodoItemBadges {...editBadgeProps} />
              ) : (
                <>
                  <TodoItemBadges {...viewBadgeProps} />
                  <DisclosureButton>
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </DisclosureButton>
                </>
              )}
              <TodoItemActions {...actionProps} />
            </div>

            <div className="hidden md:flex items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3 flex-1">
                {activeForm !== "edit" ? (
                  <DisclosureButton className="flex-1 text-left">
                    <p className="font-medium">{todo.title}</p>
                  </DisclosureButton>
                ) : null}

                {activeForm === "edit" ? (
                  <div className="flex gap-2">
                    <TodoItemBadges {...editBadgeProps} />
                    <div className="flex items-center gap-3">
                      <TodoItemActions {...actionProps} />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="flex items-center gap-3">
                      <TodoItemActions {...actionProps} />
                    </div>
                    <TodoItemBadges {...viewBadgeProps} />
                    <DisclosureButton>
                      {open ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </DisclosureButton>
                  </div>
                )}
              </div>
            </div>

            <DisclosurePanel
              transition
              className="pt-2 overflow-hidden transition-all duration-300 ease-in-out data-closed:max-h-0 data-closed:-translate-y-2 data-closed:opacity-0 data-closed:pt-0 max-h-80"
            >
              {activeForm === "edit" ? (
                <textarea
                  {...register("description")}
                  className="comic-input mt-2"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p className="text-sm text-(--text-muted)">
                  {todo.description ?? "No description."}
                </p>
              )}
            </DisclosurePanel>
          </div>
        );
      }}
    </Disclosure>
  );
};
