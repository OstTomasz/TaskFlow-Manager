import type { Todo } from "@taskflow/shared";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
}

export const TodoList = ({ todos }: TodoListProps) => {
  return (
    <ul className="w-[90%] md:w-full px-2 h-fit flex flex-col gap-5 py-5 max-w-3xl mx-auto mb-5 overflow-hidden divide-y divide-(--border-color) rounded-xl border-(length:--border-width) border-(--border-color) shadow-(--shadow) bg-(--bg-surface) cursor-default">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};
