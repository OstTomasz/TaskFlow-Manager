import { create } from "zustand";

interface TodoState {
  expandedId: string | null;
  activeForm: "edit" | "delete" | null;
  toggleExpand: (id: TodoState["expandedId"]) => void;
  setActiveForm: (form: "edit" | "delete" | null) => void;
  collapse: () => void;
}

export const useTodoStore = create<TodoState>()((set) => ({
  expandedId: null,
  activeForm: null,
  toggleExpand: (id) =>
    set((state) =>
      state.expandedId === id
        ? { expandedId: null, activeForm: null }
        : { expandedId: id, activeForm: null },
    ),
  setActiveForm: (form) => set({ activeForm: form }),
  collapse: () => set({ expandedId: null, activeForm: null }),
}));
