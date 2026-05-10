// server/src/features/auth/auth.model.ts
import mongoose, {
  type Document,
  type Model,
  type FlattenMaps,
  Schema,
} from "mongoose";
import type { User } from "@taskflow/shared";

/**
 * IUser extends the shared User type (SSoT from @taskflow/shared).
 * Adds refreshToken (server-only, never exposed to client)
 * and Mongoose Document methods (_id, save, etc).
 * Omit<> removes 'id' — Mongo provides _id, we map it in toJSON.
 */
export interface IUser extends Omit<User, "id">, Document {
  refreshToken: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    avatar: { type: String, required: true },
    password: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true },
);

/**
 * Local type for toJSON transform — reflects the raw Mongoose document
 * shape before sanitization. Fields are optional so `delete` compiles.
 * Used only inside transform, never exposed outside this file.
 */
type RawUserDoc = {
  _id?: unknown;
  __v?: unknown;
  id?: string;
  password?: string;
  refreshToken?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  name: string;
  avatar: string;
};

UserSchema.set("toJSON", {
  transform(_doc, ret) {
    const raw = ret as unknown as RawUserDoc;
    raw.id = String(raw._id);
    delete raw._id;
    delete raw.__v;
    delete raw.password;
    delete raw.refreshToken;
    delete raw.createdAt;
    delete raw.updatedAt;
    return raw;
  },
});

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  UserSchema,
);
