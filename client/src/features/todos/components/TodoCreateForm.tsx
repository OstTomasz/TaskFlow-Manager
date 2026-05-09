import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTodoSchema,
  TODO_PRIORITIES,
  TODO_STATUSES,
  type CreateTodoValues,
} from "@taskflow/shared";
import { useForm, useController, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Loader } from "lucide-react";
import { ComicSelect } from "@/components/ComicSelect";
import { formatLabel } from "../utils/todoFilters.utils";
import { useTodoMutations } from "../hooks/useTodoMutations";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface TodoCreateFormSchema {
  onClose: () => void;
}

export const TodoCreateForm = ({ onClose }: TodoCreateFormSchema) => {
  const [createMany, setCreateMany] = useState(false);
  const [createdItems, setCreatedItems] = useState<string[]>([]);
  const { createTodo } = useTodoMutations();
  const isShortScreen = useMediaQuery("(max-height: 630px)");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<CreateTodoValues>({
    defaultValues: {
      status: "todo",
      priority: "low",
      description: "",
    },
    resolver: zodResolver(CreateTodoSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<CreateTodoValues> = async (data) => {
    const todo = await createTodo.mutateAsync(data);
    setCreatedItems((prev) => [todo.title, ...prev]);
    reset();
    if (!createMany) onClose();
  };

  const { field: statusField } = useController({ name: "status", control });
  const { field: priorityField } = useController({ name: "priority", control });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "comic-panel w-full",
          isShortScreen ? "max-h-[440px]" : "max-h-dvh",
        )}
      >
        <input
          {...register("title")}
          placeholder="enter title"
          className="comic-input"
          type="text"
        ></input>
        <p className="error-message">{errors.title?.message}</p>
        <textarea
          {...register("description")}
          placeholder="describe it"
          className="comic-input mb-(--space-sm)"
        ></textarea>
        <ComicSelect
          options={TODO_STATUSES.map((s) => ({
            value: s,
            label: formatLabel(s),
          }))}
          value={statusField.value}
          onChange={statusField.onChange}
          error={errors.status?.message}
        />
        <ComicSelect
          options={TODO_PRIORITIES.map((p) => ({
            value: p,
            label: formatLabel(p),
          }))}
          value={priorityField.value}
          onChange={priorityField.onChange}
          error={errors.priority?.message}
        />

        <label className="comic-checkbox-container flex items-center gap-2 cursor-pointer w-fit mb-(--space-sm)">
          <input
            type="checkbox"
            onChange={() => setCreateMany(!createMany)}
            checked={createMany}
            className="comic-checkbox"
          />
          <span className="font-bold text-sm mt-1">Create Many</span>
        </label>
        <button type="submit" disabled={isSubmitting} className="comic-btn">
          {isSubmitting ? (
            <>
              <Loader className="animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            "Create"
          )}
        </button>
        {createdItems.length > 0 ? (
          <div className="mt-(--space-sm)">
            <p className="font-bold text-sm">Created: {createdItems.length}</p>
            <ul
              className={cn(
                "list-disc list-inside text-sm mt-1 overflow-scroll",
                isShortScreen ? "max-h-15" : "max-h-35",
              )}
            >
              {createdItems.map((item, i) => (
                <li key={`created-${i}`}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </form>
    </>
  );
};
