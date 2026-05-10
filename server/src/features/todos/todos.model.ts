import mongoose, { type Document, type Model, Schema } from "mongoose";
import type { Todo } from "@taskflow/shared";

/**
 * ITodo extends shared Todo type (SSoT).
 * Omit<> removes 'id' — Mongo provides _id, mapped in toJSON.
 * creationDate/lastModifiedDate handled by timestamps + defaults.
 */
export interface ITodo
  extends
    Omit<Todo, "id" | "creationDate" | "lastModifiedDate" | "completeDate">,
    Document {
  creationDate: Date;
  lastModifiedDate: Date;
  completeDate?: Date | null;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 50,
    },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "crucial"],
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      required: true,
    },
    /**
     * Set automatically when status changes to "done".
     * Cleared when status changes away from "done".
     */
    completeDate: { type: Date, default: null },
    userId: { type: String, required: true },
  },
  { timestamps: { createdAt: "creationDate", updatedAt: "lastModifiedDate" } },
);

/**
 * Index on userId — every query filters by userId,
 * without index Mongo does full collection scan.
 */
TodoSchema.index({ userId: 1 });

type RawTodoDoc = {
  _id?: unknown;
  __v?: unknown;
  id?: string;
  userId?: unknown;
};

TodoSchema.set("toJSON", {
  transform(_doc, ret) {
    const raw = ret as unknown as RawTodoDoc;
    raw.id = String(raw._id);
    delete raw._id;
    delete raw.__v;
    return raw;
  },
});

export const TodoModel: Model<ITodo> = mongoose.model<ITodo>(
  "Todo",
  TodoSchema,
);
